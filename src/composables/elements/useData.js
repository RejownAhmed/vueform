import _ from 'lodash'
import moment from 'moment'
import { computed, nextTick, toRefs, watch, ref, onMounted, onBeforeUpdate, onUnmounted } from 'composition-api'
import checkDateFormat from './../../utils/checkDateFormat'

const base = function(props, context, dependencies, options = {})
{
  const {
    submit,
    formatData,
    formatLoad,
    name,
  } = toRefs(props)

  // ============ DEPENDENCIES =============

  const form$ = dependencies.form$
  const available = dependencies.available
  const value = dependencies.value
  const resetValidators = dependencies.resetValidators
  const defaultValue = dependencies.defaultValue
  const nullValue = dependencies.nullValue

  // =============== PRIVATE ===============

  const setValue = (val) => {
    if (options.setValue) {
      return options.setValue(val)
    }

    value.value = val
  }

  // ============== COMPUTED ===============
  
  /**
   * 
   * 
   * @type {object}
   */
  const data = computed(() => {
    return {[name.value]: value.value}
  })
  
  /**
   * An object containing the element `name` as a key and its `value` as value only if the element is available and `submit` is not set to `false`.
   * 
   * @type {object}
   */
  const output = computed(() => {
    if (!available.value || !submit.value) {
      return {}
    }

    return formatData.value ? formatData.value(name.value, value.value, form$.value) : {[name.value]: value.value}
  })

  // =============== METHODS ===============

  /**
   * 
   * 
   * @param {string|number} value* The value to be loaded.
   * @param {boolean} format Whether the loaded value should be formatted with `formatLoad` before applying values to the element. Default: `false`.
   * @returns {void}
   */
  const load = (val, format = false) => {
    setValue(format && formatLoad.value ? formatLoad.value(val, form$.value) : val)
  }

  /**
   * 
   * 
   * @param {string|number} value* The value to update the field with.
   * @returns {void}
   */
  const update = (val) => {
    setValue(val)
  }

  /**
   * 
   * 
   * @returns {void}
   */
  const clear = () => {
    setValue(_.cloneDeep(nullValue.value))
  }

  /**
   * 
   * 
   * @returns {void}
   */
  const reset = () => {
    setValue(_.cloneDeep(defaultValue.value))
    resetValidators()
  }

  /**
   * 
   *
   * @returns {void}
   * @private
   */
  const prepare = async () => {}

  return {
    data,
    output,
    load,
    update,
    clear,
    reset,
    prepare,
  }
}

const object = function(props, context, dependencies)
{
  const {
    name,
    formatLoad,
    formatData,
    submit,
  } = toRefs(props)

  const {
    data,
    prepare
  } = base(props, context, dependencies)

  // ============ DEPENDENCIES =============

  const form$ = dependencies.form$
  const available = dependencies.available
  const children$ = dependencies.children$

  // ============== COMPUTED ===============
  
  const output = computed(() => {
    if (!available.value || !submit.value) {
      return {}
    }
    
    let output = {}

    _.each(children$.value, (element$) => {
      if (element$.isStatic) {
        return
      }

      output = Object.assign({}, output, element$.output)
    })

    return formatData.value ? formatData.value(name.value, output, form$.value) : {[name.value]: output}
  })

  // =============== METHODS ===============

  /**
   * 
   * 
   * 
   * @param {object} value* The value to be loaded.
   * @param {boolean} format Whether the loaded value should be formatted with `formatLoad` before applying values to the element. Default: `false`.
   * @returns {void}
   */
  const load = (val, format = false) => {
    let formatted = format && formatLoad.value ? formatLoad.value(val, form$.value) : val

    _.each(children$.value, (element$) => {
      if (element$.isStatic) {
        return
      }
      
      if (!element$.flat && formatted[element$.name] === undefined) {
        element$.clear()
        return
      }

      element$.load(element$.flat ? formatted : formatted[element$.name], format)
    })
  }

  /**
   * 
   * 
   * @param {object} value* The value to update the field with.
   * @returns {void}
   */
  const update = (val) => {
    _.each(children$.value, (element$) => {
      if (element$.isStatic) {
        return
      }

      if (val[element$.name] === undefined && !element$.flat) {
        return
      }

      element$.update(element$.flat ? val : val[element$.name])
    })
  }

  const clear = () => {
    _.each(children$.value, (element$) => {
      if (element$.isStatic) {
        return
      }

      element$.clear()
    })
  }

  const reset = () => {
    _.each(children$.value, (element$) => {
      if (element$.isStatic) {
        return
      }
      
      element$.reset()
    })
  }

  return {
    data,
    output,
    load,
    update,
    clear,
    reset,
    prepare,
  }
}

