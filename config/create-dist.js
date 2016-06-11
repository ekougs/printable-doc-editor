(function () {
    var fs = require('fs');
    var cpx = require('cpx');
    var del = require('del');

    distVendor();
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
        fs.readFile('package.json', 'utf8', function (err, data) {
            if (err) {
                throw err;
            }
            var dependencies = JSON.parse(data).dependencies;
            for (var dependency in dependencies) {
                if (!dependencies.hasOwnProperty(dependency)) {
                    continue;
                }
                cpx.copy('node_modules/' + dependency + '/**/**.{js,json,eot,svg,ttf,woff,woff2}',
                         'dist/node_modules/' + dependency, logErr);
            }
        });
    }

    function logErr(err) {
        if (err !== null) {
            console.error(err);
        }
    }
}());