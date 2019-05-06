<template>
  <div class="player-container">
    <video ref="video" class="player" crossorigin="anonymous" :poster="poster.src">
      <source :src="source.src" :type="source.type" />
    </video>
  </div>
</template>

<script>
import * as Plyr from 'plyr'
import 'plyr/dist/plyr.css'

export default {
  name: 'Player',
  props: {
    source: {
      type: Object,
      default: () => ({ src: '', type: 'video/mp4' })
    },
    poster: {
      type: Object,
      default: () => ({ src: '', type: 'jpg' })
    },
    scrub: {
      type: Object,
      default: () => ({ src: '' })
    }
  },
  data() {
    return {
      player: null
    }
  },
  mounted() {
    this.player = new Plyr(this.$refs.video, {
      clickToPlay: true,
      controls: [
        'play-large',
        'play',
        'progress',
        'volume',
        'current-time',
        'fullscreen',
        'download'
      ],
      previewThumbnails: {
        enabled: true,
        src: this.scrub.src
      }
    })
    const comp = this
    this.player.on('play', event => {
      comp.$emit('play')
    })
    this.player.on('playEnd', event => {
      comp.$emit('playend')
    })
  }
}
</script>

<style>
.plyr--fullscreen-active video {
  position: initial !important;
  width: initial !important;
  height: initial !important;
}
.plyr__volume[hidden] {
  display: unset !important;
}
</style>
