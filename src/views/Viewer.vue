<template>
  <div id="viewer"></div>
</template>
<script lang="ts">
import Vue from "vue";
import {Ion,Viewer, createWorldTerrain} from 'cesium';
import 'cesium/Source/Widgets/widgets.css';
export default Vue.extend({
  data() {
    return {
      viewer:null
    };
  },
  mounted() {
      this.init();
  },
  methods: {
    init() {
      Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1ODRiY2NiYi1jMmVlLTRkNTctYTNhNy03ZGNlMGQ2YmNjZTQiLCJpZCI6MTQwMDIsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjQ1NTU1MDV9.6E9-n__jfDwX1e-C3H685NhJZ8HUx3BQ7FYEJ9Rz9Ec";
      const viewer = new Viewer("viewer");
      viewer.scene.screenSpaceCameraController.enableCollisionDetection=false;
      viewer.scene.globe.depthTestAgainstTerrain=true;
      this.viewer=viewer as any;
      this.$store.commit('ACTIVE_VIEWER',viewer);
      
    }
  }
});
</script>
<style lang="scss" scoped>
#viewer {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>