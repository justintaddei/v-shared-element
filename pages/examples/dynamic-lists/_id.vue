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
      <ContactList class="contact-list" :contacts="contacts" />
      <nuxt-content class="markdown" :document="page" />
    </main>
  </div>
</template>

<script>
export default {
  async asyncData({ $content }) {
    const page = await $content('dynamic-lists').fetch()
    const { contacts } = await $content('dynamic-lists-data').fetch()

    return {
      page,
      contacts,
    }
  },
}
</script>

<style lang="scss" scoped>
.example {
  width: 66.666%;
  margin: 64px auto 0 auto;

  @media screen and (max-width: 550px) {
    width: 100%;
    margin: 64px 0 0 0;
  }

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

    @media screen and (max-width: 550px) {
      grid-template-rows: auto auto auto;
      grid-template-columns: 1fr;

      .description {
        grid-area: auto;
      }
    }
  }

  .contact-list {
    margin-top: 64px;
    margin-bottom: 64px;
  }
}
</style>
