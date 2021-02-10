import { toRefs, onMounted, markRaw } from 'composition-api'
import useForm$ from './../../composables/useForm$'
import useTheme from './../../composables/useTheme'
import useInput from './../../composables/elements/useInput'
import usePath from './../../composables/elements/usePath'
import useConditions from './../../composables/useConditions'
import useDefault from './../../composables/elements/useDefault'
import useNullValue from './../../composables/elements/useNullValue'
import useLabel from './../../composables/elements/useLabel'
import useColumns from './../../composables/elements/useColumns'
import useView from './../../composables/elements/useView'
import useComponents from './../../composables/elements/useComponents'
import useSlots from './../../composables/elements/useSlots'
import useDisabled from './../../composables/elements/useDisabled'
import useEvents from './../../composables/useEvents'
import useEmpty from './../../composables/elements/useEmpty'
import useImage from './../../composables/elements/useImage'
import useRequest from './../../composables/elements/useRequest'
import useData from './../../composables/elements/useData'
import useDrop from './../../composables/elements/useDrop'
import useRemoving from './../../composables/elements/useRemoving'
import useHandleError from './../../composables/elements/useHandleError'

import { image as useBaseElement } from './../../composables/elements/useBaseElement'
import { file as useValue } from './../../composables/elements/useValue'
import { file as useValidation } from './../../composables/elements/useValidation'
import { file as useGenericName } from './../../composables/elements/useGenericName'
import { file as useClasses } from './../../composables/elements/useClasses'

