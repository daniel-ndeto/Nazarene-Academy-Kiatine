/* ===============================
   Gulp Configuration
================================= */
const gulp = require("gulp");
const gulpSass = require("gulp-sass")(require("sass"));
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const notify = require("gulp-notify");
const minifycss = require("gulp-minify-css");
const concat = require("gulp-concat");
const plumber = require("gulp-plumber");
const browserSync = require("browser-sync").create();
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer").default;

/* ===============================
   Sass Compilation Task
================================= */
function sassTask() {
  return gulp
    .src("scss/style.scss", { allowEmpty: true })
    .pipe(plumber())
    .pipe(
      gulpSass({
        errLogToConsole: true,
        outputStyle: "expanded",
        precision: 10,
      }).on("error", gulpSass.logError)
    )
    .pipe(sourcemaps.init())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 2 versions"],
        cascade: false,
      })
    )
    .pipe(gulp.dest("css"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(minifycss())
    .pipe(gulp.dest("css"))
    .pipe(browserSync.stream());
}

/* ===============================
   JS Build Task
================================= */
gulp.task("scripts", function () {
  return gulp
    .src(
      [
        "js/vendor/jquery.min.js",
        "js/vendor/jquery.easing.1.3.js",
        "js/vendor/jquery.stellar.min.js",
        "js/vendor/jquery.flexslider-min.js",
        "js/vendor/imagesloaded.pkgd.min.js",
        "js/vendor/isotope.pkgd.min.js",
        "js/vendor/jquery.countTo.js",
        "js/vendor/jquery.magnific-popup.min.js",
        "js/vendor/photoswipe.min.js",
        "js/vendor/photoswipe-ui-default.min.js",
        "js/vendor/owl.carousel.min.js",
        "js/vendor/bootstrap.min.js",
        "js/vendor/jquery.waypoints.min.js",
      ],
      { allowEmpty: true }
    )
    .pipe(concat("scripts.js"))
    .pipe(gulp.dest("js"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(uglify())
    .pipe(gulp.dest("js"));
});

/* ===============================
   Merge & Minify CSS Vendor Files
================================= */
gulp.task("merge-styles", function () {
  return gulp
    .src(
      [
        "css/vendor/bootstrap.min.css",
        "css/vendor/animate.css",
        "css/vendor/icomoon.css", // ← even if missing, won’t break build
        "css/vendor/flexslider.css",
        "css/vendor/owl.carousel.min.css",
        "css/vendor/owl.theme.default.min.css",
        "css/vendor/magnific-popup.css",
        "css/vendor/photoswipe.css",
        "css/vendor/default-skin.css",
      ],
      { allowEmpty: true }
    )
    .pipe(concat("styles-merged.css"))
    .pipe(gulp.dest("css"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(minifycss())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("css"))
    .pipe(browserSync.stream());
});

/* ===============================
   BrowserSync Task
================================= */
gulp.task("browser-sync", function () {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
});

/* ===============================
   Watch Task
================================= */
function watchFiles() {
  gulp.watch(["scss/**/*.scss"], gulp.series(sassTask));
  gulp.watch(["js/**/*.js"], gulp.series("scripts"));
  gulp.watch(["*.html"]).on("change", browserSync.reload);
}

/* ===============================
   Combined Tasks
================================= */
gulp.task("default", gulp.series(gulp.parallel(sassTask, "scripts", "browser-sync"), watchFiles));

gulp.task("build", gulp.series(sassTask, "scripts", "merge-styles"));
