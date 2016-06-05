(function () {
    var fs = require('fs');
    var cpx = require('cpx');
    var del = require('del');

    distVendor();
    distApp();

    function distApp() {
        cpx.copy('*.{html,css,js,json}', 'dist');
        cpx.copy('src/*.{html,css,js,json}', 'dist/src');
        cpx.copy('src/app/**/*.{html,css,js,js.map,json}', 'dist/src/app', null, delTests);
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