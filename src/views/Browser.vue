<template>
  <div id="browser">
    <nav class="navbar is-dark" role="navigation" aria-label="main navigation is-spaced">
      <div class="navbar-brand">
        <router-link to="/browse" class="navbar-item" exact>
          <img src="../assets/logo.svg" width="40px" />
          <span class="site-name">{{ siteName }}</span>
        </router-link>
      </div>

      <div class="navbar-menu">
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">View</a>
          <div class="navbar-dropdown">
            <router-link
              v-for="folder in folders"
              :key="folder.name"
              class="navbar-item"
              :to="{ name: 'preview', params: { id: folder.name } }"
              >{{ folder.name }}</router-link
            >
            <hr class="navbar-divider" />
          </div>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <div class="button is-light" @click="logout">Log out</div>
          </div>
        </div>
      </div>
    </nav>

    <div class="page-area">
      <transition name="fade">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import Config from '@/config'
export default {
  name: 'Browser',
  components: {},
  props: {
    id: {
      type: String,
      default: '/'
    }
  },
  data: () => ({
    siteName: Config.siteName(),
    previousRoute: '',
    folders: [],
    year: new Date().getFullYear()
  }),
  mounted() {},
  async created() {
    try {
      const data = await Config.fetchCatalog()
      this.folders = []
      for (let item in data) {
        if (data[item].assets) {
          this.folders.push({
            name: item,
            time: data[item].time,
            assets: data[item].assets
          })
        }
      }
    } catch (e) {
      this.$router.push({ name: 'error', params: { error: e } })
    }
  },
  methods: {
    logout: async function() {
      await this.$store.dispatch('logout')
      this.$router.push({ path: '/login' })
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.previousRoute = from
    })
  }
}
</script>

<style lang="scss">
.navbar-link {
  color: white;
}
.site-name {
  font-size: 2em;
  color: white;
  margin-left: 10px;
}
.navbar-dropdown{
  max-height: 45vh;
  overflow-y: scroll;
}
.active-year {
  clear: none;
  font-size: 2em;
  color: rgb(56, 54, 54);
  font-weight: 500;
  width: 0;
  top: 0px;
  left: 0px;
  float: left;
  position: relative;
  display: block;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  max-height: 0;
}
.fade-enter-to {
  max-height: 400px;
}
.fade-enter-active {
  transition: opacity 0.25s ease 0.25s, max-height 0.25s step-start;
}
.fade-leave {
  max-height: 400px;
}
.fade-leave-active {
  transition: opacity 0.25s ease, max-height 0.25s step-end;
}
</style>
