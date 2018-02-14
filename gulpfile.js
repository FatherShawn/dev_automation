const gulp = require('gulp');
const markdown = require('gulp-markdown');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const sassLint = require('gulp-sass-lint');

var paths = {
  scripts: [
    'js/**/*.js',
    '!js/**/*.min.js'
  ],
  sass: {
    main: 'style/scss/styles.scss',
    watch: 'style/scss/**/*'
  },
  css: {
    root: 'style/css'
  },
  clean: [
    'style/css/styles.css',
    'style/css/**/*.css.map',
    'js/**/*.min.js'
  ]
};

gulp.task('build', ['generate', 'sass', 'compress']);

gulp.task('generate', function () {
  'use strict';
  gulp.src('dev_automation.md')
    .pipe(markdown())
    .pipe(rename('slides.html'))
    .pipe(gulp.dest('./dist'))
});

gulp.task('clean', function () {
  'use strict';
  return del(paths.clean);
});

gulp.task('lint', function () {
  'use strict';
  return gulp.src(paths.sass.watch)
    .pipe(sassLint({
      files: {
        ignore: [
          'style/scss/normalize/**',
          'style/scss/base/_fonts.scss'
        ]
      },
      rules: {
        'no-ids': 0,
        'nesting-depth': [1, {'max-depth': 4}],
        'no-qualifying-elements': [1, {'allow-element-with-class': true}],
        'force-element-nesting': 0,
        'force-pseudo-nesting': 0,
        'property-sort-order': 0,
        'no-vendor-prefixes': 0,
        'mixins-before-declarations': [1, {exclude: ['media']}],
        'placeholder-in-extend': 0,
        'single-line-per-selector': 0,
        'no-misspelled-properties': [1, {'extra-properties': ['-webkit-overflow-scrolling']}],
        'class-name-format': 0
      }
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});

gulp.task('compress', function () {
  'use strict';
  return gulp.src(paths.scripts)
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('js/dist'));
});

gulp.task('sass', function () {
  'use strict';
  return gulp.src(paths.sass.main)
    .pipe(sassGlob())
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: [
        'node_modules/support-for/sass'
      ]
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'IE >= 11']
    }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(paths.css.root))
    .pipe(livereload());
});

gulp.task('sourcemaps', function () {
  'use strict';
  return gulp.src(paths.sass.main)
    .pipe(sassGlob())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.css.root));
});
