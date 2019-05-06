<template>
  <div class="main">
    <article class="is-default content-area">
      <div class="content main-area container">
        <div class="button is-primary sort-button" @click="toggleOrder">Sort</div>
        <transition-group enter>
          <div
            v-for="(yearItemGrouping, index) in yearGroups"
            :key="'d' + index"
            class="tile is-ancestor"
          >
            <br />
            <div v-for="yearItem in yearItemGrouping" :key="yearItem.name" class="tile is-parent">
              <router-link
                :class="
                  'tile is-child box year-tile notification ' +
                    (allWatched(yearItem) ? 'all-watched' : '')
                "
                tag="article"
                :to="{ name: 'preview', params: { id: yearItem.name } }"
              >
                <span class="tag is-small is-rounded badge">{{ yearItem | viewed }}</span>
                <p class="title">{{ yearItem.name }}</p>
                <p class="subtitle">{{ yearItem.ago | yearsAgo }}</p>
                <div class="content">
                  <span class="is-light">{{ yearItem.duration | duration }}</span>
                </div>
              </router-link>
            </div>
          </div>
        </transition-group>
      </div>
    </article>
  </div>
</template>

<script>
import Config from '@/config'
export default {
  filters: {
    duration(seconds) {
      var date = new Date(seconds * 1000)
      return `[${date.toISOString().substr(11, 8)}]`
    },
    yearsAgo(year) {
      if (!isNaN(year)) {
        const suffix = ['*', 'a year ago', `${year} years ago`]
        const y = year >= suffix.length ? suffix.length - 1 : year
        return suffix[y]
      } else {
        return '-'
      }
    },
    viewed: item => {
      if (item.fileCount === item.watchCount) {
        return '✓ ' + item.fileCount
      } else if (!item.watchCount) {
        return item.fileCount
      } else if (item.fileCount !== item.watchCount) {
        return item.watchCount + ' of ' + item.fileCount
      }
      return ''
    }
  },
  data: () => ({
    yearGroups: []
  }),
  computed: {},
  mounted() {
    // this.queryWatched()
  },
  created() {
    const watchCount = this.queryWatched()
    Config.fetchCatalog().then(response => {
      let lastYear = 0
      let nyear = new Date().getFullYear()
      let years = []
      this.yearGroups = []

      for (let p in response) {
        let year = Number.parseInt(p)
        years.push({
          name: p,
          ago: nyear - year,
          fileCount: response[p].files.length,
          watchCount: watchCount[p],
          duration: response[p].time
        })
        if (year % 5 === 0 || year >= lastYear + 5) {
          this.yearGroups.push(years)
          years = []
          lastYear = year
        }
      }
      if (years.length) {
        this.yearGroups.push(years)
      }
      this.toggleOrder()
      if (this.yearGroups.length === 0) {
        this.$router.push('/logout')
      }
    })
  },
  methods: {
    toggleOrder: function() {
      for (let i in this.yearGroups) {
        this.yearGroups[i].reverse()
      }
      this.yearGroups.reverse()
    },
    queryWatched: function() {
      var keys = Object.keys(localStorage).filter(function(key) {
        return /^video_(?:.*)$/.test(key)
      })
      let watchCount = {}
      for (let k in keys) {
        const id = keys[k].split('video_')[1]
        const group = id.split('/')[0]
        watchCount[group] ? watchCount[group]++ : (watchCount[group] = 1)
      }
      return watchCount
    },
    allWatched: function(yearItemGrouping) {
      return yearItemGrouping.watchCount === yearItemGrouping.fileCount
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  min-height: 100%;
  padding: 0px;
  background-color: rgb(255, 255, 255);
}
.content-area {
  padding: 10px;
}
.tile {
  left: 0;
  transition: left 21s linear;
}
.sort-button {
  margin-bottom: 10px;
}
.badge {
  float: right;
  position: absolute;
  clear: none;
  bottom: 5px;
  right: 5px;
  background-color: rgba(202, 202, 202, 0.459);
}
.year-tile:hover {
  background-color: rgba(165, 0, 0, 0.651);
  cursor: pointer;
  transition: background-color 0.1s linear 0.12s, color 0.1s ease;
}
.year-tile:hover > * {
  color: white;
  transition: color 0.3s ease;
}
.all-watched * {
  color: rgb(190, 190, 190);
}
.all-watched .badge {
  color: rgb(93, 219, 71);
}
</style>
