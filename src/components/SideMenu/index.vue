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
        <el-menu-item index="2-1-2" @click="addglTF('Architecture')">建筑</el-menu-item>
      </el-submenu>
      <el-submenu index="2-2">
        <template slot="title">3dTiles</template>
        <el-menu-item index="2-2-1" @click="add3dtiles('Dragon')">龙</el-menu-item>
        <el-menu-item index="2-2-3" @click="add3dtiles('Architecture')">建筑</el-menu-item>
      </el-submenu>
    </el-submenu>
    <el-submenu index="3">
      <template slot="title">primitives</template>
      <el-menu-item index="3-1" @click="addPrimitive('box')">盒子</el-menu-item>
      <el-submenu index="3-2">
        <template slot="title">自定义</template>
        <el-menu-item index="3-2-1" @click="addPrimitive('custom-color')">纯色纹理</el-menu-item>
        <el-menu-item index="3-2-2" @click="addPrimitive('custom-img')">图片纹理</el-menu-item>
      </el-submenu>
      <el-menu-item index="3-3">材质</el-menu-item>
    </el-submenu>
  </el-menu>
</template>
<script lang="ts">
import Vue from "vue";
import SceneView from "@/components/SceneView/index";
import AddGlTF from "@/components/AddGlTF/index";
import Add3dTiles from "@/components/Add3dTiles/index";
import AddPrimitive from "@/components/AddPrimitive/index";
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
  },
  methods: {
    zoomIn() {//放大
      const sceneView = new SceneView(this.viewer);
      sceneView.zoomIn();
    },
    zoomOut() {//缩小
      const sceneView = new SceneView(this.viewer);
      sceneView.zoomOut();
    },
    home() {//全球视野
      const sceneView = new SceneView(this.viewer);
      sceneView.home();
    },
    add3dtiles(name: string) {//加载3d-tiles
      const tilesetLoader = new Add3dTiles(this.viewer);
      let url = "";
      switch (name) {
        case "Dragon":
          url = "./data/tilesets/TilesetWithDiscreteLOD/tileset.json";
          break;
        case "Architecture":
           url = "./data/tilesets/architecture/tileset.json";
          break;
      }
      tilesetLoader.add(url);
    },
    addglTF(name: string) {//加载gltf模型
      const gltfLoader = new AddGlTF(this.viewer);
      let url = "";
      switch (name) {
        case "CesiumMan":
          url = "./data/model/CesiumMan/Cesium_Man.gltf";
          break;
          case "Architecture":
          url="./data/model/chateau_de_montfa_81_gltf/origin/scene-origin.gltf";
          break;
      }
      gltfLoader.add(url);
    },
    addPrimitive(name:string){//添加primitive图元
    const primitiveLoader=new AddPrimitive(this.viewer);
      switch(name){
        case "box":
          primitiveLoader.addBox();
          break;
          case "custom-color":
            primitiveLoader.customRectangle();
            break;
            case "custom-img":
            primitiveLoader.customMaterial();
            break;
      }
    }
  }
});
</script>
<style lang='scss' scoped>
.el-menu--collapse {
  width: 100px;
}
</style>