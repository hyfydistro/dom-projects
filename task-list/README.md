# Task List

A simple to-do list.

## Notes

### Creating the 'Clear Tasks' function

Objective: To remove a task by clicking on the 'x' icon.

Each of these task have a class of 'delete-item', and since there's multiple of them and they're dynamic, meaning we can add more, use event delegation here.

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

Type of website: Product site

Re-design Brad T's 'Task List', incorporating some principles of design and elements of design, and add some theme.

If possible, make it a PWA for mobile so it's usable for daily use... >> Use indexDB for personal todo list.

PERSONAL TODO LIST >> Create a simple todo list within the constraints it's nothing more than a todo list. Preferrably no calender should be added.


### Demographic

General Public, Students, Office Workers, etc.

### Targeted Devices

Mobil and Desktop displays. I will need to add for tablet display.

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

    * Other view dimensions or angles may suffer. :smiling_imp:

- [ ] Ally (Web Accessibility) - **A11y**
    - [ ] Screenreaders
    - [ ] Color accessible

- [ ] Old Browser Support - **OBS**
    - (specify which IE version LOL)

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
    -

### Older Browsers

...

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

### Inspirations

...


### Guides and Tutorials

- _Web Dev Simplified_ - [Advanced Button Hover Animations - CSS Only](https://youtu.be/cH0TC9gWiAg)
- [CSS Animated Input Field - how to style custom input field with CSS](https://youtu.be/3AK3vspZvvM)
- _Youtube_ - [Checkbox Animation Pure CSS3 Tutorial](https://youtu.be/OCOitlvl0DY)
- _Youtube_ - [How to make Custom Animated Checkboxes with CSS](https://youtu.be/ojWA8pdT-zY)
- _Web Dev Simplified_ - [Custom Checkbox Tutorial](https://youtu.be/YyLzwR-iXtI)

### Error Reference

...

### Polyfills

...