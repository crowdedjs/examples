# CrowdedJS Examples
A threaded, browser-based crowd simulation engine.

## Contents

The repo provides a concrete implementation of the various libraries in the CrowdedJS repo.

The main files in this project are index.html and index.js

The open source support files are found in /lib and and governed by their respective licenses.

The support files include:

- bundle.js, RecastDetour bundled as a web worker. See https://github.com/crowdedjs/worker

- color-function.js, a function that maps agent names to colors

- dynamic.js, a list of simulations to choose from when using index.multiple.html

- replacer.js, a helper function to remove circular references. Use this as the second argument to a JSON.stringify call.

- simulations.js, available simulations.

- urlParser.js, a helper function that lets the user set the simulation parameters in the URL.

- viewer.js, a series of functions that show the current state of the simulation using three.js

## Use

Include the support libraries

```
<script src="./lib/axios.js"></script>  
<script src="./lib/bundle.js"></script> 
<script src="./bundle.js"></script>     
```

Include the fps counter (optional)

```
javascript: (function () { var script = document.createElement('script'); script.onload = function () { var stats = new Stats(); document.body.appendChild(stats.dom); requestAnimationFrame(function loop() { stats.update(); requestAnimationFrame(loop) }); }; script.src = '//mrdoob.github.io/stats.js/build/stats.min.js'; document.head.appendChild(script); })()
```

## Run a development server

This project uses snowpack as its bundler. To run the dev server, use the start command, ```npm start```. 

## Linking Peer Dependencies
There will be times when you want to edit multiple repos simultanesouly. To do this, clone all the required repos. Then use ```npm link``` to create the desired links. With links, any changes you make to the link repo locally will be reflected in your app.


