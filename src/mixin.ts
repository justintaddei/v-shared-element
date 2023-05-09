import { ThisTypedComponentOptionsWithArrayProps } from 'vue-2/types/options'
import { Vue } from 'vue-2/types/vue'
import { ComponentOptions as ComponentOptions3 } from 'vue-3'

type ComponentOptions = ThisTypedComponentOptionsWithArrayProps<
  Vue,
  unknown,
  unknown,
  unknown,
  any,
  unknown,
  any,
  never
> &
  ComponentOptions3

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
} as ComponentOptions
