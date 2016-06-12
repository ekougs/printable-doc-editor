"use strict";

var browserSync = require("browser-sync");

browserSync.init({
    "ui": false,
    "files": [
        "src/app/**/*.e2e.html",
        "src/app/**/*{js, js.map, css}"
    ],
    "server": {},
    "open": false,
    "watchOptions": {
        "ignored": "*"
    },
    "logFileChanges": false
});