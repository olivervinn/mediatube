<template>
  <div id="app">
      <transition name="fade">
        <router-view />
      </transition>
  </div>
</template>

<script lang="ts">
export default {
  components: {  }
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
  height:100vh;
  width: 100%;
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
