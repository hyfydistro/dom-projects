# Task List

A Todo-List based on personal preference and research.

## Notes

### Creating the 'Clear Tasks' function

Objective:

* Edit State / Module
* Create / Add State / Module
* Clear All button
* Filter List [REJECTEd]
* "Completed" update UI on setTimeout (or refresh)

Optional:
- [ ] Add PWA

### Clear Task List Performance

It is much faster to remove a list using `removeChild` than let:
```
taskList.innerHTML = '';
```

## Initialising Repo

1. Git init,
2.1 Add remote url (Github, Bitbucket, etc.)
2.2 Initialise index.js file (or preferred other name) (optional)
3. Npm init (i.e. will add remote url, main will add "index.js" file (if no other name is given))


## Brief

Type of website: Product site, Desktop / Web Application

Create a Todo-List with an appealing UI.


### Demographic

General Public, Students, Office Workers, etc.

### Targeted Devices

Mobile, Tablet (lesser priority) and Desktop (main) devices.

## Sample

> Image source of website UI
abcdefghijklmnopqrstuvxyzabcdefghijk
abcdefghijklmnopqrstuvxyzabcdefgkl

abcdefghijklmnopqrstuvxyzabcdefg

## Technical Wesbsite Supports

- [ ] Responsive mobile / tablet / laptop - **R**
    Recommended:
        - 380w x 568h (min)
        - 768w x 1024h
        - 1440w x 900h (max)

    Use: Bootstrap 4 media query
```
// Extra small devices (portrait phones, less than 576px)
// No media query for `xs` since this is the default in Bootstrap

// Small devices (landscape phones, 576px and up)
@media (min-width: 576px) { ... }

// Medium devices (tablets, 768px and up)
@media (min-width: 768px) { ... }

// Large devices (desktops, 992px and up)
@media (min-width: 992px) { ... }

// Extra large devices (large desktops, 1200px and up)
@media (min-width: 1200px) { ... }
```
    * Other view dimensions or angles may suffer. :smiling_imp:

- [ ] Ally (Web Accessibility) - **A11y**
    - [ ] Screenreaders [REJECTED]
    - [ ] Color accessible

- [ ] Old Browser Support - **OBS** [pending]
(specify which IE version LOL)

- [ ] IE 8
- [ ] IE 9
- [ ] IE 10
- [ ] IE 11

TRY >> "HIDE" all modules

- [ ] Progressive Web Application **PWA** [pending]
      - [ ] Service Worker
      - [ ] Manifest file

- [ ] Graceful Degradation / *Progressive Enhancement* **PE** [pending]
    - CSS PE
    - JavaScript PE

- [ ] Available at GitHub Pages [pending]


## Browsers Compatibility

### Modern Browsers

* Tested on the following browsers:
    - [pending]

### Older Browsers

[pending]

## Development Installation(s)

* NodeJS
* NPM
* Gulp CLI

### NPM Packages

* gulp
* gulp-html-minifier
* gulp-dart-sass
* gulp-postcss
* gulp-babel@next @babel/core
* gulp-uglify
* gulp-terser
* gulp-imagemin (for more configuration options, see [npm package detail](https://www.npmjs.com/package/gulp-imagemin))
* gulp-sourcemaps
* gulp-concat
* gulp-rename (NOT INCLUDED; Optional)
* del (NOT INCLUDED; Optional)
* autoprefixer (as plugins for gulp-postcss)[WARNING: use version 9.0 for compatibility with gulp-postcss]
* clean-css (as plugins for gulp-postcss)
* browser-sync

```
npm install --save-dev gulp gulp-html-minifier gulp-dart-sass autoprefixer@9.0 clean-css gulp-postcss gulp-sourcemaps gulp-uglify gulp-terser gulp-imagemin gulp-concat browser-sync
```

* gulp-babel
* gulp-babel@next
* @babel/core
* @babel/preset-env (enables transforms for ES2015+)

```
npm install --save-dev gulp-babel gulp-babel@next @babel/core @babel/preset-env
```

Q. What version of babel you want to transpile to?


## Credits

- [Bootstrap CDN](https://www.bootstrapcdn.com/fontawesome/)
- [An ultimate guide to selecting the perfect artboard size for mobile](https://uxdesign.cc/perfect-artboard-size-c267939c5843)
- _FontAwesome 4.7_ - [The Icons](https://fontawesome.com/v4.7.0/icons/)
- _FontAwesome_ - [Icons](https://fontawesome.com/icons?d=gallery&q=calen&m=free)

### Inspirations

n/a

### Guides and Tutorials

- _Web Dev Simplified_ - [Advanced Button Hover Animations - CSS Only](https://youtu.be/cH0TC9gWiAg)
- [CSS Animated Input Field - how to style custom input field with CSS](https://youtu.be/3AK3vspZvvM)
- _Youtube_ - [Checkbox Animation Pure CSS3 Tutorial](https://youtu.be/OCOitlvl0DY)
- _Youtube_ - [How to make Custom Animated Checkboxes with CSS](https://youtu.be/ojWA8pdT-zY)
- _Web Dev Simplified_ - [Custom Checkbox Tutorial](https://youtu.be/YyLzwR-iXtI)
- [How TO - Toggle Switch](https://www.w3schools.com/howto/howto_css_switch.asp)
- [How to create a Simple Dropdown menu using html css](https://youtu.be/Kctqguvf2FM)
- [horizontal-centering-of-an-absolute-element](https://css-tricks.com/forums/topic/horizontal-centering-of-an-absolute-element/)

### Error Reference

n/a

### Polyfills

n/a