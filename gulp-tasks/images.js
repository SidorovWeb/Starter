'use strict'

import { paths } from '../gulpfile.babel'
import gulp from 'gulp'
import gulpif from 'gulp-if'
import imagemin from 'gulp-imagemin'
import imageminPngquant from 'imagemin-pngquant'
import imageminZopfli from 'imagemin-zopfli'
import imageminMozjpeg from 'imagemin-mozjpeg'
import imageminGiflossy from 'imagemin-giflossy'
import rename from 'gulp-rename'
import browsersync from 'browser-sync'
import yargs from 'yargs'

const argv = yargs.argv,
  production = !!argv.production

gulp.task('images', () => {
  return gulp
    .src(paths.images.src)
    .pipe(
      gulpif(
        production,
        imagemin([
          imageminGiflossy({
            optimizationLevel: 3,
            optimize: 3,
            lossy: 2,
          }),
          imageminPngquant({
            speed: 5,
            quality: [0.6, 0.8],
          }),
          imageminZopfli({
            more: true,
          }),
          imageminMozjpeg({
            progressive: true,
            quality: 90,
          }),
        ])
      )
    )
    .pipe(
      rename(function (path) {
        path.extname = path.extname.replace('jpeg', 'jpg')
      })
    )
    .pipe(gulp.dest(paths.images.dist))
    .on('end', browsersync.reload)
})
