import baseViewer=require('./widgets/baseViewer/widget');
import addGLTF=require('./widgets/addGLTF/widget');
import addTileset=require('./widgets/addTilesets/widget');

const viewer=new addTileset("cesiumViewer");
//const viewer=new addGLTF("cesiumViewer");
viewer.init();