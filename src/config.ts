import auth from './auth'

export const Config = {
  siteName: () => {
    return 'Tube'
  },
  fetchCatalog: async () => {
    try {
      const target = `/video/catalog.json`
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
    if (type === 'video') {
      return `/video/${id}.mp4`
    } else if (type === 'thumbnail') {
      return `/video/preview/${id}.mp4.thumb.jpg`
    } else if (type === 'preview') {
      return `/video/preview/${id}.mp4.webp`
    } else if (type === 'scrub') {
      return `/video/preview/${id}.mp4.vtt`
    } else if (type === 'meta') {
      return `/video/preview/${id}.mp4.json`
    } else {
      return `/404.html`
    }
  }
}

export default Config
