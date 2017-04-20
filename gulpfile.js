'use strict';

var gulp = require('gulp'),
browserSync = require('browser-sync').create(),
$ = require('gulp-load-plugins')();


var spriteConfig = {
	imgSrc: './app/templates/center_modal/img/needSprite/*.png',
	desSrc: './app/templates/center_modal/img/sprite',
	imgSprite: 'sprite_icon.png',
	cssName: '../../sprite.css',
	padding: 3
}

//合并sprite图片
gulp.task('sprite', function () {
  return gulp.src(spriteConfig.imgSrc)
    .pipe($.spritesmith({
      imgName: spriteConfig.imgSprite,//保存合并后图片的地址
      cssName: spriteConfig.cssName,//保存合并后对于css样式的地址
      padding:spriteConfig.padding,//合并时两个图片的间距
      algorithm: 'binary-tree',//注释1
      cssTemplate: function (data) {
        var arr=[];
        data.sprites.forEach(function (sprite) {
          arr.push(".icon-"+sprite.name+
          "{" +
          "background-image: url('"+sprite.escaped_image+"');"+
          "background-repeat: no-repeat;"+
          "background-position: "+sprite.px.offset_x+" "+sprite.px.offset_y+";"+
          "width:"+sprite.px.width+";"+
          "height:"+sprite.px.height+";"+
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
    .pipe($.less())
    .pipe(gulp.dest('app/styles'))
    .pipe(browserSync.stream());
});

// Sass 编译成 css
gulp.task('sass', function() {
  return gulp.src('app/styles/*.scss')
    .pipe($.less())
    .pipe(gulp.dest('app/styles'))
    .pipe(browserSync.stream());
});

// Jade 编译成 html
gulp.task('jade', function () {
  return gulp.src([
      'app/templates/jade/*.jade'
    ])
    .pipe($.jade({
      pretty: true
    }))
    .pipe(gulp.dest('app'))
    .pipe(browserSync.stream());
});

// 图片压缩优化
gulp.task('image', function(){
  return gulp.src('app/images/**')
      .pipe($.imagemin())
      .pipe(gulp.dest('app/images'));
})

// 拷贝所有文件
gulp.task('copy', function () {
  return gulp.src([
    'app/*.*',
    'app/images/**',
    'app/scripts/**',
    'app/styles/*.css',
    'app/module/*/*',
    '!app/module/**/*.less',
    '!app/_*.*',
    '!app/styles/_*.*',
    '!app/scripts/_*.*',
    '!app/images/**/*bak*.*',
    '!app/mock/**'
  ], {
    base: 'app',
    dot: true
  }).pipe(gulp.dest('dist'));
});

// Build 压缩 css
gulp.task('csso', ['copy'], function () {
  return gulp.src('dist/styles/*.css')
    // .pipe($.csso())
    .pipe(gulp.dest('dist/styles'));
});

// 优先清理 dist 目录，保证生产环境清洁
gulp.task('clean', require('del').bind(null, ['dist']));

// 启一个 Browser-sync 服务器并监听文件改动
gulp.task('serve', ['less', 'jade'], function() {
  browserSync.init({
    server: {
      baseDir: './app',
      directory: true
    }
  });
  gulp.watch('app/styles/*.less', ['less']);
  gulp.watch('app/templates/jade/*.jade', ['jade']);
  gulp.watch([
    'app/*.html',
    'app/scripts/*.js',
    'app/images/**',
    'app/mock/**'
  ]).on('change', browserSync.reload);
});

// 生产环境
gulp.task('step1', ['clean'], function() {
  gulp.start(['less', 'jade', 'image']);
});

gulp.task('build', ['step1'], function(){
  gulp.start('csso');
});

// 开发环境
gulp.task('default', ['serve']);