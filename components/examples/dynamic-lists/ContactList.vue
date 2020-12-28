<template>
  <div class="contacts" :class="{ 'with-padding': !selectedContact }">
    <template v-if="!selectedContact">
      <h2>Contacts</h2>
      <hr />
      <div
        v-for="letterGroup in contacts"
        :key="letterGroup.letter"
        class="letter-group"
      >
        <h2>{{ letterGroup.letter }}</h2>
        <ul class="people fade-in">
          <li
            v-for="person in letterGroup.people"
            :key="person.id"
            class="person"
          >
            <nuxt-link v-wave :to="`/examples/dynamic-lists/${person.id}`">
              <img
                v-shared-element:[`avatar-${person.id}`]="{
                  restrictToRoutes: routeMatchesSharedId,
                }"
                :src="getAvatar(person)"
                :alt="`Photo of ${person.name}`"
              />
              <h4
                v-shared-element:[`name-${person.id}`]="{
                  restrictToRoutes: routeMatchesSharedId,
                }"
              >
                {{ person.name }}
              </h4>
            </nuxt-link>
          </li>
        </ul>
      </div>
    </template>
    <template v-else>
      <div class="contact">
        <header>
          <img
            v-shared-element:[`avatar-${selectedContact.id}`]="{
              restrictToRoutes: ['/examples/dynamic-lists'],
            }"
            :src="getAvatar(selectedContact)"
            :alt="`Photo of ${selectedContact}`"
          />
          <Icon class="back" name="arrow-left" @click.native="$router.back()" />
          <Icon name="edit-2" />
          <h2
            v-shared-element:[`name-${selectedContact.id}`]="{
              restrictToRoutes: ['/examples/dynamic-lists'],
            }"
          >
            {{ selectedContact.name }}
          </h2>
        </header>
        <ul class="actions fade-in">
          <li>
            <Icon name="phone" />
            <small>Call</small>
          </li>
          <li>
            <Icon name="message-square" />
            <small>Text</small>
          </li>
          <li>
            <Icon name="video" />
            <small>Video</small>
          </li>
        </ul>
        <ul class="details fade-in">
          <li>
            <Icon name="phone" />
            <p>{{ selectedContact.phone }}</p>
          </li>
          <li>
            <Icon name="gift" />
            <p>{{ selectedContact.b_day }}</p>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script>
import Icon from '@/components/Icon'

export default {
  components: { Icon },
  props: {
    contacts: {
      type: Array,
      required: true,
    },
  },
  computed: {
    selectedContact() {
      const selectedId = +this.$route.params.id

      for (const { people } of this.contacts)
        for (const person of people) if (person.id === selectedId) return person

      return null
    },
  },
  methods: {
    getAvatar(person) {
      return require(`../../../assets/images/examples/dynamic-lists/${person.name}.jpg`)
    },
    routeMatchesSharedId(to, _, id) {
      return id.includes(to.params.id)
    },
  },
}
</script>

<style lang="scss" scoped>
.contacts {
  width: 420px;
  max-width: 90%;
  margin: auto;
  > hr {
    border: none;
    height: 1px;
    background: var(--light-gray);
    margin: 24px 0;
  }
  .letter-group {
    display: grid;
    grid-template-columns: 1.953rem 1fr;
    gap: 18px;
    h2 {
      line-height: 64px;
      text-align: center;
    }

    .people {
      padding: 0;
      list-style: none;

      .person a {
        display: flex;
        align-items: center;
        margin-bottom: 18px;
        border-radius: 32px;
        color: inherit;
        text-decoration: none;
        transition: background-color 0.1s ease;

        &:hover {
          background: rgba(0, 0, 0, 0.1);
          cursor: pointer;
        }

        img {
          width: 64px;
          height: 64px;
          object-fit: cover;
          border-radius: 32px;
          margin-right: 24px;
        }

        h4 {
          display: inline-block;
        }
      }
    }
  }
}

.contact {
  width: 100%;
  header {
    position: relative;
    border-bottom: 1px solid var(--light-gray);

    .icon {
      position: absolute;
      top: 18px;
      color: #fff;
      right: 18px;
      transition: transform 0.2s ease;

      &.back {
        left: 18px;
        cursor: pointer;
      }

      &:hover {
        transform: scale(1.1);
      }
    }

    img {
      border-radius: 16px 16px 0 0;
      width: 100%;
    }

    h2 {
      margin: 24px 32px 12px 32px;
      display: inline-block;
    }
  }

  .actions {
    display: flex;
    justify-content: space-around;
    list-style: none;
    padding: 12px;
    margin: 0 32px;
    border-bottom: 1px solid var(--light-gray);

    li {
      text-align: center;
      small {
        margin-top: 8px;
        display: block;
      }
    }
  }

  .details {
    list-style: none;
    padding: 0 32px;

    li {
      display: grid;
      grid-template: 1fr / 24px 1fr;
      align-items: center;
      gap: 24px;

      p {
        height: 64px;
        line-height: 64px;
        border-bottom: 1px solid var(--light-gray);
      }
    }
  }
}

.contacts {
  background: #fff;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  overflow: hidden;

  padding-bottom: 32px;

  &.with-padding {
    padding: 32px;
  }
}
</style>
