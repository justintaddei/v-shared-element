<template>
  <button v-if="!to" v-wave :class="['button', look]">
    <Icon v-if="icon && leftIcon" :size="18" :name="icon" class="icon-left" />
    <slot />
    <Icon v-if="icon && !leftIcon" :size="18" :name="icon" />
  </button>
  <a
    v-else-if="external"
    v-wave
    :class="['button', look]"
    target="_blank"
    rel="noopener"
    :href="to"
  >
    <Icon v-if="icon && leftIcon" :size="18" :name="icon" class="icon-left" />
    <slot />
    <Icon v-if="icon && !leftIcon" :size="18" :name="icon" />
  </a>
  <nuxt-link v-else v-wave :class="['button', look]" :to="to">
    <Icon v-if="icon && leftIcon" :size="18" :name="icon" class="icon-left" />
    <slot />
    <Icon v-if="icon && !leftIcon" :size="18" :name="icon" />
  </nuxt-link>
</template>

<script>
import Icon from './Icon.vue'
export default {
  components: {
    Icon,
  },
  props: {
    to: {
      default: '',
      type: String,
    },
    look: {
      type: String,
      default: 'primary',
    },
    leftIcon: Boolean,
    icon: {
      type: String,
      default: '',
    },
  },
  computed: {
    external() {
      return /https?:\/\//.test(this.to)
    },
  },
}
</script>

<style scoped>
.button {
  padding: 12px 32px 12px 32px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 1rem;
  border: none;
  outline: none;
  cursor: pointer;
  white-space: nowrap;
  transition: transform 0.15s ease;
}

.button:hover {
  transform: scale(1.08);
}
.button:active {
  transform: scale(0.95);
}

.button.primary {
  background: var(--green);
  color: var(--off-white);
  box-shadow: 0 16px 32px rgba(79, 192, 141, 0.25);
}

.button.secondary {
  background: var(--white);
  color: var(--cobalt);
  box-shadow: 0 16px 32px rgba(53, 73, 94, 0.1);
}

.button > .icon {
  margin-left: 10px;
}
.button > .icon.icon-left {
  margin-left: 0px;
  margin-right: 10px;
}
</style>
