export default {
  inserted: el => {
    function loadImage() {
        setTimeout(() => el.classList.add('loaded'), 100)
        el.style.backgroundImage = `url('${el.dataset.uri}')`
    }

    function handleIntersect(entries, observer) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadImage()
          observer.unobserve(el)
        }
      })
    }

    function createObserver() {
      const options = {
        root: null,
        threshold: 0.7
      }
      const observer = new IntersectionObserver(handleIntersect, options)
      observer.observe(el)
    }
    if (window['IntersectionObserver']) {
      createObserver()
    } else {
      loadImage()
    }
  }
}
