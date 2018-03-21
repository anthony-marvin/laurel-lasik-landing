
var gulp = require('gulp');
var critical = require('critical');
var imagemin = require('gulp-imagemin');
// var uncss = require( 'gulp-uncss' ); Not necessary, breaks css
var concat = require('gulp-concat');
var sass = require( 'gulp-sass' );
var url = "https://www.lodenvision.com/landing/lasik-landing-staging/" //CHANGE THIS TO WHATEVER YOU NEED
gulp.task( 'critical', function(){
  critical.generate({
    base: 'src',
    inline: true,
    src: 'index.html',
    css: ['dist/css/main.css' ],
    dimensions: [{
      height:1440,
      width:2560,
    }, {
      height:1080,
      width:1920,
    }, {
      height: 1024,
      width: 768
    }, {
      height: 667,
      width: 375
    }],
    dest: '../dist/index.html',
    ignore: ['@font-face', /url\(/],
      minify: true

    })
  })
  gulp.task( 'sass', function() {
    return gulp.src( 'src/**/*.scss' )
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(gulp.dest('src/'))
  } )
  gulp.task( 'concat', function(){
    return gulp.src( 'src/css/**/*.css' )
    .pipe(concat('main.css'))
    .pipe(gulp.dest( 'dist/css/' ))
  })
  gulp.task( 'concat-scripts', function(){
    return gulp.src( 'src/js/**/*.js' )
    .pipe(concat('all.js'))
    .pipe(gulp.dest( 'dist/js/' ))
  })
  gulp.task('imagemin', () =>
  gulp.src(['src/**/*', '!src/**/*.js', '!src/**/*.css', '!src/**/*.scss'])
  .pipe(imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.jpegtran({progressive: true}),
    imagemin.optipng({optimizationLevel: 5}),
    imagemin.svgo({plugins: [{removeViewBox: true}]})
  ]))
  .pipe(gulp.dest('dist/'))
)
gulp.task('default', [ 'sass', 'concat', 'concat-scripts', 'imagemin', 'critical' ] );
gulp.task( 'watch', function() {
  gulp.watch( ['src/**/*.scss'], ['sass'] );
  gulp.watch( ['src/**/*.css', '!dist/**/*'], ['concat', 'critical'] );
  gulp.watch( ['src/**/*.js', '!dist/**/*'], ['concat-scripts'] ); //TODO: REVISE SO THAT GULP DOESN'T LOOP. - SOLVED
  gulp.watch( ['src/*.html', '!dist/**/*'], ['critical'] );
  gulp.watch( ['src/**/*', '!src/**/*.js', '!src/**/*.css', '!src/**/*.scss', '!dist/**/*', '!src/**/*.html'], ['imagemin'] );

} )
