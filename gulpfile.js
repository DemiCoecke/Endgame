// Initialize modules
const { src, dest, series, parallel, watch} = require('gulp'),
    cssnano = require('gulp-cssnano'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    del = require('del'),
    browserSync = require("browser-sync").create();

const origin = 'src',
    destination = 'dist';

// Del task: removes dist folder before new one gets compiled
async function clean(cb) {
    await del(destination);
    cb();
}

// HTML task: compiles HTML to dist folder
function html(cb) {
    src(`${origin}/**/*.html`)
        .pipe(dest(destination));
    cb();
}

// Sass task: compiles the style.scss file into style.css
function css(cb){
    src(`${origin}/ui/*.scss`)
        .pipe(sass()) // compile SCSS to CSS
        // .pipe(cssnano()) // minify CSS
        .pipe(dest(`${destination}/css`)); // put final CSS in dist folder
    cb();
};

// JS task: concatenates and uglifies JS files to script.js
function js(cb) {
    src(`${origin}/**/*.js`)
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(dest(`${destination}/js`));
    cb();
};

// Imagemin task: optimize images
async function imgOptimize(cb) {
    src(`${origin}/images/*`)
        .pipe(imagemin())
        .pipe(dest(`${destination}/images`));
    cb();
}

// Watch task: watch SCSS and JS files for changes
function watcher(cb) {
    watch(`${origin}/**/*.scss`).on('change', series(css, browserSync.reload));
    watch(`${origin}/**/*.js`).on('change', series(js, browserSync.reload));
    watch(`${origin}/*.html`).on('change', series(html, browserSync.reload));
    cb(); 
};

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

// Default task 'gulp' in terminal
exports.default = series(clean, parallel(html, css, js), imgOptimize, server, watcher);