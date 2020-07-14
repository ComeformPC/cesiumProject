import { Viewer, Model, Cartesian3, Transforms, HeadingPitchRoll, Ellipsoid, Matrix4, BoundingSphere, HeadingPitchRange } from "cesium";

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
        this.clear();
        const origin = Cartesian3.fromDegrees(-95.0, 40.0, 0.0);//定义模型世界坐标系中位置
        const fixedFrameTransform = Transforms.localFrameToFixedFrameGenerator("north", "west");
        const hpRoll = new HeadingPitchRoll(0, 0, 0);
        const modelMatrix = Transforms.headingPitchRollToFixedFrame(
            origin,
            hpRoll,
            Ellipsoid.WGS84,
            fixedFrameTransform
        );
        const gltf=this.viewer.scene.primitives.add(Model.fromGltf({
            url:url,
            modelMatrix:modelMatrix
        })) as Model;
        this.gltf=gltf;
        gltf.readyPromise.then(()=>{
            const center=Matrix4.multiplyByPoint(modelMatrix,gltf.boundingSphere.center,new Cartesian3());
            const sphere=new BoundingSphere(center,gltf.boundingSphere.radius);
            this.viewer.camera.flyToBoundingSphere(sphere,{offset:new HeadingPitchRange(0,0,0)});
        })
    }
    /**
     * 移出场景中的gltf模型
     */
    clear(){
        const len=this.viewer.scene.primitives.length;//scene中图元数量
        const collection=this.viewer.scene.primitives;
        for(let i=0;i<len;i++){//删除全部gltf model
            const primitive=collection.get(i);
            if(primitive instanceof Model){
                collection.remove(primitive);
            }
        }
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