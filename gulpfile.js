"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");
var autoprefixer = require("gulp-autoprefixer");
var browserSync = require("browser-sync").create();

gulp.task("sass", function(){
  return gulp.src(["./scss/**/*.scss", "./node_modules/bootstrap/scss/bootstrap.scss","./node_modules/slick-carousel/slick/slick-theme.css", "./node_modules/slick-carousel/slick/slick.css"])
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: "compressed"}).on("error", sass.logError))
    .pipe(autoprefixer({
      browsers: ["last 2 versions"]
    }))
    .pipe(sourcemaps.write("./maps"))
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream())
});

gulp.task("js", function(){
  return gulp.src(["./node_modules/slick-carousel/slick/slick.min.js", "./node_modules/popper.js/dist/umd/popper.min.js", "./node_modules/jquery/dist/jquery.min.js", "./node_modules/bootstrap/dist/js/bootstrap.min.js", "./js/*.js"])
    .pipe(gulp.dest("./dist/js"))
    .pipe(browserSync.stream())
});

gulp.task("images", function(){
  return gulp.src("./images/*")
    .pipe(gulp.dest("./dist/images"))
});

gulp.task("copy", function(){
  return gulp.src("./*.html")
    .pipe(gulp.dest("./dist"))
    .pipe(browserSync.stream())
});

gulp.task("browserSync", function(){
  browserSync.init({
    server: {
      baseDir: "dist"
    }
  })
});

gulp.task("watch", ["browserSync", "sass"], function(){
  gulp.watch("./js/**/*.js", ["js"]);
  gulp.watch("./scss/**/*.scss", ["sass"]);
  gulp.watch("./*.html", ["copy"]);
});
