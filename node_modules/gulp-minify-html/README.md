[![Build Status](https://travis-ci.org/murphydanger/gulp-minify-html.png?branch=master)](https://travis-ci.org/murphydanger/gulp-minify-html)

# Deprecation warning
This package has been deprecated in favor of [`gulp-htmlmin`](https://github.com/jonschlinkert/gulp-htmlmin), which should be faster and more comprehensive.

## Regarding Issues

_Remember, this plugin is only a thin wrapper around [`minimize`](https://github.com/Moveo/minimize)._

If  you are having **HTML related issues**, please consider looking into [`minimize/issues`](https://github.com/Moveo/minimize/issues) before raising your issue here.

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```
npm install --save-dev gulp-minify-css
```

## API

```js
var minifyHTML = require('gulp-minify-html');
```

#### minifyHTML([_options_])

*options*: `Object` (optional)  
Return: `Object` ([stream.Transform](https://nodejs.org/docs/latest/api/stream.html#stream_class_stream_transform))

Options are directly passed to the `minimize` constructor, which means all [`minimize` options](https://github.com/Swaagie/minimize#options) are available.

```javascript
var gulp = require('gulp');
var minifyHTML = require('gulp-minify-html');

gulp.task('minify-html', function() {
  return gulp.src('src/*.html')
    .pipe(minifyHTML({ empty: true }))
    .pipe(gulp.dest('dist'));
});
```

## LICENSE

[MIT](./LICENSE) © [Murphy Danger](https://github.com/murphydanger)