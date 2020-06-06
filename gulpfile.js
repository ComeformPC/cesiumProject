const {src,dest,series,parallel,watch}=require('gulp');
const gulpclean=require("gulp-clean");
const sass=require("gulp-sass");
const browser=require("browser-sync").create();
const ts=require("gulp-typescript");
const tsConfig=ts.createProject("tsconfig.json");
const gltfPipeline=require("gltf-pipeline");
const fsExtra=require('fs-extra');
/**
 * 清空dist
 */
function clean(){
    return src("./dist/",{
        read:false,
        allowEmpty:true
    })
    .pipe(gulpclean());
    //cb();//异步任务执行完成回调函数，当函数不返回内容时必须使用；
}
/**
 * 复制其他文件
 */
function copy(cb){
    return src([
        "src/**/*.*",
        "!src/**/*.ts",
        "!src/**/*.scss"
    ]).pipe(dest("dist"));
    //cb();
}
/**
 * 拷贝html
 */
function html(cb){
    return src("src/**/*.html")
    .pipe(dest("dist"));
    //cb();
}
/**
 * 编译ts文件
 */
function typescript(cb){
    return src("src/**/*.ts")
    .pipe(tsConfig())
    .pipe(dest("dist"));
    //cb();
}
/**
 * 编译scss文件
 */
function sassStyle(cb){
    return src("src/**/*.scss")
    .pipe(sass())
    .pipe(dest("dist"));
    //cb();
}
/**
 * 启动服务器
 */
function serve(cb){
    browser.init({
        server:{
            baseDir:['./dist','./libs','./data']
        },
        notify:false
    });
    cb();
}
/**
 * 刷新页面 
 */
function reload(cb){
    browser.reload();
    cb();
}
/**
 * 监听文件
 */
function serverwatch(cb){
    watch("src/**/*.ts",series(typescript,reload));
    watch("src/**/*.scss",series(sassStyle,reload));
    watch("src/**/*.html",series(html,reload));
    cb();
}
/**
 * 简化gltf网格
 */
function dracoCompress(cb){
    const array=["medium","low"];
    const level=[7,10];
    for(let i=0;i<array.length;i++){
        const name=array[i];
        const gltf=fsExtra.readJSONSync("./data/tf/gltf/ground.gltf");
        gltfPipeline.processGltf(gltf,{
            resourceDirectory:"./data/tf/gltf",
            separate:true,
            dracoOptions: {
                compressionLevel: level[i]
            }
        }).then(function(results){
            fsExtra.writeJSONSync("./data/tf/gltf/"+name+"/ground-"+name+".gltf",results.gltf);
            //save separateResources
            const resources=results.separateResources;
            for(const resource in resources){
                const buffer=resources[resource];
                fsExtra.writeFileSync("./data/tf/gltf/"+name+"/"+resource,buffer);
            }
        });
    }
    //mediump
    // gltfPipeline.processGltf(gltf,{
    //     resourceDirectory:"./data/tf/gltf",
    //        separate:true,
    //     dracoOptions: {
    //         compressionLevel: 7
    //     }
    // }).then(function(results){
    //     fsExtra.writeJSONSync("./data/tf/gltf/ground-medium.gltf",results.gltf);
    // });
    //low
    cb();
}
exports.draco=dracoCompress;
exports.build=series(clean,typescript,sassStyle,copy);
exports.server=series(serve,serverwatch);