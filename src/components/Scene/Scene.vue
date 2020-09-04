<template>
  <div ref="container" class="coverdiv">
    <div class="toggle-button">
      <v-tooltip bottom color="black">
        <template v-slot:activator="{ on }">
          <v-btn
            outlined
            fab
            :color="isAddObjectMode ? 'red' : 'mdi-plus'"
            v-on="on"
            @click="toggleAddObjectMode()"
          >
            <v-icon>{{ isAddObjectMode ? 'mdi-close' : 'mdi-plus' }}</v-icon>
          </v-btn>
        </template>
        <span>Turn {{ isAddObjectMode ? 'off' : 'on' }} add object mode</span>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
import SceneInit from './js/Scene.init'
export default {
  data() {
    return {
      isAddObjectMode: false,
    }
  },
  mounted() {
    this.scene = SceneInit({ rootEl: this.$refs.container })
  },
  methods: {
    toggleAddObjectMode() {
      this.isAddObjectMode = !this.isAddObjectMode
      this.scene.isAddObjectMode = this.isAddObjectMode
    },
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

.toggle-button {
  position: absolute;
  left: 15px;
  top: 15px;
  overflow: hidden;
}
</style>
