<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import Config from '@/config'
export default {
  name: 'SiteChrome',
  data: () => ({
    title: Config.siteName()
  })
}
</script>

<style scoped>
* {
  text-decoration: none !important;
}
.title {
  text-align: left;
  margin-bottom: 0px;
  padding-bottom: 0px;
}
</style>
