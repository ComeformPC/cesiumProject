import baseViewer from './baseViewer/widget';
import addGLTF from './addGLTF/widget';
import addTileset from './addTilesets/widget';

const viewer=new addTileset("cesiumViewer");
//const viewer=new addGLTF("cesiumViewer");
viewer.init();