const group = function(props, context, dependencies)
{
  const {
    name,
    formatData,
    submit,
  } = toRefs(props)

  const {
    load,
    update,
    clear,
    reset,
    prepare
  } = object(props, context, dependencies)

  // ============ DEPENDENCIES =============

  const form$ = dependencies.form$
  const children$ = dependencies.children$
  const available = dependencies.available
  const value = dependencies.value

  // ============== COMPUTED ===============

  const data = computed(() => {
    return value.value
  })

  const output = computed(() => {
    if (!available.value || !submit.value) {
      return {}
    }
    
    let output = {}

    _.each(children$.value, (element$) => {
      if (element$.isStatic) {
        return
      }

      output = Object.assign({}, output, element$.output)
    })

    return formatData.value ? formatData.value(name.value, output, form$.value) : output
  })

  return {
    data,
    output,
    load,
    update,
    clear,
    reset,
    prepare,
  }
}

const list = function(props, context, dependencies, options)
{
  const {
    name,
    storeOrder,
    formatLoad,
    formatData,
    order,
    submit,
    initial,
    default: default_,
  } = toRefs(props)

  const {
    update,
    clear,
    reset,
    prepare,
    data,
  } = base(props, context, dependencies)

  // ============ DEPENDENCIES =============

  const form$ = dependencies.form$
  const children$ = dependencies.children$
  const available = dependencies.available
  const isDisabled = dependencies.isDisabled
  const value = dependencies.value
  const orderByName = dependencies.orderByName
  const refreshOrderStore = dependencies.refreshOrderStore
  const dataPath = dependencies.dataPath
  const parent = dependencies.parent
  const nullValue = dependencies.nullValue
  const defaultValue = dependencies.defaultValue
  const fire = dependencies.fire

  // ================ DATA =================

  const initialValue = ref(_.get(form$.value.model, dataPath.value))

  // ============== COMPUTED ===============

  const parentDefaultValue = computed(() => {
    return parent && parent.value ? parent.value.defaultValue[name.value] : form$.value.options.default[name.value]
  })
  
  const output = computed(() => {
    if (!available.value || !submit.value) {
      return {}
    }
    
    let output = []

    _.each(children$.value, (element$) => {
      let val = element$.output[element$.name]

      if (val !== undefined) {
        output.push(val)
      }
    })

    return formatData.value ? formatData.value(name.value, output, form$.value) : {[name.value]: output}
  })

  // =============== METHODS ===============

  /**
   * 
   * 
   * 
   * @param {object|array|string|number|boolean} value  
   * @returns {void}
   */
  const add = (val = undefined) => {
    let newValue = storeOrder.value ? Object.assign({}, val || {}, {
      [storeOrder.value]: val ? val[storeOrder.value] : undefined
    }) : val

    value.value = value.value.concat([newValue])

    value.value = refreshOrderStore(value.value)

    let index = value.value.length - 1

    fire('add', newValue, index, value.value)
    
    return index
  }
  
  /**
   * 
   * 
   * 
   * @param {number} index*   
   * @returns {void}
   */
  const remove = (index) => {
    value.value = value.value.filter((v,i)=>i!==index)

    refreshOrderStore(value.value)

    fire('remove', index, value.value)
  }

  /**
   * 
   * 
   * @private
   */
  const load = async (val, format = false) => {
    let values = sortValue(format && formatLoad.value ? formatLoad.value(val, form$.value) : val)

    clear()

    await nextTick()

    for(let i = 0; i < values.length; i++) {
      add()
    }
    
    await nextTick()

    _.each(children$.value, (child$, i) => {
      child$.load(values[i], format)
    })
  }

  /**
   * 
   * 
   * 
   * @param {array} value  
   * @returns {array}
   * @private
   */
  const sortValue = (val) => {
    if ((!order.value && !orderByName.value) || (!val)) {
      return val
    }

    const desc = order.value && typeof order.value === 'string' && order.value.toUpperCase() == 'DESC'

    if (orderByName.value) {
      val = desc ? _.sortBy(val, orderByName.value).reverse() : _.sortBy(val, orderByName.value)
    }
    else if (order.value) {
      val = desc ? val.sort().reverse() : val.sort()
    }

    return val
  }

  /**
   * 
   * 
   * 
   * @returns {void}
   * @private
   */
  const handleAdd = () => {
    if (isDisabled.value) {
      return
    }

    add()
  }

  /**
   * Triggered when the user removes a list item or `.remove()` method is invoked.
   *
   * @param {number} index* Index of child to be removed.
   * @returns {void}
   * @private
   */
  const handleRemove = (index) => {
    if (isDisabled.value) {
      return
    }

    remove(index)
  }

  // ================ HOOKS ===============

  if (initialValue.value === undefined && parentDefaultValue.value === undefined && default_.value === undefined) {
    if (initial.value > 0) {
      for (let i = 0; i < initial.value; i++) {
        add()
      }
    } else {
      value.value = nullValue.value
    }
  } else if (initialValue.value === undefined) {
    value.value = defaultValue.value
  }

  return {
    output,
    data,
    add,
    remove,
    load,
    update,
    clear,
    reset,
    handleAdd,
    handleRemove,
    prepare,
  }
}

