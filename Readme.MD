# Developer Browser History Plugin 


[![Build Status](https://travis-ci.org/PlainConcepts/DBHPlugin.png)](https://travis-ci.org/PlainConcepts/DBHPlugin)
[![Coverage Status](https://coveralls.io/repos/PlainConcepts/DBHPlugin/badge.png)](https://coveralls.io/r/PlainConcepts/DBHPlugin)

Developer Browser History Plugin (DBHPlugin) is plugin/extension for chrome and firefox which allows the user to consult the history of his visits to developer web pages.


## Installation from this repo


Clone this repo and install the dependencies:

* [Python 2.5, 2.6 or 2.7](http://python.org/download/) *
* [nodejs](http://nodejs.org/)
* [bower](http://bower.io/)  -- `npm install -g bower`
* [grunt-cli](http://gruntjs.com/getting-started) -- `npm install -g grunt-cli`
* Install node dependencies -- `npm install`
* Install project dependencies -- `bower install`


\* Make sure that Python is in your path. 
For Windows users, MozillaBuild (https://wiki.mozilla.org/MozillaBuild) will install the correct version of Python and the MSYS package, which will make it easier to work with the SDK. 


## Scripts

### build & dist

`grunt build-app`: 
Builds the project

`grunt dist-firefox`: 
Builds the project and prepare the package for firefox (xpi)

`grunt dist-chrome-zip`: 
Builds the project and prepare the package for chrome (zip)

`grunt dist-chrome-crx`: 
Builds the project and prepare the package for chrome (crx)


### dev

`grunt dev-chrome`: 
dev environment for chrome: jshint, run tests, sync source to dist/chrome folder


### test

`grunt test-server`: 
Keeps listening for file updates to run tests

`grunt test-chrome`: 
Keeps listening for file updates to run tests in chrome for debugging

`grunt test-ci`: 
Launches the tests and coveralls for the ci build


## Installation of plugins

Download it from [github releases](https://github.com/PlainConcepts/DBHPlugin/releases) 

### Chrome
TODO 

### Firefox
TODO










