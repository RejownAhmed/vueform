import { computed, toRefs } from 'composition-api'
import useElementComponent from './../../../composables/useElementComponent'

export default {
  name: 'RadiogroupRadio',
  props: {
    item: {
      type: [Object, String, Number],
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    items: {
      type: [Object],
      required: true
    },
    index: {
      type: [Number],
      required: true
    },
  },
  setup(props, context)
  {
    const { value } = toRefs(props)

    const {
      el$,
      form$,
      Size,
      View,
      classesInstance,
      classes,
      templates,
      template,
      theme,
    } = useElementComponent(props, context)

    // ============== COMPUTED ==============

    /**
     * Whether the radio should be disabled.
     * 
     * @type {boolean}
     */
    const isDisabled = computed(() => {
      return el$.value.disabledItems.map(i=>String(i)).indexOf(String(value.value)) !== -1 || el$.value.isDisabled
    })

    /**
     * The `id` attribute of the input.
     * 
     * @type {boolean}
     */
    const id = computed(() => {
      return `${el$.value.fieldId}-${value.value}`
    })

    /**
     * The `name` attribute of the input.
     * 
     * @type {boolean}
     */
    const name = computed(() => {
      return el$.value.path
    })

    return {
      el$,
      form$,
      Size,
      View,
      classesInstance,
      classes,
      templates,
      template,
      theme,
      isDisabled,
      id,
      name,
    }
  },
}