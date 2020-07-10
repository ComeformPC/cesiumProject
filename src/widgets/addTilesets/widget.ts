import Cesium from 'cesium';
class addGLTF {
    constructor(id:string) {
        this.id = id;
    }
    id: string
    init() {
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1ODRiY2NiYi1jMmVlLTRkNTctYTNhNy03ZGNlMGQ2YmNjZTQiLCJpZCI6MTQwMDIsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjQ1NTU1MDV9.6E9-n__jfDwX1e-C3H685NhJZ8HUx3BQ7FYEJ9Rz9Ec';
        const viewer = new Cesium.Viewer(this.id);
        // const tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
        //     url:"./tilesets/TilesetWithDiscreteLOD/tileset.json"
        // }));
        //ground lod
        var origin = Cesium.Cartesian3.fromDegrees(-95.0, 40.0, 0.0);
        var fixedFrameTransform = Cesium.Transforms.localFrameToFixedFrameGenerator("north", "west");
        var hpRoll = new Cesium.HeadingPitchRoll(0, 0, 0);
        var modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
            origin,
            hpRoll,
            Cesium.Ellipsoid.WGS84,
            fixedFrameTransform
        );
        const tileset:Cesium.Cesium3DTileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
            url:"./tilesets/guju/tileset.json"
        }));
        tileset.readyPromise.then(function(){
            //tileset.modelMatrix=modelMatrix;
            viewer.zoomTo(tileset);
        })
        viewer.extend(Cesium.viewerCesium3DTilesInspectorMixin);
        
    }
}
export default addGLTF;