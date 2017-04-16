@echo off
echo Running Babel:
cmd /c "babel src --presets es2015 --out-dir lib --source-maps"
echo Running Browserify
cmd /c "browserify -g uglifyify lib/script.js -o bundle.js -t [ babelify --presets [ es2015 ] ]"