import auth from './auth'

export const Config = {
  v: '5',
  a: '4',
  cachedSiteName: '',
  siteName: () => {
    if (Config.cachedSiteName === '') {
      var toProperCase = function (s: String) {
        return s.replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        })
      }
      var getLocation = function () {
        var l = document.createElement('a')
        l.href = location.href
        return l
      }
      var l = getLocation()
      Config.cachedSiteName = toProperCase(l.hostname.split('.')[0]) + ' MediaTube'
    }
    return Config.cachedSiteName
  },
  fetchCatalog: async () => {
    try {
      const target = `/video/catalog.json?${Config.a}`
      const options = auth.options()
      const r = await fetch(target, options)
      return r.json()
    } catch {}
  },
  fetchMeta: async (id: String) => {
    try {
      const target = `${Config.getResource(id, 'meta')}`
      const options = auth.options()
      const r = await fetch(target, options)
      return r.json()
    } catch {}
  },
  getResource: (id: String, type: String) => {
    const p = id.split('/')
    const group = p[0]
    const asset = p[1]
    if (type === 'video') {
      return `/video/${id}.mp4`
    } else if (type === 'thumbnail') {
      return `/video/preview/${group}/${asset}.mp4.thumb.jpg?${Config.a}`
    } else if (type === 'preview') {
      return `/video/preview/${group}/${asset}.mp4.webp?${Config.a}`
    } else if (type === 'scrub') {
      return `/video/preview/${group}/${asset}.mp4.vtt?${Config.a}`
    } else if (type === 'meta') {
      return `/video/preview/${group}/${asset}.mp4.json?${Config.a}`
    } else {
      return `/404.html`
    }
  }
}

export default Config
