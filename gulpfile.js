const {src,dest,series,parallel,watch}=require('gulp');
const gulpclean=require("gulp-clean");
const gltfPipeline=require("gltf-pipeline");
const fsExtra=require('fs-extra');
const config={
    model:'./public/data/model',
    Architecture:'chateau_de_montfa_81_gltf'
}
/**
 * 清空dist
 */
function clean(){
    return src(config.model+"/"+config.Architecture+"/draco",{
        read:false,
        allowEmpty:true
    })
    .pipe(gulpclean());
    //cb();//异步任务执行完成回调函数，当函数不返回内容时必须使用；
}
/**
 * 压缩gltf几何数据
 */
function dracoCompress(cb){
    const array=["origin","medium","low"];
    const level=[7,7,7];//压缩级别
    for(let i=0;i<array.length;i++){
        const name=array[i];
        const gltf=fsExtra.readJSONSync(config.model+"/"+config.Architecture+"/"+name+"/scene-"+name+".gltf");
        gltfPipeline.processGltf(gltf,{
            resourceDirectory:config.model+"/"+config.Architecture+"/"+name,
            separate:true,
            dracoOptions: {
                compressionLevel: 7
            }
        }).then(function(results){
            fsExtra.writeJSONSync(config.model+"/"+config.Architecture+"/"+name+"/scene-"+name+".gltf",results.gltf);
            //save separateResources
            const resources=results.separateResources;
            for(const resource in resources){
                const buffer=resources[resource];
                fsExtra.writeFileSync(config.model+"/"+config.Architecture+"/"+name+"/"+resource,buffer);
            }
        });
    }
    cb();
}
exports.draco=dracoCompress;