const date = function(props, context, dependencies)
{
  const {
    formatLoad,
  } = toRefs(props)

  const {
    data,
    output,
    update,
    clear,
    reset,
    prepare
  } = base(props, context, dependencies)

  // ============ DEPENDENCIES =============

  const form$ = dependencies.form$
  const value = dependencies.value
  const loadDateFormat = dependencies.loadDateFormat

  // =============== METHODS ===============

  const load = (val, format = false) => {
    let formatted = format && formatLoad.value ? formatLoad.value(val, form$.value) : val

    checkDateFormat(loadDateFormat.value, formatted)

    value.value = formatted instanceof Date || !formatted ? formatted : moment(formatted, loadDateFormat.value).toDate()
  }

  return {
    data,
    output,
    load,
    update,
    clear,
    reset,
    prepare,
  }
}

const dates = function(props, context, dependencies)
{
  const {
    formatLoad
  } = toRefs(props)

  const {
    data,
    output,
    update,
    clear,
    reset,
    prepare
  } = base(props, context, dependencies)

  // ============ DEPENDENCIES =============

  const form$ = dependencies.form$
  const value = dependencies.value
  const loadDateFormat = dependencies.loadDateFormat

  // =============== METHODS ===============

  /**
   * 
   * 
   * 
   * @param {array} value* The value to be loaded.
   * @param {boolean} format Whether the loaded value should be formatted with `formatLoad` before applying values to the element. Default: `false`.
   * @returns {void}
   */
  const load = (val, format = false) => {
    let formatted = format && formatLoad.value ? formatLoad.value(val, form$.value) : val

    value.value = _.map(formatted, (v) => {
      checkDateFormat(loadDateFormat.value, v)

      return v instanceof Date ? v : moment(v, loadDateFormat.value).toDate()
    })
  }

  return {
    data,
    output,
    load,
    update,
    clear,
    reset,
    prepare,
  }
}

const multilingual = function(props, context, dependencies, options = {})
{
  const {
    formatLoad,
  } = toRefs(props)

  const {
    data,
    output,
    clear,
    reset,
    prepare,
  } = base(props, context, dependencies, options)

  // ============ DEPENDENCIES =============

  const form$ = dependencies.form$
  const value = dependencies.value
  const language = dependencies.language
  const nullValue = dependencies.nullValue

  // =============== PRIVATE ===============

  const setValue = (val) => {
    if (options.setValue) {
      return options.setValue(val)
    }

    value.value = val
  }

  // =============== METHODS ===============

  const load = (val, format = false) => {
    let formatted = format && formatLoad.value ? formatLoad.value(val, form$.value) : val

    if (!_.isPlainObject(formatted)) {
      throw new Error('Multilingual element requires an object to load')
    }

    setValue(Object.assign({}, _.clone(nullValue.value), formatted))
  }

  const update = (val) => {
    let updateValue = val

    if (!_.isPlainObject(updateValue)) {
      updateValue = {
        [language.value]: val,
      }
    }
    
    setValue(Object.assign({}, value.value, updateValue))
  }

  return {
    data,
    output,
    load,
    update,
    clear,
    reset,
    prepare,
  }
}

const trix = function(props, context, dependencies)
{
  const {
    data,
    output,
    load,
    update,
    clear,
    reset,
    prepare
  } = base(props, context, dependencies, {
    setValue: (val) => {
      value.value = val

      nextTick(() => {
        input.value.update(val)
      })
    }
  })

  // ============ DEPENDENCIES =============

  const input = dependencies.input
  const value = dependencies.value

  return {
    data,
    output,
    load,
    update,
    clear,
    reset,
    prepare,
  }
}

const ttrix = function(props, context, dependencies)
{
  const {
    data,
    output,
    load,
    update,
    clear,
    reset,
    prepare
  } = multilingual(props, context, dependencies, {
    setValue: (val) => {
      value.value = val

      nextTick(() => {
        input.value.update(val[language.value])
      })
    }
  })

  // ============ DEPENDENCIES =============

  const input = dependencies.input
  const model = dependencies.model
  const value = dependencies.value
  const language = dependencies.language

  // ============== WATCHERS ==============

  watch(language, () => {
    input.value.update(model.value)
  })

  return {
    data,
    output,
    load,
    update,
    clear,
    reset,
    prepare,
  }
}

export {
  date,
  dates,
  object,
  group,
  list,
  multilingual,
  trix,
  ttrix,
}

export default base