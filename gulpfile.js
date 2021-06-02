//Basics
const { src, dest, series, parallel, watch} = require('gulp'),
    cssnano = require('gulp-cssnano'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    del = require('del'),
    browserSync = require("browser-sync").create();

const origin = 'src', destination = 'dist';

//Delets old files - clean up!
async function clean(cb) {
    await del(destination);
    cb();
}

//Copy HTML
function html(cb) {
    src(`${origin}/**/*.html`)
        .pipe(dest(destination));
    cb();
}

//SASS
function css(cb){
    src(`${origin}/ui/*.scss`)
        .pipe(sass()) // compile SCSS to CSS
        // .pipe(cssnano()) // minify CSS
        .pipe(dest(`${destination}/css`)); // put final CSS in dist folder
    cb();
};

//Concatenate & uglify JS
function js(cb) {
    src(`${origin}/**/*.js`)
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(dest(`${destination}/js`));
    cb();
};

//Optimize images
async function imgOptimize(cb) {
    src(`${origin}/images/*`)
        .pipe(imagemin())
        .pipe(dest(`${destination}/images`));
    cb();
}

//Watch task
function watcher(cb) {
    watch(`${origin}/**/*.scss`).on('change', series(css, browserSync.reload));
    watch(`${origin}/**/*.js`).on('change', series(js, browserSync.reload));
    watch(`${origin}/*.html`).on('change', series(html, browserSync.reload));
    cb(); 
};

//Browsersync
function server(cb){
    browserSync.init({
        notify: false,
        open: false,
        server: {
            baseDir: destination
        }
    })
    cb();
}

//Default
exports.default = series(clean, parallel(html, css, js), imgOptimize, server, watcher);