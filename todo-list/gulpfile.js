/* Designed for Single Page Apps */
// * For Modern Browsers Optimizations ONLY
const { src, dest, watch, series, parallel } = require('gulp');
const htmlmin = require('gulp-html-minifier'),
    sass = require('gulp-dart-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cleancss = require('clean-css'),
    babel = require('gulp-babel'),
    terser = require('gulp-terser'),
    imagemin = require('gulp-imagemin'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync').create();

// =======
// Process
// =======
// Image Optimization
// Copy & Rename Files
// Uglify (minify) CSS
// Copy HTML
// Minify HTML, CSS and JS files
// Concatenate & Uglify CSS / JS

// =====
// Paths
// =====

// ! WIP >>

const paths = {
    styles: {
        sassSRC: "./src/styles/scss/**/*.scss",
        sassDEST: "./src/",
        cssSRC: "./src/*.css",
        cssDEST: "./dist/"
    },
    scripts: {
        jsSRC: "./src/scripts/**/*.js",
        jsDEST: "./dist/",
        jsServiceWorker: "./sw.js"
    },
    images: {
        faviconSRC: "./src/favicon.ico",
        faviconDEST: "./dist/favicon.ico",
        bases: "./images/**/*"
    },
    fonts: {
        fontSRC: "./src/fonts/",
        fontDEST: "./dist/fonts"
    }
};

// ! WIP >>

// const scriptWatchFiles = [
//     'src/scripts/animations/*.js',
//     'src/scripts/modules/*.js'
// ];

// ! <<

// =====================
// PRE-DEVELOPMENT STAGE
// =====================
/*
- Copy files
- Optimize Files
*/

// Copy HTML file and minify to 'dist' folder
function copyAndMinifyHtml() {
    return src('./src/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(dest('./dist/'));
}

// Copy Minify PNG, JPEG, GIF and SVG with 'imagemin'
function copyAndMinifyImages() {
    // prefix suggestions: *.{png, jpg, jpeg, gif, svg}
    return src('./src/images/*')
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true, optimizationLevel: 3}),
            imagemin.mozjpeg({quality: 90, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: false}
                ]
            })
        ]))
        .pipe(dest('./dist/images/'));
}

// Copy favicon over to DIST repo
function copyFavicon() {
    return src('./src/favicon.ico')
        .pipe(dest('./dist/'));
}

// Copy fonts over to DIST repo
function copyFonts() {
    // prefix suggestions: *.{woff, woff2, ttf, eot, svg}
    return src('./src/fonts/**/*')
        .pipe(dest('./dist/fonts/'));
}

// Copy Service Worker script to DIST repo
function copyServiceWorker() {
    return src('./src/sw.js')
        .pipe(dest('./dist/'));
}

// Copy Manifest file to DIST repo
function copyManifest() {
    return src('./src/manifest.webmanifest')
        .pipe(dest('./dist/'));
}


// =================
// DEVELOPMENT STAGE
// =================

// Compile sass into css with post-css
function compileSassToCss() {
    // 1. Locate sass file.
    // 2. Initialise sourcemaps
    // 3. Pass the file through sass compiler.
    // 4. Pass the file through PostCSS plugins
    // Add Autoprefixer
    // 5. Choose a directory to save the compiled CSS.
    // 6. Stream changes to all browser.
    const plugins = [
        autoprefixer({ grid: true })
        // autoprefixer({ overrideBrowserslist: ['ie >= 11', '> 5%'], grid: true })
        // autoprefixer({ overrideBrowserslist: ['last 2 chrome version', 'last 2 firefox version', 'last 2 safari version', '> 5%'], grid: true })
    ];

    return src(paths.styles.sassSRC)
        .pipe(sourcemaps.init({
            // loadMaps: true,
            largeFile: true
        }))
        .pipe(sass({
            outputStyle: 'expanded',
            cascade: false
        }))
        .on('error', sass.logError)
        .pipe(postcss(plugins))
        .pipe(sourcemaps.write())
        .pipe(concat('style.css'))
        .pipe(dest(paths.styles.sassDEST))
        .pipe(browserSync.stream());
}

function transpileJs() {
    // transpile into pre-ES6
    // concat into one file 'main.js'
    return src(paths.scripts.jsSRC)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('script.js'))
        .pipe(sourcemaps.write())
        .pipe(dest('./src/'))
        .pipe(browserSync.stream());
}


// ===========
// WATCH FILES
// ===========

function watchDevFiles() {
    browserSync.init({
        server: {
            baseDir: './src/',
            index: 'index.html'
        }
    });

    // Run function when any sass file changes
    watch(paths.styles.sassSRC, compileSassToCss);
    // watch(scriptWatchFiles, transpileJs);
    watch(paths.scripts.jsSRC, transpileJs);
    watch('src/*.html').on('change', browserSync.reload);
}

// ================
// PRODUCTION STAGE
// ================

function concatCSS() {
    const plugins = [
        cleancss({compatibility: 'ie11'})
    ];

    return src(paths.styles.cssSRC)
        .pipe(postcss(plugins))
        .pipe(dest(paths.styles.cssDEST));
}

function minifyJS() {
    return src('./src/script.js')
        .pipe(terser())
        .pipe(dest(paths.scripts.jsDEST));
}

// =======
// EXPORTS
// =======

// PRE-DEVELOPMENT STAGE
exports.copyAndMinifyHtml = copyAndMinifyHtml;
exports.copyAndMinifyImages = copyAndMinifyImages;
exports.copyFavicon = copyFavicon;
exports.copyFonts = copyFonts;

exports.predev = parallel(copyAndMinifyHtml, copyAndMinifyImages, copyFavicon, copyFonts, copyServiceWorker, copyManifest);

// ! WIP

// DEVELOPMENT STAGE
exports.compileSassToCss = compileSassToCss;
exports.transpileJs = transpileJs;

// WATCH FILES
exports.watchDevFiles = watchDevFiles;
exports.dev = series(parallel(compileSassToCss, transpileJs), watchDevFiles);

// PRE-PRODUCTION STAGE
exports.preprod = parallel(copyAndMinifyHtml, compileSassToCss, transpileJs);

// PRODUCTION STAGE
exports.concatCSS = concatCSS;
exports.minifyJS = minifyJS;

exports.prod = parallel(concatCSS, minifyJS);