const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();

//Compile scss into css
function style(){
    return gulp.src('src/sass/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
}

exports.style = style;

//copy html
async function copyHTML(){
    return gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));
}

exports.copyHTML = copyHTML;

//optimize images
async function imageMin(){
    return gulp.src('src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
}

exports.imageMin = imageMin;

//concatenate files into one file named main.js
async function scripts(){
    return gulp.src('src/js/*.js')
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
}

exports.scripts = scripts;

function watch(){
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    })
    gulp.watch('src/js/*.js', scripts);
    gulp.watch('src/sass/*.scss', style);
    gulp.watch('src/images/*', imageMin);
    gulp.watch('src/*.html', copyHTML).on('change', browserSync.reload);
}

exports.watch = watch;
