<template>
  <div id="app">
    <SiteChrome>
      <transition name="fade">
        <router-view />
      </transition>
    </SiteChrome>
  </div>
</template>

<script lang="ts">
import SiteChrome from './views/SiteChrome.vue'

export default {
  components: { SiteChrome }
}
</script>
<style lang="scss">
@import './scss/_base.scss';
* {
  text-decoration: none !important;
  user-select: none;
}
*input,
input:before,
input:after {
  -webkit-user-select: initial;
  -khtml-user-select: initial;
  -moz-user-select: initial;
  -ms-user-select: initial;
  user-select: initial;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh;
}
.panel {
  background: #e4e4e4;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  max-height: 0;
}
.fade-enter-to {
  max-height: 400px;
}
.fade-enter-active {
  transition: opacity 0.25s ease 0.25s, max-height 0.25s step-start;
}
.fade-leave {
  max-height: 400px;
}
.fade-leave-active {
  transition: opacity 0.25s ease, max-height 0.25s step-end;
}
</style>
