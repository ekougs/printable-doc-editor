"use strict";

var browserSync = require("browser-sync");

browserSync.init({
                     port: 8005,
                     ui: {
                         port: 8006
                     },
                     server: {
                         baseDir: "public"
                     },
                     watchOptions: {
                         "ignoreInitial": true
                     }
                 });