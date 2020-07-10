import { Viewer, Color, Cartographic } from 'cesium';

class SceneView{
    constructor(viewer:Viewer){
        this.viewer=viewer;
    }
    viewer:Viewer;
    zoomFactor=0.4;
    /**
     * 缩小
     */
    zoomOut(){
        const height=Cartographic.fromCartesian(this.viewer.camera.position).height;
        this.viewer.camera.zoomOut(height*this.zoomFactor);
    }
    /**
     * 放大
     */
    zoomIn(){
        const height=Cartographic.fromCartesian(this.viewer.camera.position).height;
        this.viewer.camera.zoomIn(height*this.zoomFactor);
    }
    /**
     * 返回初始位置
     */
    home(){
        this.viewer.camera.flyHome();
    }
}
export default SceneView;