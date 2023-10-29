const { src, dest, parallel, series, task } = require('gulp4');
const gulp = require('gulp');
const pug = require('gulp-pug');
const less = require("gulp-less");
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const clean_css = require("gulp-clean-css");
const clean_html = require("gulp-htmlmin");
const { watch } = require('gulp');
const fsExtra = require('fs-extra');


function templates(cb) {
    //console.log("Views building");
    src('./src/views/*.pug')
        .pipe(pug({
            data: {
                DIR: "/build"
            }
        }))
        .pipe(clean_html())
        .pipe(dest('./build/html'));
    cb();
}

function styles(cb) {
    //console.log("Styles building");
    src('./src/styles/*.less')
        .pipe(less())
        .pipe(clean_css())
        .pipe(dest('./build/css'));
    cb()
}

function scripts_files(cb) {
    //console.log("Scripts files");
    src('./src/scripts/client/*.js')
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(dest('./build/js/client'));

    src('./src/scripts/server/*.js')
        .pipe(babel({
            presets: ['@babel/preset-env'] 
        }))
        .pipe(dest('./build/js/server'));

    src('./src/scripts/jquery.js')
        .pipe(babel({
            presets: ['@babel/preset-env'] 
        }))
        .pipe(dest('./build/js'));
    cb();
}

function images(cb) {
    src('./src/img/**')
        .pipe(dest('./build/img'));
    cb();
}

function clean(cb) {
    fsExtra.emptyDirSync("./build");
    cb();
}

function build(cb) {
    return parallel(templates, styles, scripts_files, images)(cb);
}

exports.default = series(clean, build)

watch(["./src/styles", "./src/views", "./src/scripts", "./src/img"], exports.default);