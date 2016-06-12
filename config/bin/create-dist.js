'use strict';
(function () {
    let fs = require('fs');
    let cpx = require('cpx');
    let del = require('del');
    let assetsLibs = ['bootstrap-sass', 'font-awesome'];

    distVendor();
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

    function distVendor() {
        fs.readFile('package.json', 'utf8', (err, data) => {
            if (err) {
                throw err;
            }
            let dependencies = JSON.parse(data).dependencies;
            for (let dependency in dependencies) {
                if (dependencies.hasOwnProperty(dependency)) {
                    cpx.copy('node_modules/' + dependency + '/**/**.{js,json,eot,svg,ttf,woff,woff2}',
                             'dist/node_modules/' + dependency, logErr);
                }
            }
        });
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