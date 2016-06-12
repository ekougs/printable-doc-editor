'use strict';
(function () {
    let path = require('path');
    let fs = require('fs');
    let cpx = require('cpx');
    let del = require('del');

    let distDir = 'public';
    let appDirPaths = {
        'sample/index.html': '',
        'print-editor/src/**/*.js': 'print-editor/src',
        'sample/**/*.{js,css}': 'sample'
    };

    distApp();

    function distApp() {
        for(let path in appDirPaths) {
            if(appDirPaths.hasOwnProperty(path)) {
                cpx.copy(path, getDirInDist(path.join(distDir, appDirPaths[path])));
            }
        }
    }
}());