export default {
  name: 'ImageElement',
  emits: ['change', 'remove', 'error'],
  slots: ['label', 'info', 'description', 'error', 'message', 'before', 'between', 'after', 'progress', 'preview'],
  props: {
    name: {
      required: true,
      type: [String, Number],
    },
    embed: {
      type: Boolean,
      required: false,
      default: false
    },
    type: {
      required: false,
      type: [String],
      default: 'image'
    },
    addClass: {
      required: false,
      type: [String, Array, Object],
      default: null
    },
    overrideClasses: {
      required: false,
      type: [Object],
      default: () => ({})
    },
    addClasses: {
      required: false,
      type: [Object],
      default: () => ({})
    },
    columns: {
      required: false,
      type: [Object, String],
      default: null
    },
    overrideComponents: {
      required: false,
      type: [Object],
      default: () => ({})
    },
    conditions: {
      required: false,
      type: [Array],
      default: () => ([])
    },
    formatData: {
      required: false,
      type: [Function],
      default: null
    },
    formatLoad: {
      required: false,
      type: [Function],
      default: null
    },
    submit: {
      required: false,
      type: [Boolean],
      default: true
    },
    debounce: {
      required: false,
      type: [Number],
      default: null
    },
    default: {
      required: false,
      type: [String, File],
      default: null
    },
    description: {
      required: false,
      type: [String],
      default: null
    },
    disabled: {
      required: false,
      type: [Boolean],
      default: false
    },
    drop: {
      required: false,
      type: [Boolean],
      default: false
    },
    id: {
      required: false,
      type: [String],
      default: null
    },
    accept: {
      required: false,
      type: [String, Array],
      default: null
    },
    auto: {
      required: false,
      type: [Boolean],
      default: true
    },
    methods: {
      required: false,
      type: [Object],
      default: () => ({})
    },
    endpoints: {
      required: false,
      type: [Object],
      default: () => ({})
    },
    url: {
      required: false,
      type: [String],
      default: null
    },
    info: {
      required: false,
      type: [String],
      default: null
    },
    label: {
      required: false,
      type: [String],
      default: null
    },
    before: {
      required: false,
      type: [Object, String, Number],
      default: null
    },
    between: {
      required: false,
      type: [Object, String, Number],
      default: null
    },
    after: {
      required: false,
      type: [Object, String, Number],
      default: null
    },
    slots: {
      required: false,
      type: [Object],
      default: () => ({})
    },
    rules: {
      required: false,
      type: [Array, String, Object],
      default: null
    },
    messages: {
      required: false,
      type: [Object],
      default: () => ({})
    },
    displayError: {
      required: false,
      type: [Boolean],
      default: true
    },
  },
  setup(props, context) {
    const { schema } = toRefs(props)

    const form$ = useForm$(props, context)
    const theme = useTheme(props, context)
    const input = useInput(props, context)
    const path = usePath(props, context)
    const disabled = useDisabled(props, context)
    const nullValue = useNullValue(props, context)
    const removing = useRemoving(props, context)

    const baseElement = useBaseElement(props, context, {
      form$: form$.form$,
    })

    const request = useRequest(props, context, {
      form$: form$.form$,
    })

    const default_ = useDefault(props, context, {
      nullValue: nullValue.nullValue
    })

    const value = useValue(props, context, {
      nullValue: nullValue.nullValue,
      defaultValue: default_.defaultValue,
    })

    const conditions = useConditions(props, context, {
      form$: form$.form$,
      path: path.path,
      descriptor: schema,
    })

    const validation = useValidation(props, context, {
      form$: form$.form$,
      path: path.path,
      value: value.value,
      uploading: request.uploading,
      removing: removing.removing,
    })

    const events = useEvents(props, context, {
      form$: form$.form$,
      descriptor: schema,
    }, {
      events: [
        'change', 'remove', 'error',
      ],
    })

    const data = useData(props, context, {
      form$: form$.form$,
      available: conditions.available,
      value: value.value,
      currentValue: value.currentValue,
      previousValue: value.previousValue,
      clean: validation.clean,
      validate: validation.validate,
      resetValidators: validation.resetValidators,
      fire: events.fire,
      defaultValue: default_.defaultValue,
      nullValue: nullValue.nullValue,
      dirt: validation.dirt,
    })

    const handleError = useHandleError(props, context, {
      fire: events.fire,
      listeners: events.listeners,
    })

    const image = useImage(props, context, {
      form$: form$.form$,
      value: value.value,
      previousValue: value.previousValue,
      isDisabled: disabled.isDisabled,
      validate: validation.validate,
      invalid: validation.invalid,
      path: path.path,
      input: input.input,
      update: data.update,
      fire: events.fire,
      listeners: events.listeners,
      uploading: request.uploading,
      request: request.request,
      axios: request.axios,
      isImageType: baseElement.isImageType,
      removing: removing.removing,
      handleError: handleError.handleError,
    })
    
    const drop = useDrop(props, context, {
      update: data.update,
      isDisabled: disabled.isDisabled,
      accept: image.accept,
    })

    const empty = useEmpty(props, context, {
      value: value.value,
      nullValue: nullValue.nullValue,
    })

    const label = useLabel(props, context, {
      form$: form$.form$,
    })

    const genericName = useGenericName(props, context, {
      form$: form$.form$,
      label: label.label,
      filename: image.filename,
    })
    
    const components = useComponents(props, context, {
      theme: theme.theme,
      form$: form$.form$
    })

    const classes = useClasses(props, context, {
      form$: form$.form$,
      theme: theme.theme,
      removing: removing.removing,
    })

    const columns = useColumns(props, context, {
      form$: form$.form$,
    })

    const view = useView(props, context, {
      available: conditions.available,
    })

    const slots = useSlots(props, context, {
      form$: form$.form$,
      components: components.components,
    }, {
      slots: [
        'label', 'info', 'description', 'error',
        'message', 'before', 'between', 'after',
        'progress', 'preview',
      ],
      defaultSlots: {
        preview: 'ImageSlotPreview',
      }
    })

    onMounted(() => {
      validation.initMessageBag()
      validation.initValidation()
    })

    return {
      ...form$,
      ...theme,
      ...input,
      ...path,
      ...conditions,
      ...value,
      ...validation,
      ...label,
      ...classes,
      ...columns,
      ...baseElement,
      ...genericName,
      ...genericName,
      ...view,
      ...components,
      ...slots,
      ...disabled,
      ...events,
      ...data,
      ...empty,
      ...default_,
      ...nullValue,
      ...image,
      ...request,
      ...drop,
      ...removing,
      ...handleError,
    }
  } 
}