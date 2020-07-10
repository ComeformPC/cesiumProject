<template>
  <div id="app">
    <router-view></router-view>
    <div class="sideMenu">
      <side-menu></side-menu>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import SideMenu from '@/components/SideMenu/index.vue';
export default Vue.extend({
  components:{
    SideMenu
  }
})
</script>
<style lang="scss">
html,body,#app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.sideMenu{
  position: absolute;
  top:100px;
  left:30px;
}
</style>
