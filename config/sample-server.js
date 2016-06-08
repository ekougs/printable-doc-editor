"use strict";

var browserSync = require("browser-sync");

browserSync.init({
                     port: 8005,
                     startPath: "sample/index.html",
                     ui: {
                         port: 8006
                     },
                     files: [
                         "{sample,print-editor}/**/*{!.e2e}.html",
                         "{sample,print-editor}/**/*{js,js.map,css}"
                     ],
                     server: {
                     },
                     watchOptions: {
                         "ignoreInitial": true
                     }
                 });