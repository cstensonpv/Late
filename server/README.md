# Late api-server

This server is used in the Late project.

## Installation

type 'npm install' in the server root folder. All the node modules required for this project will automatically be installed.

## Get started
Start the server by typing 'node main.js' in the server root folder. The server is listening on port 3000.

## Documentation

### Real-time data

```
/realtimedata?siteid=<SITEID>
```
returns realtime data for the station that corresponds to siteid

#### Example

```
/realtimedata?siteid=9000
```
returns...

```javascript
[
	{
		"JourneyDirection": 1,
		"SecondaryDestinationName": "\u00c4lvsj\u00f6",
		"StopAreaName": "Stockholms central",
		"StopAreaNumber": 5011,
		"StopPointNumber": 5013,
		"StopPointDesignation": "S",
		"TimeTabledDateTime": "2016-02-24T14:19:00",
		"ExpectedDateTime": "2016-02-24T14:19:00",
		"DisplayTime": "Nu",
		"Deviations": null,
		"TransportMode": "TRAIN",
		"LineNumber": "35",
		"Destination": "V\u00e4sterhaninge",
		"SiteId": 9000
	}
]
```

### Delay data

```
/delaydata
```
returns the delaytime for all the stations

#### Example

```javscript
[
	{
		"siteid": 9000,
		"delayNorth": 131000,
		"delaySouth": 0
	},
	{
		"siteid": 9510,
		"delayNorth": 135000,
		"delaySouth": 0
	}
]
```

___

```
/delaydata?siteid=<SITEID>
```
returns the delaytime for the specified station

#### Example
```
/delaydata?siteid=9000
```

returns...
```javascript
{
	"siteid": 9000,
	"delayNorth": 131000,
	"delaySouth": 0
}
```

