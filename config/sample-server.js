"use strict";

var browserSync = require("browser-sync");

browserSync.init({
                     port: 8005,
                     startPath: "sample/index.html",
                     ui: {
                         port: 8006
                     },
                     files: [
                         "{sample,src}/**/*{!.e2e}.html",
                         "{sample,src}/**/*{js,js.map,css}"
                     ],
                     server: {
                     },
                     watchOptions: {
                         "ignoreInitial": true
                     }
                 });