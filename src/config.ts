import auth from './auth'

export const Config = {
  siteName: () => {
    return 'Tube'
  },
  fetchCatalog: async () => {
    const target = `/video/catalog.json`
    const options = auth.options()
    const response = await fetch(target, options)
    const data = await response.json()
    return data
  },
  fetchMeta: async (id: String) => {
    const target = `${Config.getResource(id, 'meta')}`
    const options = auth.options()
    const response = await fetch(target, options)
    const data = await response.json()
    console.log(data)
    return data
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
