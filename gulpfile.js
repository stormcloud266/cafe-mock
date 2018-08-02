const gulp = require('gulp'),
autoprefixer = require('gulp-autoprefixer'),
sass = require('gulp-sass'),
babel = require('gulp-babel'),
browserSync = require('browser-sync').create(),
cleanCSS = require('gulp-clean-css'),
handlebars = require('gulp-compile-handlebars'),
rename = require("gulp-rename"),
uglify = require('gulp-uglify-es').default,
watch = require('gulp-watch');

gulp.task('watch', () => {

    browserSync.init({
        notify: false,
        server: {
            baseDir: "./build"
        }
    })

    watch(['./src/*.hbs','./src/partials/**/*.hbs'], gulp.parallel('handlebarsReload'));
    watch('./src/styles/**/*.scss',  gulp.parallel('cssInject'));
    watch('./src/scripts/**/*.js', gulp.parallel('JSReload'));
});


// html and handlebars
gulp.task('compilePartials', function () {
    let templateData = {},
    options = {
        ignorePartials: true,
        batch : ['./src/partials']
    }
    return gulp.src('./src/*.hbs')
        .pipe(handlebars(templateData, options))
        .pipe(rename({ extname: '.html' }))
        .pipe(gulp.dest('./build'));
});

gulp.task('handlebarsReload', gulp.series('compilePartials', function(){
  browserSync.reload();
}));


// css and scss
gulp.task('styles', () => {
    return gulp.src('./src/styles/styles.scss')
        .pipe(sass())
        .on('error', function(errorInfo){
        	console.log(errorInfo.toString());
        	this.emit('end');
        })
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCSS({debug: true}, (details) => {
          console.log(`${details.name}: ${details.stats.originalSize}`);
          console.log(`${details.name}: ${details.stats.minifiedSize}`);
        }))
        .pipe(gulp.dest('./build/css/'))
});

gulp.task('cssInject', gulp.series('styles', () => {
  console.log('cssInject')
  return gulp.src('./build/css/styles.css')
    .pipe(browserSync.stream());
}));


// javascript
gulp.task('minifyJS', () => {
  return gulp.src('./src/scripts/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./build/js/'))
});

gulp.task('JSReload',gulp.series('minifyJS', function(){
  browserSync.reload();
}));
