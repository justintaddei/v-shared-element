<template>
  <div>
    <IconSprite />
    <Nuxt />
  </div>
</template>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
}
html {
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  height: 100vh;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

body {
  background: var(--off-white);
  min-height: 100vh;
}

.fade-in {
  animation: fade-in 0.5s ease;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
}

.markdown {
  margin: 0 32px;
  padding-bottom: 128px;

  h2,
  h3,
  h4 {
    margin: 32px 0;
  }

  hr {
    border: none;
    height: 1px;
    background: var(--light-gray);
  }

  code {
    background: rgba(0, 0, 0, 0.1);
    padding: 2px 4px;
    border-radius: 4px;
    font-weight: 700;
  }

  p {
    line-height: 1.5em;
    margin: 24px 0;
  }

  ol {
    margin: 24px 0;
    padding: 0 0 0 48px;
    li {
      margin: 18px 0;
      font-size: 1rem;
    }
  }

  a {
    color: var(--green);
    text-decoration: none;
    border-bottom: 2px solid currentColor;

    &:hover {
      opacity: 0.5;
    }
  }
}
</style>
