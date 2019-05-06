<template>
  <div class="preview-container">
    <router-link :key="videoId" :to="{ name: 'play', params: { id: videoId } }">
      <div
        ref="spriteCanvas"
        class="preview-canvas"
        @mouseout="showThumbnail"
        @mouseover="playVideoPreview"
      >
        <p v-if="watched" class="watched">watched</p>
        <div class="preview-overlay">
          <p>{{ meta.duration | timecode }}</p>
        </div>
      </div>
      <div class="preview-detail">
        <div class="preview-title">{{ meta.title }}</div>
      </div>
    </router-link>
  </div>
</template>

<script>
import Config from '@/config'
export default {
  name: 'VideoPreview',
  filters: {
    timecode(time) {
      var hrs = ~~(time / 3600)
      var mins = ~~((time % 3600) / 60)
      var secs = ~~time % 60
      var ret = ''
      if (hrs > 0) {
        ret += '' + hrs + ':' + (mins < 10 ? '0' : '')
      }
      ret += '' + mins + ':' + (secs < 10 ? '0' : '')
      ret += '' + secs
      return ret
    }
  },
  props: {
    videoId: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    meta: {
      year: 0,
      title: '',
      keywords: [],
      description: '',
      duration: 0
    },
    isHovering: false,
    watched: false
  }),
  async beforeMount() {
    this.meta = await Config.fetchMeta(this.videoId)
    this.showThumbnail()
    this.getWatchState()
  },
  mounted() {},
  updated() {
    this.getWatchState()
  },
  methods: {
    showThumbnail: function() {
      this.isHovering = false
      let src = Config.getResource(this.videoId, 'thumbnail')
      var image = new Image()
      image.onload = () => {
        if (!this.isHovering) {
          this.$refs.spriteCanvas.style.backgroundImage = `url('${src}')`
        }
      }
      image.src = src
    },
    playVideoPreview: function() {
      this.isHovering = true
      let src = Config.getResource(this.videoId, 'preview')
      var image = new Image()
      image.onload = () => {
        if (this.isHovering) {
          this.$refs.spriteCanvas.style.backgroundImage = `url('${src}')`
        }
      }
      image.src = src
    },
    getWatchState: function() {
      this.$store.dispatch('hasWatched', { videoId: this.videoId }).then(haswatched => {
        this.watched = haswatched
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/_base.scss';
.preview-container {
  background: rgba(209, 207, 209, 0);
  overflow: hidden;
  width: auto;
  margin: 0px;
}
.preview-container {
  zoom: 0.85;
}
.preview-canvas {
  cursor: pointer;
  background-size: 100%;
  background-repeat: no-repeat;
  min-height: $preview-height;
  min-width: $preview-width;
  transition: background-image 0.5s ease-in-out;
}
.preview-detail {
  background-color: rgba(211, 211, 211, 0.226);
  color: black;
  min-width: $preview-width;
  font-size: 1em;
}
.preview-overlay {
  position: relative;
  top: $preview-height - 25px;
  background: transparent;
}
.preview-overlay > p {
  font-size: 1em;
  padding: 0px 4px;
  background: #ffffff4b;
  color: black;
  margin: 0px;
  margin-left: auto;
  margin-right: 10px;
  width: fit-content;
  vertical-align: middle;
}
.preview-canvas:hover {
  .preview-overlay,
  .watched {
    display: none;
  }
}
.watched {
  background-color: rgba(170, 29, 29, 0.596);
  color: rgb(255, 255, 255);
  position: relative;
  top: 10px;
  left: 10px;
  padding: 0px 5px;
  float: left;
  display: block;
}
</style>
