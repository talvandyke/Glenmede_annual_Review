const gulp = require("gulp");
const nunjucksRender = require("gulp-nunjucks-render");
const sass = require("gulp-sass");
const prefix = require('gulp-autoprefixer');
const data = require("gulp-data");
const mergeJSON = require("gulp-merge-json");
const plumber = require("gulp-plumber");
const browserSync = require("browser-sync");
const server = browserSync.create();
const fs = require('fs');


const paths = {
  data: {
    src: 'src/data/inc/*.json',
    dest: 'src/data/'
  },
  styles: {
    src: 'src/lp/scss/**/*.scss',
    dest: './dist/lp/css/'
  },
  htmlLP: {
    src: 'src/lp/templates/**/*'
  },
  nunjucksLP: {
    src: './src/lp/templates/*.njk',
    dest: './dist/lp/'
  },
  htmlEmail: {
    src: 'src/email/templates/**/*'
  },
  nunjucksEmail: {
    src: './src/email/templates/*.njk',
    dest: './dist/email/'
  },
  nunjucksCSS: {
    src: 'src/lp/wip/**/*.scss',
    dest: 'src/lp/scss/'
  }
};


function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: './dist/',
      directory: true
    }
  });
  done();
}

function mergeData(done) {
  gulp.src('./src/data/inc/*.json')
    .pipe(mergeJSON({
      fileName: 'do_not_edit.json'
    }))
    .pipe(gulp.dest('./src/data/'));
  done();
}

function getData(file) {
  return JSON.parse(fs.readFileSync(file));
}

function nunjucksLP(done) {
  gulp.src(paths.nunjucksLP.src)
    .pipe(plumber())
    .pipe(data(getData('./src/data/do_not_edit.json')))
    .pipe(
      nunjucksRender({
        path: ['./src/lp/templates/'],
      })
    )
    .pipe(gulp.dest(paths.nunjucksLP.dest));
  done();
}

function nunjucksEmail(done) {
  gulp.src(paths.nunjucksEmail.src)
    .pipe(plumber())
    .pipe(data(getData('./src/data/do_not_edit.json')))
    .pipe(
      nunjucksRender({
        path: ['./src/email/templates/'],
      })
    )
    .pipe(gulp.dest(paths.nunjucksEmail.dest));
  done();
}

function nunjucksCSS(done) {
  // Placeholder
  done();
}

function style(done) {
  gulp.src(paths.styles.src)
    .pipe(plumber())
    .pipe(sass())
    .pipe(prefix())
    .pipe(gulp.dest(paths.styles.dest));
  done();
}



const watch = () => gulp.watch([paths.styles.src, paths.htmlLP.src, paths.htmlEmail.src, paths.data.src], gulp.series(mergeData, nunjucksLP, nunjucksEmail, style, reload));

const dev = gulp.series(mergeData, nunjucksLP, nunjucksEmail, style, serve, watch);

const merge = gulp.series(mergeData);


exports.default = dev;
exports.merge = merge;

