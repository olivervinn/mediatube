<template>
  <div class="video-browser-container">
    <div class="active-year">{{ route }}</div>
    <div class="columns">
      <div class="column">
        <a class="button is-link" @click="$router.back()">back</a>
        <a class="button is-info sort-button" @click="toggleOrderLength">Sort (Length)</a>
        <a class="button is-primary sort-button" @click="toggleOrderName">Sort (Name)</a>
      </div>
    </div>
    <transition-group
      ref="viewer"
      name="fade"
      class="columns is-multiline is-variable is-1 video-browser"
    >
      <VideoPreview
        v-for="i in assets"
        :key="i.videoId"
        :video-id="i.videoId"
        class="video-preview"
      ></VideoPreview>

      <div v-for="i in assets.length % 2" :key="`padding${i}`" class="column column-filler"></div>
    </transition-group>
  </div>
</template>

<script>
import VideoPreview from '@/components/VideoPreview'
import Config from '@/config'
export default {
  name: 'BrowseVideos',
  components: {
    VideoPreview
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    filter: {
      type: String,
      default: null
    }
  },
  data: () => ({
    isLoading: true,
    isFullPage: false,
    reverse: false,
    assets: [],
    loadingComponent: null,
    baseuri: Config.baseuri,
    preview: {
      url: ''
    },
    route: ''
  }),
  watch: {
    id: async function(_now, _old) {
      await this.getData(this.filter)
    }
  },
    async created() {
      await this.getData(this.filter)
    },
    mounted() {
      this.open()
      this.route = this.$route.params.id
    },
    updated() {},
    methods: {
      open() {
        this.loadingComponent = this.$loading.open({
          container: this.isFullPage ? null : this.$refs.viewer.$el
        })
      },
      toggleOrderLength: function() {
        this.assets.sort(function(a, b) {
          return b.duration - a.duration
        })
        if (this.reverse) {
          this.assets.reverse()
        }
        this.reverse = !this.reverse
      },
      toggleOrderName: function() {
        this.assets.sort(function(a, b) {
          return b.videoId.localeCompare(a.videoId)
        })
        if (this.reverse) {
          this.assets.reverse()
        }
        this.reverse = !this.reverse
      },
      async getData(filter) {
        let id = this.id
        this.assets = []
        const data = await Config.fetchCatalog()
        if (!filter) {
          if (data[id]) {
            for (let p in data[id].assets) {
              let _ = data[id].assets[p]
              this.assets.push({
                videoId: _._,
                duration: _.duration
              })
            }
          }
        } else {
          data[id].assets.sort()
          for (let p in data[id].assets) {
            const fileElement = data[id].assets[p]
            if (fileElement.tags && fileElement.tags.contains(filter)) {
              this.assets.push({
                videoId: fileElement._,
                duration: fileElement.duration
              })
            }
          }
        }
        this.toggleOrderLength()
        setTimeout(() => {
          this.loadingComponent.close()
        }, 10)
      }
    }
}
</script>

<style lang="scss" scoped>
.video-browser-container {
  height: calc(100%);
  background: rgba(255, 255, 255, 0.596);
  padding: 2em;
  border: 1px solid rgb(226, 226, 226);
}
.video-browser {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.video-preview {
  padding-right: 20px;
  padding-bottom: 20px;
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
.sort-button {
  margin-left: 5px;
  margin-bottom: 10px;
}
</style>
