"usestrict";

const gulp = require("gulp"),
  path = require("path"),
  debug = require("gulp-debug"),
  gutil = require("gulp-util"), // показывает файлы находящиеся в обработке
  ///////////////////////////////////
  ///Work
  ///////////////////////////////////
  wiredep = require("wiredep").stream, // вставляет автоматически bower js и css в файлы html где установленны комментарии для плагина
  browserSync = require("browser-sync").create(), //запускает браузер и редактирование в режиме реального времени
  cleanCSS = require("gulp-clean-css"), // минимизирует файлы css
  uglify = require("gulp-uglify"), // минимизирует файлы js
  gulpif = require("gulp-if"), //создает вервление if
  sass = require("gulp-sass"),
  sourcemaps = require("gulp-sourcemaps"),
  pxtorem = require("gulp-pxtorem"),
  ///////////////////////////////////
  ///Build production
  ///////////////////////////////////
  //для webpack
  webpack = require("webpack-stream"),
  ///////////////////////////
  notify = require("gulp-notify"), //уведомления notify
  rimraf = require("gulp-rimraf"), // стирает файлы в папке
  useref = require("gulp-useref"), // объединяет файлы в один файл в продакшене
  filter = require("gulp-filter"), // фильтрует fonts для продакшена
  imagemin = require("gulp-imagemin"),
  autoprefixer = require("gulp-autoprefixer"),
  size = require("gulp-size"); //показывает объем файлов (в данном случае объем папки dist)

var pxtoremOptions = {
  rootValue: 16,
  unitPrecision: 5,
  propList: ["*"],
  selectorBlackList: [],
  replace: true,
  mediaQuery: false,
  minPixelValue: 0
};

var postcssOptions = {
  map: true
};

//------------------------------------------//////////////////////////////////////////
/////////// создание спрайтов svg
//////////////////////////////////////////////////////////////////////////////
var svgSprite = require("gulp-svg-sprite"),
  svgmin = require("gulp-svgmin"),
  cheerio = require("gulp-cheerio"),
  replace = require("gulp-replace");

var config = {
  mode: {
    symbol: {
      sprite: "../sprite.svg",
      render: {
        scss: {
          dest: "../../../sass/_sprite.scss"
        }
      },
      example: {
        dest: "../tmp/spriteSvgDemo.html" // демо html
      }
    }
  }
};

gulp.task("svgSpriteBuild", function() {
  return (gulp
      .src("app/icons/i/*.svg")
      // минифицируем svg
      .pipe(
        svgmin({
          js2svg: {
            pretty: true
          }
        })
      )
      // удалить все атрибуты fill, style and stroke в фигурах
      .pipe(
        cheerio({
          run: function($) {
            $("[fill]").removeAttr("fill");
            $("[stroke]").removeAttr("stroke");
            $("[style]").removeAttr("style");
          },
          parserOptions: {
            xmlMode: true
          }
        })
      )
      // cheerio плагин заменит, если появилась, скобка '&gt;', на нормальную.
      .pipe(replace("&gt;", ">"))
      // build svg sprite
      .pipe(svgSprite(config))
      .pipe(gulp.dest("app/icons/sprite/")) );
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////     ОБЪЯВЛЕНИЕ ТАСКОВ
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////
///Work (РАБОТА)
///////////////////////////////////
//Задача по умолчанию
gulp.task("default", ["server", "webpackJs"]);

// сборка js и минификация при помощи Webpack
gulp.task("webpackJs", function() {
  return gulp
    .src("./app/js/main.js")
    .pipe(
      debug({
        title: "src"
      })
    )
    .pipe(webpack(require("./webpack.config.js")))
    .pipe(gulp.dest("app/js/"));
});

//Препроцессор sass
gulp.task("sass", function() {
  return gulp
    .src(["app/sass/**/*.scss"])
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: "compressed"
      }).on("error", sass.logError)
    )
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions", "ie 6-11", "> 1%"],
        cascade: false
      })
    )
    .pipe(pxtorem(pxtoremOptions, postcssOptions))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("app/css"))
    .pipe(browserSync.stream());
});

// Сервер
gulp.task("server", function() {
  browserSync.init({
    server: "./app"
  });

  gulp.watch("app/sass/**/*.scss", ["sass"]);
  browserSync
    .watch(["app/*.html", "app/**/*.js"])
    .on("change", browserSync.reload);
});

///////////////////////////////////
///Build production  (СБОРКА)
///////////////////////////////////
//Переносим html css  в папку dist (как то  useref сичтывает файлы css и минифицирует их)
gulp.task("minall", function() {
  return (gulp
      .src("app/*.html")
      .pipe(useref())
      .pipe(
        debug({
          title: "src"
        })
      )
      // из файла index.html выбираем все файлы Js
      .pipe(gulpif("*.js", uglify())) // не минифицирует по стандарту es6
      .on("error", function(err) {
        gutil.log(gutil.colors.red("[Error]"), err.toString());
      })
      .pipe(
        gulpif(
          "*.css",
          cleanCSS({
            compatibility: "ie8"
          })
        )
      )
      .pipe(gulp.dest("dist")) );
});

//Отчистка
gulp.task("clean", function() {
  return gulp
    .src(["dist/**/*.*", "!dist/.git", "!dist/*.php"], {
      read: false
    })
    .pipe(
      debug({
        title: "src"
      })
    )
    .pipe(rimraf());
});

// Шрифты
gulp.task("fonts", function() {
  gulp
    .src("app/fonts/**/*.*")
    .pipe(
      filter(["**/*.eot", "**/*.svg", "**/*.ttf", "**/*.woff", "**/*.woff2"])
    )
    .pipe(gulp.dest("dist/fonts"));
});

// Уменьшение размера картинок
gulp.task("images", () => {
  gulp
    .src("app/img/**/*.*")
    .pipe(
      imagemin({
        interlaced: true,
        progressive: true
      })
    )
    .pipe(gulp.dest("dist/img"));
});

gulp.task("svg", () => {
  gulp.src("app/icons/sprite/sprite.svg").pipe(gulp.dest("dist/icons/sprite"));
});

//Отчистка папки dist
gulp.task("build", ["clean"], function() {
  gulp.start("dist");
});

//Сборка и вывод размера содержимого папки dist
gulp.task("dist", ["minall", "fonts", "images", "svg"], function() {
  return gulp
    .src("dist/**/*")
    .pipe(
      size({
        title: "build"
      })
    )
    .pipe(notify("подожди пока сборка не закончится сама!"));
});
