<template>
  <div class="video-player-container">
    <div class="active-year">{{ route }}</div>
    <div class="columns">
      <div class="column">
        <a class="button is-link" @click="$router.back()">back</a>
      </div>
    </div>
    <div class="video-player-content">
      <Player
        :key="source.src"
        :source="source"
        :scrub="scrub"
        :poster="poster"
        @play="setWatched"
      ></Player>
      <div class="video-detail">
        <div>
          <span class="video-title">{{ title }}</span>
          <span :class="watched ? 'video-watched' : ''" @click="setUnwatch"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import Player from '@/components/Player.vue'
import Config from '@/config'
export default {
  name: 'VideoPlayer',
  components: {
    Player
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: `video/mp4`
    }
  },
  data: () => ({
    route: '',
    source: {
      type: Object,
      default: {}
    },
    title: '',
    watched: false,
    scrub: {
      src: ''
    },
    poster: {
      src: ''
    }
  }),
  async beforeMount() {
    this.poster.src = Config.getResource(this.id, 'thumbnail')
    this.source.type = `video/mp4`
    this.source.src = Config.getResource(this.id, 'video')
    this.scrub.src = Config.getResource(this.id, 'scrub')
    const data = await Config.fetchMeta(this.id)
    this.title = data.title || this.id
  },
  mounted() {
    this.route = this.$route.params.id.split('/')[0]
    this.$store.dispatch('hasWatched', { videoId: this.id }).then(haswatched => {
      this.watched = haswatched
    })
  },
  methods: {
    setWatched: function() {
      this.$store.dispatch('watched', { videoId: this.id }).then(() => {
        this.watched = true
      })
    },
    setUnwatch: function() {
      this.$store.dispatch('unwatch', { videoId: this.id }).then(() => {
        this.watched = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.video-player-container {
  min-height: calc(100vh);
  height: calc(100% - 80px);
  padding: 30px;
  background: rgb(20, 20, 20);
}
.video-player-content {
  max-width: calc(1920px - 600px) !important;
  margin: 0 auto;
}
.video-detail {
  background: #272727;
  color: white;
  padding: 1.2vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.video-tag-group {
  display: block;
}
.video-tags {
  margin-right: 5px;
}
.video-watched::before {
  content: 'watched';
  height: 100px;
  width: 100px;
  background-color: rgba(255, 0, 0, 0.603);
  padding: 2px 5px;
  border-radius: 5px;
  margin-left: 10px;
  color: white;
}
.video-watched:hover::before {
  content: 'unwatch';
}
</style>
