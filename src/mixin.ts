import { ThisTypedComponentOptionsWithArrayProps } from 'vue/types/options'
import { Vue } from 'vue/types/vue'

type TriggerFunction = () => void

export const sharedElementMixin = {
  data() {
    return {
      $_vSharedElement_triggers: [] as TriggerFunction[],
      $_vSharedElement_firstRender: true
    }
  },
  methods: {
    $keepSharedElementAlive(trigger: TriggerFunction) {
      this.$data.$_vSharedElement_triggers.push(trigger)
    }
  },
  activated() {
    if (this.$data.$_vSharedElement_firstRender) return (this.$data.$_vSharedElement_firstRender = false)

    this.$data.$_vSharedElement_triggers.forEach((trigger: TriggerFunction) => trigger())
  }
} as ThisTypedComponentOptionsWithArrayProps<Vue, unknown, unknown, unknown, never>
