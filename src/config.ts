import auth from './auth'

export const Config = {
  v: '4',
  siteName: 'MediaTube',
  fetchCatalog: async () => {
    try {
      const target = `/video/path2.json`
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
      return `/video/preview/${group}/${asset}.mp4.thumb.jpg?${Config.v}`
    } else if (type === 'preview') {
      return `/video/preview/${group}/${asset}.mp4.webp?${Config.v}`
    } else if (type === 'scrub') {
      return `/video/preview/${group}/${asset}.mp4.vtt?${Config.v}`
    } else if (type === 'meta') {
      return `/video/preview/${group}/${asset}.mp4.json?${Config.v}`
    } else {
      return `/404.html`
    }
  }
}

export default Config
