<template>
  <div>
    <Header />
    <main class="example">
      <header>
        <Button
          icon="skip-back"
          left-icon
          look="secondary"
          @click.native="$router.back()"
          >Go back</Button
        >
        <h1
          v-shared-element:example-title="{
            restrictToRoutes: ['/examples'],
          }"
        >
          {{ page.title }}
        </h1>
        <p class="description">
          {{ page.description }}
        </p>
      </header>
      <ComplexTransform />
      <nuxt-content class="markdown" :document="page" />
    </main>
  </div>
</template>

<script>
export default {
  async asyncData({ $content }) {
    const page = await $content('complex-transforms').fetch()

    return {
      page,
    }
  },
}
</script>

<style lang="scss" scoped>
.example {
  width: 66.666%;
  margin: 64px auto 0 auto;

  header {
    display: grid;
    grid-template-columns: 165px 1fr 165px;
    gap: 18px 24px;
    justify-items: center;
    align-items: start;
    margin-bottom: 18px;

    h1 {
      text-align: center;
    }

    .description {
      grid-area: 2/1 / 3/4;
    }
  }
}
</style>
