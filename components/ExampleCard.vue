<template>
  <nuxt-link class="link" :to="url">
    <div
      v-wave
      class="card"
      @pointerover="hover = true"
      @pointerleave="hover = false"
    >
      <svg
        ref="coverImage"
        class="coverImage"
        width="256"
        height="151"
        viewBox="0 0 256 151"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        v-html="image"
      />
      <hr />
      <h4>{{ example.title }}</h4>
      <div class="details">
        <small>{{ example.description }}</small>
        <button tabindex="-1">
          <Icon name="eye" :size="12" />
          View
        </button>
      </div>
    </div>
  </nuxt-link>
</template>

<script>
export default {
  props: {
    example: { type: Object, required: true },
  },
  data() {
    return {
      lastHoverState: false,
    }
  },
  computed: {
    url() {
      return `/examples${this.example.path}`
    },
    image() {
      return require(`~/assets/images/examples/${this.example.coverImage}?raw`)
    },
    hover: {
      get() {
        return this.lastHoverState
      },
      set(hoverState) {
        if (hoverState && !this.lastHoverState) {
          const el = this.$refs.coverImage

          const onTransitionEnd = ({ propertyName }) => {
            if (propertyName !== 'opacity') return

            el.removeEventListener('transitionend', onTransitionEnd)

            el.style.display = 'none'

            el.getBoundingClientRect()

            el.style.display = ''
            el.style.transition = ''
            el.style.opacity = ''
          }

          el.addEventListener('transitionend', onTransitionEnd)

          el.style.transition = 'opacity 0.1s ease'
          el.style.opacity = '0'
        }

        this.lastHoverState = hoverState
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.link {
  color: inherit;
  text-decoration: none;
}

.card {
  width: 280px;
  height: 256px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 16px 32px rgba(53, 73, 94, 0.1);
}

.coverImage {
  width: 100%;
}

hr {
  border: none;
  height: 1px;
  background-color: var(--light-gray);
}

h4 {
  padding: 16px 16px 10px 16px;
}

.details {
  padding: 0 16px 16px 16px;
  display: flex;
  small {
    margin-right: 12px;
  }
}

.details button {
  white-space: nowrap;
  width: 70px;
  height: 24px;
  border-radius: 4px;
  font-size: 0.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: pointer;
  background: var(--green);
  color: var(--off-white);
  .icon {
    margin-right: 4px;
  }
}
</style>
