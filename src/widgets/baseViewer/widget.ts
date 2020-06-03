
class baseViewer{
    constructor(id){
        this.id=id;
    }
    id:string
    init(){
        Cesium.Ion.defaultAccessToken='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1ODRiY2NiYi1jMmVlLTRkNTctYTNhNy03ZGNlMGQ2YmNjZTQiLCJpZCI6MTQwMDIsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjQ1NTU1MDV9.6E9-n__jfDwX1e-C3H685NhJZ8HUx3BQ7FYEJ9Rz9Ec';
        const viewer=new Cesium.Viewer(this.id);
        const tileset=viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
            url:"./tilesets/TilesetWithDiscreteLOD/tileset.json"
        }));
        viewer.zoomTo(tileset);
    }
}
export=baseViewer;