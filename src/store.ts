import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token'),
    user: {}
  },
  mutations: {
    setToken(state, jwt) {
      localStorage.setItem('token', jwt)
    },
    setWatched(state, { videoId, flag }) {
      console.assert(videoId !== undefined)
      if (videoId !== undefined) {
        localStorage.setItem('video_' + videoId, flag)
      }
    },
    setUnWatched(state, { videoId, flag }) {
      localStorage.removeItem(videoId)
    }
  },
  getters: {},
  actions: {
    async login({ commit }, { password }) {
      commit('setToken', password)
    },
    async watched({ commit }, { videoId }) {
      commit('setWatched', { videoId, flag: 'watched' })
    },
    async unwatch({ commit }, { videoId }) {
      commit('setUnWatched', { videoId })
    },
    async hasWatched({ commit }, { videoId }) {
      const storeValue = localStorage.getItem('video_' + videoId)
      const hasWatched = storeValue === 'watched'
      return hasWatched
    }
  }
})
