<template>
  <svg
    class="icon"
    :style="{
      width: px(size),
      height: px(size),
    }"
  >
    <use :xlink:href="`#${name}`" />
  </svg>
</template>

<script>
export default {
  name: 'Icon',
  props: {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 24,
    },
  },
  methods: {
    px(n) {
      return `${n}px`
    },
  },
}
</script>

<style>
svg.icon {
  stroke: currentColor;
  fill: none;
  margin-bottom: 0.125em;
  vertical-align: middle;
}
</style>
