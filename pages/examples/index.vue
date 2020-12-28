<template>
  <div class="examples">
    <Header />
    <main class="fade-in">
      <h1
        v-shared-element:example-title="{
          restrictToRoutes: (to) => to.path.includes('examples'),
        }"
      >
        Examples
      </h1>
      <ul class="cards">
        <li v-for="example in examples" :key="example.slug">
          <ExampleCard class="example-card" :example="example" />
        </li>
        <li>
          <a
            v-wave
            target="_blank"
            rel="noopener"
            href="https://github.com/justintaddei/v-shared-element/issues"
            class="end-card"
          >
            <Icon name="plus-square" :size="64" />
            <h4>Suggest an example</h4>
            <small>
              Have an idea for another example? Open an issue on GitHub.
            </small>
          </a>
        </li>
      </ul>
      <Button icon="skip-back" left-icon look="secondary" to="/">
        Go back
      </Button>
    </main>
  </div>
</template>

<script>
export default {
  name: 'Examples',
  async asyncData(context) {
    return {
      examples: await context
        .$content('/')
        .where({ extension: '.md', hidden: { $ne: true } })
        .sortBy('title')
        .fetch(),
    }
  },
}
</script>

<style lang="scss" scoped>
.examples {
  min-height: 100vh;
}

main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  padding: 64px 128px;
}

h1 {
  margin-bottom: 64px;
}

.cards {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  padding: 0;
  margin-bottom: 128px;
  li {
    margin: 32px 32px;
  }
}

.example-card {
  position: relative;
  display: inline-block;
  transition: transform 0.15s ease;
}

.example-card:hover {
  transform: scale(1.08);
}

.example-card:active {
  transform: scale(0.95);
}

.end-card {
  width: 280px;
  height: 256px;
  background: #ffffff;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  cursor: pointer;
  color: inherit;
  text-decoration: none;
}

.end-card:hover {
  transform: scale(1.08);
  box-shadow: 0 16px 32px rgba(53, 73, 94, 0.1);
}
.example-card:active {
  transform: scale(0.95);
}

.end-card .icon {
  margin-bottom: 16px;
}

.end-card:hover .icon {
  animation: new-suggestion-spin 0.75s ease;
}

@keyframes new-suggestion-spin {
  50% {
    transform: rotate(90deg) scale(1.2);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}

.end-card h4 {
  margin-bottom: 8px;
}
.end-card small {
  width: 170px;
}
</style>
