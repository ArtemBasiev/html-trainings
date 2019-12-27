"use strict";
var gulpCopy = require("gulp-copy");
var gulp = require("gulp"),
  watch = require("gulp-watch"),
  autoprefixer = require("gulp-autoprefixer"),
  uglify = require("gulp-uglify"),
  sass = require("gulp-sass"),
  source = require("gulp-sourcemaps"),
  cleanCSS = require("gulp-clean-css"),
  imagemin = require("gulp-imagemin"),
  pngquant = require("imagemin-pngquant"),
  rimraf = require("rimraf"),
  browserSync = require("browser-sync"),
  fileinclude = require("gulp-file-include"),
  plumber = require("gulp-plumber"),
  eslint = require("gulp-eslint"),
  reload = browserSync.reload;

var path = {
  build: {
    css: "build/css/"
  },
  src: {
    style: "src/style/main.scss"
  },
  watch: {
    style: "src/**/*.scss"
  },
  clean: "./build"
};

var config = {
  server: {
    baseDir: "./build"
  },
  open: false,
  //tunnel: true,
  host: "localhost",
  port: 8000,
  logPrefix: "arlin"
};

var sourceFiles = ["src/mock/**/*.json"];
var destination = "build/mock";

gulp.task("copy", function() {
  gulp.src(sourceFiles).pipe(gulp.dest(destination));
});


gulp.task("style:build", function() {
  gulp
    .src(path.src.style)
    .pipe(plumber())
    .pipe(source.init())
    .pipe(sass())
    .pipe(
      autoprefixer({
        grid: true,
        browsers: ["last 2 versions", "ie 11", "Firefox > 20"]
      })
    )
    // .pipe(cleanCSS())
    .pipe(source.write())
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({ stream: true }));
});


gulp.task("build", [
  "style:build",
  "copy"
]);

gulp.task("watch", function() {

  watch([path.watch.style], function(event, cb) {
    gulp.start("style:build");
  });
});

gulp.task("webserver", function() {
  browserSync(config);
});

gulp.task("clean", function(cb) {
  rimraf(path.clean, cb);
});

gulp.task("default", ["build", "webserver", "watch"]);