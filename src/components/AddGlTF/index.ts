import { Viewer, Cesium3DTileset, Model } from "cesium";

/**
 * 添加gltf,glb
 * @module ls/AddGlTF
 */
class AddGlTF{
    constructor(viewer:Viewer){
        this.viewer=viewer;
        this.gltf=undefined;
    }
    /**
     * cesium viewer实例
     */
    viewer:Viewer;
    /**
     * gltf
     */
    gltf:Model|undefined;
    /**
     * 添加模型
     * @param url .json地址
     */
    add(url:string){
        const tileset=this.viewer.scene.primitives.add(Model.fromGltf({
            url:url
        }));
        this.gltf=tileset;
    }
    /**
     * 从场景中移出
     */
    remove(){
        if(this.gltf){
            this.viewer.scene.primitives.remove(this.gltf);
        }
    }
}
export default AddGlTF;