<template>
  <div class="preview-container">
    <router-link :key="videoId" :to="{ name: 'play', params: { id: videoId } }">
      <div
        v-lazy
        ref="spriteCanvas"
        class="preview-canvas"
        :data-uri="thumbnailUri"
        @mouseout="loadThumbnail"
        @mouseover="playVideoPreview"
      >
        <p v-if="lastwatch" class="lastwatch">just watched</p>
        <p v-else-if="watched" class="watched">watched</p>
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
import Lazy from '@/directives/lazy'
export default {
  name: 'VideoPreview',
  directives: {
    lazy: Lazy
  },
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
    watched: false,
    lastwatch: false,
    thumbnailUri: {}
  }),
  async beforeMount() {
    this.meta = await Config.fetchMeta(this.videoId)
  },
  mounted() {
    this.getWatchState()
    this.getLastWatchState()
    this.thumbnailUri = Config.getResource(this.videoId, 'thumbnail')
  },
  updated() {
    this.getWatchState()
    this.getLastWatchState()
  },
  methods: {
    loadThumbnail: function() {
      this.isHovering = false
      this.$refs.spriteCanvas.style.backgroundImage = `url('${this.thumbnailUri}')`
    },
    playVideoPreview: function() {
      this.isHovering = true
      let src = Config.getResource(this.videoId, 'preview')
      var image = new Image()
      image.src = src
      image.onload = () => {
        if (this.isHovering) {
          this.$refs.spriteCanvas.style.backgroundImage = `url('${src}')`
        }
      }
    },
    getWatchState: function() {
      this.$store.dispatch('hasWatched', { videoId: this.videoId }).then(haswatched => {
        this.watched = haswatched
      })
    },
    getLastWatchState: function() {
      this.$store.dispatch('lastWatched', { videoId: this.videoId }).then(waslast => {
        this.lastwatch = waslast
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/_base.scss';
.preview-container {
  overflow: hidden;
  width: auto;
  margin: 0px;
}
.preview-container {
  zoom: 0.85;
}
.loaded {
  visibility: visible !important;
  opacity: 1 !important;
  transition: background-image 0.3s ease-in;
}
.preview-canvas {
  opacity: 0;
  visibility: hidden;
  cursor: pointer;
  border-radius: 5px 5px 0px 0px;
  background-size: 100%;
  background-color: #000000;
  background-position: center;
  background-repeat: no-repeat;
  min-height: $preview-height;
  min-width: $preview-width;
  transition: opacity 0.3s ease-in-out;
}
.preview-detail {
  background-color: rgba(211, 211, 211, 0.281);
  color: black;
  min-width: $preview-width;
  font-size: 1em;
  border-radius: 0px 0px 5px 5px;
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
  .lastwatch {
    display: none;
  }
}
.watched {
  background-color: rgba(170, 29, 29, 0.685);
  color: rgb(255, 255, 255);
  position: relative;
  top: 10px;
  left: 10px;
  padding: 0px 5px;
  float: left;
  display: block;
}
.lastwatch {
  background-color: rgba(29, 170, 36, 0.726);
  color: rgb(255, 255, 255);
  position: relative;
  top: 10px;
  left: 10px;
  padding: 0px 5px;
  float: left;
  display: block;
}
</style>
