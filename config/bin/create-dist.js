'use strict';
(function () {
    let path = require('path');
    let fs = require('fs');
    let cpx = require('cpx');
    let del = require('del');
    let assetsLibs = ['bootstrap-sass', 'font-awesome'];
    let distDir = 'public';

    let getDirInDist = (dir) => {
        dir = dir || '';
        return path.join(distDir, dir);
    };

    distAssets();
    distApp();

    function distApp() {
        cpx.copy('sample/index.html', getDirInDist());
        cpx.copy('print-editor/src/**/*.js', getDirInDist('print-editor/src'), null);
        cpx.copy('sample/**/*.{js,css}', getDirInDist('sample'));
    }

    function distAssets() {
        assetsLibs.forEach((assetLib) => {
            cpx.copy('node_modules/' + assetLib + '/**/**.{eot,svg,ttf,woff,woff2}',
                     getDirInDist('node_modules/') + assetLib, logErr);

        });
    }

    function logErr(err) {
        if (err !== null) {
            console.error(err);
        }
    }
}());