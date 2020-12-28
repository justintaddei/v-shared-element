<template>
  <div class="home">
    <img
      v-shared-element:package-logo
      class="logo"
      width="128"
      height="103"
      src="@/assets/images/logo.png"
      alt="v-shared-element logo"
    />
    <h1 v-shared-element:package-name>v-shared-element</h1>
    <ul class="badges fade-in">
      <li>
        <img
          src="https://camo.githubusercontent.com/2d33fb30f6068ba85caa8154b37773c293a8ac0ddd9a23aeb6ff013a7c8ee58f/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f6973737565732d7261772f6a757374696e7461646465692f762d7368617265642d656c656d656e742e7376673f7374796c653d666c6174"
          alt="Open issues"
        />
      </li>
      <li>
        <img
          src="https://camo.githubusercontent.com/dbe52db2dad6f9e78e2ff7e265c7be36b836168d63718e8f235c0c21bf839162/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f762d7368617265642d656c656d656e742e7376673f7374796c653d666c6174"
          alt="NPM version"
        />
      </li>
      <li>
        <img
          src="https://camo.githubusercontent.com/ad9f63fee873c8bb262be45a604a0bb98ce6913cf8dcba73138fca588567c554/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f762d7368617265642d656c656d656e742e7376673f7374796c653d666c6174"
          alt="License"
        />
      </li>
    </ul>
    <p>Declarative shared-element transitions between pages for Vue.js.</p>
    <div class="buttons">
      <Button icon="code" to="/examples" look="primary">Examples</Button>
      <Button
        icon="github"
        to="https://github.com/justintaddei/v-shared-element"
        look="secondary"
        >GitHub</Button
      >
    </div>

    <footer v-wave>
      <a
        target="_blank"
        href="https://justintaddei.com?referrer=v-shared-element"
      >
        <img src="@/assets/images/logo-jt.png" alt="Justin Taddei's logo" />
        By Justin Taddei
      </a>
    </footer>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.home {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.logo {
  margin-bottom: 24px;
}

h1 {
  margin-bottom: 16px;
}

.badges {
  list-style: none;
  display: grid;
  grid-template: 1fr / 1fr 1fr 1fr;
  gap: 16px;
  place-items: center;
  padding: 0;
  height: 24px;
  margin-bottom: 24px;
}

p {
  margin: 0 32px 64px 32px;
}

.buttons {
  display: grid;
  grid-template: 1fr / 1fr 1fr;
  place-items: center;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
}

footer {
  margin-top: 256px;

  @media screen and (max-width: 550px) {
    margin-top: 64px;
  }
  padding: 6px 12px;
  border-radius: 8px;
  transition: background-color 0.15s ease;
}

footer:hover {
  background: rgba(0, 0, 0, 0.1);
}

footer a {
  color: inherit;
  text-decoration: none;
  display: flex;
  align-items: center;
  img {
    margin-right: 12px;
  }
}
</style>
