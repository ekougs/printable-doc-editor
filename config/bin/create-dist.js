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
        for(let appDirPath in appDirPaths) {
            if(appDirPaths.hasOwnProperty(appDirPath)) {
                cpx.copy(appDirPath, path.join(distDir, appDirPaths[appDirPath]));
            }
        }
    }
}());