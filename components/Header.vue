<template>
  <header>
    <nuxt-link to="/" class="title">
      <img
        v-shared-element:package-logo="{
          restrictToRoutes: ['/'],
        }"
        class="logo"
        width="64"
        height="51.5"
        src="@/assets/images/logo.png"
        alt="v-shared-element logo"
      />
      <h3
        v-shared-element:package-name="{
          restrictToRoutes: ['/'],
        }"
      >
        v-shared-element
      </h3>
    </nuxt-link>
    <a
      class="github-link fade-in"
      target="_blank"
      rel="noopener"
      href="https://github.com/justintaddei/v-shared-element"
    >
      <Icon name="github" :size="32" />
    </a>
  </header>
</template>

<style lang="scss" scoped>
header {
  padding: 96px 96px 0 96px;

  @media screen and (max-width: 550px) {
    padding: 64px 24px 0 24px;
  }

  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  display: flex;
  align-items: center;
  color: inherit;
  text-decoration: none;
  img {
    margin-right: 18px;
  }
}

.github-link {
  color: inherit;
}
</style>
