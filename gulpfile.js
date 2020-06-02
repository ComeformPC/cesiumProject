const {src,dest,series,parallel,watch}=require('gulp');
const gulpclean=require("gulp-clean");
const sass=require("gulp-sass");
const browser=require("browser-sync").create();
const ts=require("gulp-typescript");
const tsConfig=ts.createProject("tsconfig.json");
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
            baseDir:'./dist'
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
exports.build=series(clean,typescript,sassStyle,copy);
exports.server=series(serve,serverwatch);