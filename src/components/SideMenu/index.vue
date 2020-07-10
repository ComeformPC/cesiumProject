<template>
  <el-menu :collapse="true">
    <el-submenu index="1">
      <template slot="title">场景浏览</template>
      <el-menu-item index="1-1" @click="zoomIn">放大</el-menu-item>
      <el-menu-item index="1-2" @click="zoomOut">缩小</el-menu-item>
      <el-menu-item index="1-3" @click="home">全球视野</el-menu-item>
    </el-submenu>
    <el-submenu index="2">
      <template slot="title">模型加载</template>
      <el-submenu index="2-1">
        <template slot="title">glTF</template>
        <el-menu-item index="2-1-1" @click="addglTF('CesiumMan')">CesiumMan</el-menu-item>
        <el-menu-item index="2-1-2" @click="addglTF('Car')">Car</el-menu-item>
        <el-menu-item index="2-1-3" @click="addglTF('Plane')">Plane</el-menu-item>
      </el-submenu>
      <el-submenu index="2-2">
        <template slot="title">3dTiles</template>
        <el-menu-item index="2-2-1" @click="add3dtiles('dragon')">龙</el-menu-item>
        <el-menu-item index="2-2-2" @click="add3dtiles('ground')">地面</el-menu-item>
        <el-menu-item index="2-2-3" @click="add3dtiles('lod')">Lod</el-menu-item>
      </el-submenu>
    </el-submenu>
  </el-menu>
</template>
<script lang="ts">
import Vue from "vue";
import SceneView from "@/components/SceneView/index";
import AddGlTF from "@/components/AddGlTF/index";
import Add3dTiles from "@/components/Add3dTiles/index";
import { Viewer } from 'cesium';
export default Vue.extend({
  data():{
    viewer:Viewer
  } {
    return {
      viewer: null!
    };
  },
  mounted(){
    this.viewer=this.$store.state.viewer;
    console.log(this.$store.state.viewer);
  },
  methods: {
    zoomIn() {
      const sceneView = new SceneView(this.viewer);
      sceneView.zoomIn();
    },
    zoomOut() {
      const sceneView = new SceneView(this.viewer);
      sceneView.zoomOut();
    },
    home() {
      const sceneView = new SceneView(this.viewer);
      sceneView.home();
    },
    add3dtiles(name: string) {
      console.log(this.viewer);
      const tilesetLoader = new Add3dTiles(this.viewer);
      let url = "";
      switch (name) {
        case "dragon":
          url = "./data/tilesets/TilesetWithDiscreteLOD/tileset.json";
          break;
        case "ground":
          url = "./data/tilesets/ground/tileset.json";
          break;
      }
      tilesetLoader.add(url);
    },
    addglTF(name: string) {
      const gltfLoader = new AddGlTF(this.viewer);
      let url = "";
      switch (name) {
        case "CesiumMan":
          url = "./data/tf/gltf/ground.gltf";
          break;
      }
      gltfLoader.add(url);
    }
  }
});
</script>
<style lang='scss' scoped>
.el-menu--collapse {
  width: 100px;
}
</style>