Late api-server
===============

This server is used in the Late project.

Installation
------------
type 'npm install' in the server root folder. All the node modules required for this project will automatically be installed.

Get started
-----------
Start the server by typing 'node main.js' in the server root folder. The server is listening on port 3000.

Documentation
-------------

/realtimedata?siteid=<SITEID>

returns realtime data for the station that corresponds to siteid

/delaydata

returns the delaytime for all the stations

/delaydata?siteid=<SITEID>

returns the delaytime for the specified station