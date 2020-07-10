import { Viewer, Cesium3DTileset, Cartesian3, Transforms, HeadingPitchRoll, Ellipsoid, viewerCesium3DTilesInspectorMixin } from "cesium";

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
        const origin = Cartesian3.fromDegrees(-95.0, 40.0, 0.0);
        const fixedFrameTransform = Transforms.localFrameToFixedFrameGenerator("north", "west");
        const hpRoll = new HeadingPitchRoll(0, 0, 0);
        const modelMatrix = Transforms.headingPitchRollToFixedFrame(
            origin,
            hpRoll,
            Ellipsoid.WGS84,
            fixedFrameTransform
        );
        console.log(modelMatrix);
        const tileset=this.viewer.scene.primitives.add(new Cesium3DTileset({
            backFaceCulling:false,//禁用背面剔除
            url:url
        }));
        this.tileset=tileset;
        const viewer=this.viewer;
        tileset.readyPromise.then(function(){
            viewer.zoomTo(tileset);
        })
        this.viewer.extend(viewerCesium3DTilesInspectorMixin);
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