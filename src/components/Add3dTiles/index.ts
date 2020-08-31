import { Viewer, Cesium3DTileset, viewerCesium3DTilesInspectorMixin, ScreenSpaceCameraController, ScreenSpaceEventHandler, ScreenSpaceEventType, Cartographic, Transforms, Cartesian3, Quaternion, Matrix3, Matrix4 } from "cesium";

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
     * 通过鼠标点击的坐标，设置3d tiles位置
     * @param url tileset.json
     */
    clickAdd(url:string){
        const scene=this.viewer.scene;
        const viewer=this.viewer;
        const handler=new ScreenSpaceEventHandler(this.viewer.canvas);
        //const coor = Cartographic.fromDegrees(-95.0, 40.0, 0);//定义模型世界坐标系中位置)
        handler.setInputAction(function(e){
            const position=scene.pickPosition(e.position);
            const modelMat4=Transforms.eastNorthUpToFixedFrame(position);
            const tileset=scene.primitives.add(new Cesium3DTileset({
                url:url
            })) as Cesium3DTileset;
            tileset.readyPromise.then(function(){
                const center=tileset.boundingSphere.center;
                //球心-position 向量OA
                const vPosition=Cartesian3.normalize(position,new Cartesian3());
                //球心-center  向量OB
                const vCenter=Cartesian3.normalize(center,new Cartesian3());
                //叉积，向量OB，OA的垂线。
                const cross=Cartesian3.cross(vCenter,vPosition,new Cartesian3());
                //角度
                const angle=Cartesian3.angleBetween(vCenter,vPosition);
                //绕垂线旋转angle的四元数
                const quatern=Quaternion.fromAxisAngle(cross,angle);
                const rotation=Matrix3.fromQuaternion(quatern);
                //平移旋转矩阵
                const RTMat4=Matrix4.fromRotationTranslation(rotation,undefined);
                tileset.modelMatrix=RTMat4;
                viewer.camera.flyToBoundingSphere(tileset.boundingSphere);
            })
        },ScreenSpaceEventType.LEFT_CLICK)
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