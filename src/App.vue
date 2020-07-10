<template>
  <div id="app">
    <base-viewer></base-viewer>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import BaseViewer from './components/viewer/viewer.vue';
export default Vue.extend({
  components:{
    BaseViewer
  }
})
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
