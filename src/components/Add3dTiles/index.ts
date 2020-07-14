import { Viewer, Cesium3DTileset, viewerCesium3DTilesInspectorMixin } from "cesium";

/**
 * 添加3dtiles
 * @module ls/Add3dTiles
 */
class Add3dTiles{
    constructor(viewer:Viewer){
        this.viewer=viewer;
        this.tileset=undefined;
    }
    /**
     * cesium viewer实例
     */
    viewer:Viewer;
    /**
     * 3dtiles
     */
    tileset:Cesium3DTileset|undefined;
    /**
     * 添加3dtiles模型
     * @param url .json地址
     */
    add(url:string){
        this.clear();
        const tileset=this.viewer.scene.primitives.add(new Cesium3DTileset({
            backFaceCulling:false,//禁用背面剔除
            url:url
        }));
        this.tileset=tileset;
        const viewer=this.viewer;
        tileset.readyPromise.then(function(){
            viewer.zoomTo(tileset);
        })
        if(!(this.viewer as any).cesium3DTilesInspector){
            this.viewer.extend(viewerCesium3DTilesInspectorMixin);
        }
    }
    /**
     * 移出场景中的tilesets
     */
    clear(){
        const len=this.viewer.scene.primitives.length;//scene中图元数量
        const collection=this.viewer.scene.primitives;
        for(let i=0;i<len;i++){//删除全部tilesets
            const primitive=collection.get(i);
            if(primitive instanceof Cesium3DTileset){
                collection.remove(primitive);
            }
        }
    }
    /**
     * 从场景中移出
     */
    remove(){
        if(this.tileset){
            this.viewer.scene.primitives.remove(this.tileset);
        }
    }
}
export default Add3dTiles;