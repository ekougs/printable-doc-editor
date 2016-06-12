'use strict';
(function () {
    let fs = require('fs');
    let cpx = require('cpx');
    let del = require('del');
    let assetsLibs = ['bootstrap-sass', 'font-awesome'];

    distAssets();
    distApp();

    function distApp() {
        cpx.copy('sample/index.html', 'dist');
        cpx.copy('print-editor/**/*.js', 'dist/print-editor', null, delTests);
        cpx.copy('sample/**/*.{js,css}', 'dist/sample');
    }

    function delTests() {
        del('dist/src/**/*.{e2e,test}.*');
    }

    function distAssets() {
        assetsLibs.forEach((assetLib) => {
            cpx.copy('node_modules/' + assetLib + '/**/**.{eot,svg,ttf,woff,woff2}',
                     'dist/node_modules/' + assetLib, logErr);

        });
    }

    function logErr(err) {
        if (err !== null) {
            console.error(err);
        }
    }
}());