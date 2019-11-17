<template>
  <div class="main">
    <article class="is-default content-area">
      <div class="content main-area container">
        <div class="sort-button"></div>
        <transition-group enter>
          <div
            v-for="(itemGrouping, index) in itemGroups"
            :key="'d' + index"
            class="tile is-ancestor"
          >
            <br />
            <div
              ref="itemGroupElement"
              v-for="item in itemGrouping"
              :key="item.name"
              class="tile is-parent"
            >
              <router-link
                :class="
                  'tile is-child box year-tile notification ' +
                    (allWatched(item) ? 'all-watched' : '')
                "
                tag="article"
                :to="{ name: 'preview', params: { id: item.name } }"
              >
                <div class="moz" :data-name="item.name"></div>
                <div>
                  <div class="content">
                    <span class="tag is-small is-rounded badge">{{ item | viewed }}</span>
                    <p class="title">{{ item.name }}</p>
                    <p class="subtitle">{{ item.ago | yearsAgo }}</p>
                    <p class="is-light duration">{{ item.duration | duration }}</p>
                  </div>
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
      return `[ ${date.toISOString().substr(11, 8)} ]`
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
    itemGroups: []
  }),
  computed: {},
  mounted() {},
  created() {
    const watchCount = this.queryWatched()
    Config.fetchCatalog().then(response => {
      let lastYear = 0
      let nyear = new Date().getFullYear()
      let years = []
      this.itemGroups = []

      for (let p in response) {
        let year = Number.parseInt(p)
        years.push({
          name: p,
          ago: nyear - year,
          fileCount: response[p].assets.length,
          watchCount: watchCount[p],
          duration: response[p].time
        })
        if (year % 5 === 0 || year >= lastYear + 5) {
          this.itemGroups.push(years)
          years = []
          lastYear = year
        }
      }
      if (years.length) {
        this.itemGroups.push(years)
      }
      this.toggleOrder()
    })
  },
  updated() {
    this.$refs.itemGroupElement.forEach(el => {
      var e = el.children[0].children[0]
      var id = e.dataset['name']
      e.style.backgroundImage = `url('/video/${id}.jpg')`
    })
  },
  methods: {
    toggleOrder: function() {
      for (let i in this.itemGroups) {
        this.itemGroups[i].reverse()
      }
      this.itemGroups.reverse()
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
    allWatched: function(itemGrouping) {
      return itemGrouping.watchCount === itemGrouping.fileCount
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
  padding: 15px;
}
.tile {
  left: 0;
  transition: left 21s linear;
  overflow: hidden;
  margin: 0px;
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

.box {
  padding: 0px;
}
.box:hover .moz {
  background-position: top;
}
.moz {
  margin-bottom: 10px;
  content: center;
  min-width: 35%;
  min-height: 35%;
  min-height: 100px;
  background-origin: content-box;
  background-size: cover;
  background-position: bottom;
  background-repeat: no-repeat;
}

.title,
.subtitle,
.duration {
  margin-bottom: 0.8em !important;
}
.duration {
  color: grey;
  font-size: 0.8em;
  font-style: italic;
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
