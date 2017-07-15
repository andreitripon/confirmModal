var fs = require('fs');
var packageFile = JSON.parse(fs.readFileSync('./package.json'));

var gulp        = require('gulp'),
    concatJS    = require('gulp-concat'),
    uglify      = require('gulp-uglify');

// define the default task and add the watch task to it
gulp.task('default', ['watch']);

gulp.task('scripts', function() {
    return gulp.src(packageFile.listFiles.js)
        .pipe(concatJS('confirm-modal.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(packageFile.minDest.js));
});

gulp.task('watch', function() {
    gulp.watch('src/js/**/*.js', ['scripts']);
});
