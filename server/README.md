# Late api-server

This server is used in the Late project.

## Installation

type 'npm install' in the server root folder. All the node modules required for this project will automatically be installed.

## Get started
Start the server by typing 'node main.js' in the server root folder. The server is listening on port 3000.

## Documentation

### Real-time data

```
/realtimedata/<SITEID>
```
returns realtime data for the station that corresponds to siteid

#### Example

```
/realtimedata/9000
```
could return...

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

### Next departure

```
/realtime/next/<SITEID>
```

returns the next train going south and north

#### Example

```
/realtime/next/9000
```
could return...

```javascript
{
  "south": {
    "JourneyDirection": 1,
    "SecondaryDestinationName": "\u00c4lvsj\u00f6",
    "StopAreaName": "Stockholms central",
    "StopAreaNumber": 5011,
    "StopPointNumber": 5013,
    "StopPointDesignation": "S",
    "TimeTabledDateTime": "2016-03-07T00:34:00",
    "ExpectedDateTime": "2016-03-07T00:34:00",
    "DisplayTime": "8 min",
    "Deviations": null,
    "TransportMode": "TRAIN",
    "LineNumber": "35",
    "Destination": "V\u00e4sterhaninge",
    "SiteId": 9000
  },
  "north": {
    "JourneyDirection": 2,
    "SecondaryDestinationName": null,
    "StopAreaName": "Stockholms central",
    "StopAreaNumber": 5011,
    "StopPointNumber": 5014,
    "StopPointDesignation": "N",
    "TimeTabledDateTime": "2016-03-07T00:28:00",
    "ExpectedDateTime": "2016-03-07T00:28:00",
    "DisplayTime": "2 min",
    "Deviations": null,
    "TransportMode": "TRAIN",
    "LineNumber": "35",
    "Destination": "B\u00e5lsta",
    "SiteId": 9000
  }
}
```

### Next departures from time

```
/datafromtime/<MINUTES>
```
returns an object with all the stations and their upcoming departures.

#### Example

```
/datafromtime/1000
```

returns...

```javascript
{
  "id_9000": {
    "time": 1000,
    "south": {
      "JourneyDirection": 1,
      "SecondaryDestinationName": "\u00c4lvsj\u00f6",
      "StopAreaName": "Stockholms central",
      "StopAreaNumber": 5011,
      "StopPointNumber": 5013,
      "StopPointDesignation": "S",
      "TimeTabledDateTime": "2016-03-08T16:42:00",
      "ExpectedDateTime": "2016-03-08T16:42:00",
      "DisplayTime": "1 min",
      "Deviations": [
        {
          "Text": "Stannar ej i Tr\u00e5ngsund, Skog\u00e5s, Jordbro.",
          "Consequence": "INFORMATION",
          "ImportanceLevel": 5
        }
      ],
      "TransportMode": "TRAIN",
      "LineNumber": "35",
      "Destination": "Nyn\u00e4shamn",
      "SiteId": 9000
    },
    "north": {
      ...
    }
  },
  "id_9510": {
    "time": 1000,
    "south": {
      ...
    },
    "north": {
      ...
    }
  },
	...
}
```

### Timetable from 00:00 to...

```
/timetable/until/<SITEID>/<MINUTES>
```
returns all the trains that departs from the station during the time 00:00 to <MINUTES>

#### Example

```
/timetable/until/9000/1000
```

returns...

```javascript
{
  "south": [
    {
      "JourneyDirection": 1,
      "SecondaryDestinationName": "\u00c4lvsj\u00f6",
      "StopAreaName": "Stockholms central",
      "StopAreaNumber": 5011,
      "StopPointNumber": 5013,
      "StopPointDesignation": "S",
      "TimeTabledDateTime": "2016-03-08T00:04:00",
      "ExpectedDateTime": "2016-03-08T00:04:00",
      "DisplayTime": "Nu",
      "Deviations": null,
      "TransportMode": "TRAIN",
      "LineNumber": "35",
      "Destination": "Nyn\u00e4shamn",
      "SiteId": 9000,
      "id": 0
    },
		...
	],
  "north": [
    {
      "JourneyDirection": 2,
      "SecondaryDestinationName": "Arlanda C",
      "StopAreaName": "Stockholms central",
      "StopAreaNumber": 5011,
      "StopPointNumber": 5014,
      "StopPointDesignation": "N",
      "TimeTabledDateTime": "2016-03-08T00:09:00",
      "ExpectedDateTime": "2016-03-08T00:09:00",
      "DisplayTime": "Nu",
      "Deviations": [
        {
          "Text": "Resa f\u00f6rbi Arlanda C kr\u00e4ver b\u00e5de UL- och SL- biljett.",
          "Consequence": "INFORMATION",
          "ImportanceLevel": 5
        }
      ],
      "TransportMode": "TRAIN",
      "LineNumber": "38",
      "Destination": "Uppsala C",
      "SiteId": 9000,
      "id": 0
    },
		...
	]
}

```

### Timetable between time

```
/timetable/between/<SITEID>/<STARTMINUTES>/<STOPMINUTES>
```
returns all the trains between <STARTMINUTES> and <STOPMINUTES>

#### Example
```
/timetable/until/9000/500/600
```

returns...
```javascript
{
  "south": [
    {
      "JourneyDirection": 1,
      "SecondaryDestinationName": "\u00c4lvsj\u00f6",
      "StopAreaName": "Stockholms central",
      "StopAreaNumber": 5011,
      "StopPointNumber": 5013,
      "StopPointDesignation": "S",
      "TimeTabledDateTime": "2016-03-08T08:23:00",
      "ExpectedDateTime": "2016-03-08T08:28:00",
      "DisplayTime": "Nu",
      "Deviations": [
        {
          "Text": "T\u00e5gk\u00f6",
          "Consequence": "INFORMATION",
          "ImportanceLevel": 5
        }
      ],
      "TransportMode": "TRAIN",
      "LineNumber": "38",
      "Destination": "Tumba",
      "SiteId": 9000,
      "id": 42
    },

		...

		{
      "JourneyDirection": 1,
      "SecondaryDestinationName": "\u00c4lvsj\u00f6",
      "StopAreaName": "Stockholms central",
      "StopAreaNumber": 5011,
      "StopPointNumber": 5013,
      "StopPointDesignation": "S",
      "TimeTabledDateTime": "2016-03-08T09:49:00",
      "ExpectedDateTime": "2016-03-08T09:49:00",
      "DisplayTime": "Nu",
      "Deviations": null,
      "TransportMode": "TRAIN",
      "LineNumber": "35",
      "Destination": "V\u00e4sterhaninge",
      "SiteId": 9000,
      "id": 58
    }
  ],
  "north": [
    {
			...
		},
		...
		{
			...
		}
	]
}
```

### Delays
```
/delayperhour/<SITEID>
```
