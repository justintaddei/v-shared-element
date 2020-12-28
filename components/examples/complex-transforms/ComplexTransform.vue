<template>
  <div :class="toggled ? 'right' : 'left'">
    <div v-shared-element:complex-transforms-one class="one"></div>
    <div v-shared-element:complex-transforms-two class="two"></div>
    <div v-shared-element:complex-transforms-three class="three"></div>

    <Button
      v-if="!toggled"
      v-shared-element:complex-transforms-toggle
      to="/examples/complex-transforms/page-2"
      look="primary"
      icon="skip-forward"
    >
      Next page
    </Button>
    <Button
      v-else
      to="/examples/complex-transforms"
      look="primary"
      left-icon
      icon="skip-back"
    >
      Previous page
    </Button>
  </div>
</template>

<script>
export default {
  computed: {
    toggled() {
      return this.$route.params.page === 'page-2'
    },
  },
}
</script>

<style lang="scss" scoped>
.left,
.right {
  width: 66.666%;
  display: flex;
  flex-direction: column;
  margin: 48px auto 32px auto;
}

.button {
  align-self: center;
}

.one,
.two,
.three {
  width: 100px;
  height: 100px;
  border-radius: 16px;
  margin-bottom: 32px;
}

.one {
  background-color: var(--yellow);
  transform: rotate(45deg);
}

.two {
  background-color: var(--green);
  transform: skewX(45deg);
}

.three {
  background-color: var(--blue);
  transform: rotate(70deg);
}

.right {
  align-items: flex-end;

  .one,
  .two,
  .three {
    transform: none;
  }
}
</style>
