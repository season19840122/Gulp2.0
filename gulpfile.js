'use strict';

var gulp = require('gulp'),
browserSync = require('browser-sync').create(),
$ = require('gulp-load-plugins')();


var spriteConfig = {
	imgSrc: './app/templates/center_modal/img/needSprite/*.png'
	,desSrc: './app/templates/center_modal/img/sprite'
	,imgSprite: 'sprite_icon.png'
	,cssName: '../../sprite.css'
	,padding: 3
}

//合并sprite图片
gulp.task('sprite', function () {
  return gulp.src(spriteConfig.imgSrc)
    .pipe($.spritesmith({
      imgName: spriteConfig.imgSprite, // 保存合并后图片的地址
      cssName: spriteConfig.cssName, // 保存合并后对于 css 样式的地址
      padding: spriteConfig.padding, // 合并时两个图片的间距
      algorithm: 'binary-tree', // 注释1
      cssTemplate: function (data) {
        var arr = [];
        data.sprites.forEach(function (sprite) {
          arr.push(".icon-" + sprite.name+
          "{" +
          "background-image: url('" + sprite.escaped_image + "');"+
          "background-repeat: no-repeat;" +
          "background-position: " + sprite.px.offset_x + " " + sprite.px.offset_y + ";" +
          "width:" + sprite.px.width + ";" +
          "height:" + sprite.px.height + ";" +
          "}\n");
        });
        return arr.join("");
      }
    }))
    .pipe(gulp.dest(spriteConfig.desSrc));
});

// Less 编译成 css
gulp.task('less', function() {
  return gulp.src('app/styles/*.less')
    .pipe($.plumber())
    .pipe($.less())
    .pipe(gulp.dest('app/styles'))
    .pipe(browserSync.stream());
});

// Sass 编译成 css
gulp.task('sass', function() {
  return gulp.src('app/styles/*.scss')
    .pipe($.sass())
    .pipe(gulp.dest('app/styles'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
  gulp.src([
    'app/scripts/u/**/*.js'
  ])
  .pipe($.plumber())
  .pipe($.uglify({
    mangle: false // 类型：Boolean 默认：true 是否修改变量名
    ,compress: false // 类型：Boolean 默认：true 是否完全压缩
    ,output: {
      beautify: true
      ,indent_level: 2
      ,indent_start: 4
      ,comments: /^!|@preserve|@license|@cc_on/i 
    } // 保留指定的注释信息
  }))
  .pipe(gulp.dest('.tmp/scripts'))
  .pipe(browserSync.stream());

  gulp.src([
    'app/scripts/**/*.js'
    ,'!app/scripts/**/_*.*'
    ,'!app/scripts/u/**/*.js'
  ])
  .pipe($.plumber())
  .pipe(gulp.dest('.tmp/scripts'))
  .pipe(browserSync.stream());
});

// Jade 编译成 html
gulp.task('jade', function () {
  return gulp.src([
      'app/templates/jade/*.jade'
    ])
    .pipe($.plumber())
    .pipe($.jade({
      pretty: true
    }))
    .pipe($.htmlmin({
      removeComments: false, // 清除 HTML 注释，规则跟 uglify 类似，<!--! 开头的保留注释
      collapseWhitespace: false, // 压缩 HTML
      collapseBooleanAttributes: true, // 省略布尔属性的值 <input checked="true"/> ==> <input />
      removeEmptyAttributes: true, // 删除所有空格作属性值 <input id="" /> ==> <input />
      removeScriptTypeAttributes: true, // 删除 <script> 的 type="text/javascript"
      removeStyleLinkTypeAttributes: true, // 删除 <style> 和 <link> 的 type="text/css"
      minifyJS: {
        mangle: false // 类型：Boolean 默认：true 是否修改变量名
        ,compress: false // 类型：Boolean 默认：true 是否完全压缩
        ,output: {
          beautify: true
          ,indent_level: 2
          ,indent_start: 4
          ,comments: /^!|@preserve|@license|@cc_on/i
        } 
      } // 压缩页面 JS
      ,minifyCSS: {
        compatibility: 'ie9' // 兼容 IE9
        ,format: 'keep-breaks' // 不压缩成 1 行，输出非常好的代码
      } // 压缩页面 CSS
    }))
    .pipe(gulp.dest('app'))
    .pipe(browserSync.stream());
});

// 图片压缩优化
gulp.task('image', function(){
  return gulp.src('app/images/**')
    .pipe(
      $.cache(
        $.imagemin([
          $.imagemin.gifsicle({ interlaced: true }) // 隔行扫描 gif 进行渲染，默认为：false 
          ,$.imagemin.jpegtran({ progressive: true }) // 无损压缩 jpg 图片，默认为：false 
          ,$.imagemin.optipng({ optimizationLevel: 6 }) // png 优化等级，（取值范围：0-7）默认为：3
          ,$.imagemin.svgo({ plugins: [{ removeViewBox: true }] }) // 多次优化 svg 直到完全优化，默认为：false 
        ], {
          verbose: true
        })
      )
    )
    .pipe(gulp.dest('app/images'));
})

// 拷贝所有文件
gulp.task('copy', function () {
  return gulp.src([
    'app/*.*'
    ,'app/images/**'
    ,'app/styles/*.css'
    ,'app/module/*/*'
    ,'app/mock/**'
    ,'!app/module/**/*.less'
    ,'!app/_*.*'
    ,'!app/styles/_*.*'
    ,'!app/images/**/*bak*.*'
  ], {
    base: 'app'
    ,dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('extra', function () {
  return gulp.src([
    '.tmp/**'
  ]).pipe(gulp.dest('dist'));
});

// Build 压缩 css
gulp.task('csso', ['copy', 'extra'], function () {
  return gulp.src('dist/styles/*.css')
    // .pipe($.csso())
    .pipe(gulp.dest('dist/styles'));
});

// 优先清理 dist 目录，保证生产环境清洁
gulp.task('cleantmp', require('del').bind(null, ['.tmp']));
gulp.task('clean', require('del').bind(null, ['dist']));

// 启一个 Browser-sync 服务器并监听文件改动
gulp.task('serve', ['less', 'scripts', 'jade'], function() {
  browserSync.init({
    server: {
      baseDir: ['app', '.tmp']
      ,directory: true
    }
  });
  gulp.watch('app/styles/*.less', ['less']);
  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch('app/templates/jade/*.jade', ['jade']);
  gulp.watch([
    'app/*.html'
    ,'app/images/**'
    ,'app/mock/**'
  ]).on('change', browserSync.reload);
});

// 生产环境
gulp.task('pre', ['clean'], function(){
  gulp.start('step1');
});

gulp.task('step1', ['less', 'scripts', 'jade', 'image'], function(){
  gulp.start('step2');
});

gulp.task('step2', ['csso'], function(){
  browserSync.init({
    server: {
      baseDir: './dist'
      ,directory: true
    }
  });
});

gulp.task('build', ['pre']);

// 产品环境
gulp.task('default', ['cleantmp'], function(){
  gulp.start('serve');
});