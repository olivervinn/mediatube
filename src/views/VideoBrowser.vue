<template>
  <div class="video-browser-container">
    <div class="active-year">{{ route }}</div>
    <div class="columns">
      <div class="column">
        <a class="button is-link" @click="$router.back()">back</a>
      </div>
    </div>
    <transition-group
      ref="viewer"
      name="fade"
      class="columns is-multiline is-variable is-1 video-browser"
    >
      <VideoPreview
        v-for="i in files"
        :key="i.videoId"
        :video-id="i.videoId"
        class="video-preview"
      ></VideoPreview>

      <div v-for="i in files.length % 2" :key="`padding${i}`" class="column column-filler"></div>
    </transition-group>
  </div>
</template>

<script>
import VideoPreview from '@/components/VideoPreview'
import Config from '@/config'
export default {
  name: 'VideoBrowser',
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
    files: [],
    loadingComponent: null,
    baseuri: Config.baseuri,
    preview: {
      url: ''
    },
    route: ''
  }),
  watch: {
    id: function(_now, _old) {
      this.getData(this.filter)
    }
  },
  created() {
    this.getData(this.filter)
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
    getData(filter) {
      let id = this.id
      this.files = []
      Config.fetchCatalog().then(data => {
        if (!filter) {
          if (data[id]) {
            for (let p in data[id].files) {
              let _ = data[id].files[p]
              this.files.push({
                videoId: _._
              })
            }
          }
        } else {
          for (let p in data[id].files) {
            const fileElement = data[id].files[p]
            if (fileElement.tags && fileElement.tags.contains(filter)) {
              this.files.push({
                videoId: fileElement._
              })
            }
          }
        }
        setTimeout(() => {
          this.loadingComponent.close()
        }, 10)
      })
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
</style>
