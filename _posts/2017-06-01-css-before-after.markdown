---
layout: post
category: "css"
title:  "css预处理器与后处理器"
tags: ["css","postcss"]
---

#### CSS预处理器

目前最主流的三个预处理器: LESS、SASS、Stylus

[三种预处理器的特性和差异]（http://efe.baidu.com/blog/revisiting-css-preprocessors/） 

#### CSS后处理器：postcss

##### 1. 什么是postcss

[postcss](https://github.com/postcss/postcss)是一个css后处理器，可以用来分析CSS规则，并给出AST（抽象语法树），可以很方便的用JS来修改CSS。所有的转化都是通过插件来完成的。

##### 2. 如何使用postcss

1. 在构建工具中引入postcss
2. 选择postcss的插件并添加到你的postcss处理器中

gulp实现
```js
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var mqpacker = require('css-mqpacker'); //css-mqpacker joins matching CSS media queries into a single statement.
var cssnano = require('cssnano');
gulp.task('css', function () {
    var processors = [
        autoprefixer({browsers: ['last 1 version']}),
        mqpacker,
        cssnano
    ];
    return gulp.src('./src/*.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest('./dest'));
});
```

[autoprefixer中浏览器属性值](https://github.com/browserslist/browserslist)

webpack实现
```js
// Use postcss-loader in webpack.config.js
module.export = {
    module: {
        rules: {
            test:'/\.css$/',
            exclude: /node_modules/,
            use:[
                {
                    loader:'style-loader',
                },
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1,
                    }
                },
                {
                    loader: 'postcss-loader'
                }
            ]
        }
    }
}
// Then create postcss.config.js:来配置postcss处理器
var precss =  require('precss'); // contains plugins that allow you to use Sass-like CSS.
var autoprefixer = require('autoprefixer');
module.exports = {
    plugins: [
        precss,
        autoprefixer
    ]
}
```

现在postcss中已经有200个插件，我们可以从[插件列表](https://github.com/postcss/postcss/blob/master/docs/plugins.md)中选择我们需要的插件来使用：

##### postcss中比较通用的插件


|插件名称	|插件用途  |
| :-------- | :-------- |
| autoprefixer  | Autoprefixer 是来添加前缀，来处理兼容性问题。同样他也会移除一些旧的，不需要的前缀 | 
| postcss-nested | 可以嵌套写css，使结构更清晰直观，更易维护 |
| postcss-import | 引入其他文件 | 
| cssnano | 压缩css文件	| 
| postcss-custom-properties| 变量 |
| postcss-mixins | 函数	| 
| postcss-sprites | 雪碧图 | 

```css
/* autoprefixer before */
a {
    display: flex;
}
a {
    -webkit-border-radius: 5px;
            border-radius: 5px;
}
/* autoprefixer after */
a {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex
}
a {
    border-radius: 5px;
}

/* postcss-nested  before */
.phone {
    &_title {
        width: 500px;
        @media (max-width: 500px) {
            width: auto;
        }
        body.is_dark & {
            color: white;
        }
    }
    img {
        display: block;
    }
}
/* postcss-nested  after */
.phone_title {
    width: 500px;
}
@media (max-width: 500px) {
    .phone_title {
        width: auto;
    }
}
body.is_dark .phone_title {
    color: white;
}
.phone img {
    display: block;
}

/* postcss-import before */
/* 例如，有个 body.css 文件body.css */
body {
  background: black;
}
/* 再main.css中引入 body.cssmain.css */
@import "main.css"
/* postcss-import after */
/* main.css */
body {
  background: black;
}
/* postcss-custom-properties before */	
:root {
  --color: red;
}
div {
  color: var(--color);
}
/* postcss-custom-properties after */
div {
  color: red;
}
/* postcss-mixins before */
@define-mixin icon $network, $color: blue {
    .icon.is-$(network) {
        color: $color;
        @mixin-content;
    }
    .icon.is-$(network):hover {
        color: white;
        background: $color;
    }
}
@mixin icon twitter {
    background: url(twt.png);
}
@mixin icon youtube, red {
    background: url(youtube.png);
}
/* postcss-mixins after */
.icon.is-twitter {
    color: blue;
    background: url(twt.png);
}
.icon.is-twitter:hover {
    color: white;
    background: blue;
}
.icon.is-youtube {
    color: red;
    background: url(youtube.png);
}
.icon.is-youtube:hover {
    color: white;
    background: red;
}
```

**注意**

webpack中uglifyjs插件导致 -ms-transform 被移除，导致IE低版本中的transform失效。

当时查找原因是webpack中uglifyjs插件会修改其它 loader 的 minification 属性为true, 而css-loader在此时会使用cssnano压缩css, 结果导致 -ms-transform 被移除

在需要兼容IE低版本时，不可使用cssnano

#### 查考文献：
 
1. postcss-loader github： https://github.com/postcss/postcss-loader

2. 勾三股四PPT：http://jiongks.name/slides/css-memos/

3. http://www.html-js.com/article/Postcss-postcss-pre-processor-and-post-processor

4. cssnano官网：http://cssnano.co/

5. postcss常用插件介绍：http://www.w3cplus.com/PostCSS/using-postcss-for-minification-and-optimization.html?utm_source=tuicool&utm_medium=referral

6. webpack uglifyjs github：https://github.com/mishoo/UglifyJS2/
