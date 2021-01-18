# CrowdedJS Examples
A threaded, browser-based crowd simulation engine.

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

