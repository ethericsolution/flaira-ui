const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const nunjucksRender = require("gulp-nunjucks-render");
const data = require("gulp-data");
const browserSync = require("browser-sync").create();

// Paths configuration
const paths = {
  nunjucks: {
    pages: "src/pages/**/*.+(njk|html)", // Support .njk and .html template files
    templates: "src/templates/",
    dest: "dist/",
  },
  styles: {
    src: "src/scss/**/*.scss", // Your custom Sass including bootstrap imports
    dest: "dist/css/",
  },
  scripts: {
    src: [
      "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js", // Bootstrap JS bundle
      "src/js/**/*.js", // Your custom JS files
    ],
    dest: "dist/js/",
  },
};

// Compile Nunjucks templates into HTML files in dist/
function compileNunjucks() {
  return src(paths.nunjucks.pages)
    .pipe(
      data(() => {
        return {};
      })
    )
    .pipe(
      nunjucksRender({
        path: [paths.nunjucks.templates],
      })
    )
    .pipe(dest(paths.nunjucks.dest))
    .pipe(browserSync.stream());
}

// Compile Sass including Bootstrap source with autoprefixing and minification
function compileStyles() {
  return src(paths.styles.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(concat("styles.min.css"))
    .pipe(dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

// Concatenate and minify JS including Bootstrap bundle and custom scripts
function compileScripts() {
  return src(paths.scripts.src)
    .pipe(concat("scripts.min.js"))
    .pipe(uglify())
    .pipe(dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

// Start Browsersync server to serve dist folder and support live reload
function serve(cb) {
  browserSync.init({
    server: {
      baseDir: "dist",
    },
  });
  cb();
}

// Watch source files and recompile + reload on change
function watcher() {
  watch(paths.nunjucks.pages, compileNunjucks);
  watch(`${paths.nunjucks.templates}/**/*.+(njk|html)`, compileNunjucks);
  watch(paths.styles.src, compileStyles);
  watch(paths.scripts.src, compileScripts);
}

// Define dev task: compile everything, serve, then watch
exports.dev = series(
  compileNunjucks,
  compileStyles,
  compileScripts,
  serve,
  watcher
);

// Define build task: compile everything once
exports.build = series(compileNunjucks, compileStyles, compileScripts);
