<template>
  <div ref="container" class="coverdiv"></div>
</template>

<script>
import SceneInit from './js/Scene.init'
export default {
  mounted() {
    this.scene = SceneInit({ rootEl: this.$refs.container })
    console.log(this.scene)
  },
}
</script>

<style lang="scss" scoped>
body,
html {
  height: 100vh;
  overflow: hidden !important;
}
:focus {
  outline: none;
  border: none;
  -webkit-box-shadow: none;
  box-shadow: none;
}
.coverdiv {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
</style>
