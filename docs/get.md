# Get Endpoints
These endpoints are to access audit logs. They require a National-level office with the `audit` permission, or `audit_{service}` for specific systems.

## `GET /v1/events`
Provides a list of events, with optional filtering.

__Params__
* `token` - Required. Parameter or cookie of user token.
* `user` - ID of user to look up.
* `office` - ID of office to look up.
* `service` - Service to search.
* `dateStart` - Starting date.
* `dateEnd` - Ending date.
* `message` - Search message text.
* `limit` - Integer. Number of results to return, defaults to 100.
* `offset` - Integer. Offset for results, defaults to 0.

__Responses__

* __Code__: 200<br>
__Content__: Array of event objects.
```json
[
	{
		"id": 1,
		"userId": 1,
		"officeId": null,
		"service": "user-hub-v1",
		"message": "Sample message",
		"metadata": {},
		"delta": "",
		"createdAt": "2016-12-19 12:00:00.000",
		"occurredAt": "2016-12-19 12:00:00.000"
	}
]
```


## `GET /v1/events/{id}`
Provides details of event, with references.

__Params__
* `{id}` - Required. Numeric ID of a given event.
* `token` - Required. Parameter or cookie of user token.

__Responses__

* __Code__: 200<br>
__Content__: Event object with references.
```json
{
	"id": 1,
	"userId": 1,
	"officeId": null,
	"service": "user-hub-v1",
	"message": "Sample message",
	"metadata": {},
	"delta": "",
	"createdAt": "2016-12-19 12:00:00.000",
	"occurredAt": "2016-12-19 12:00:00.000",
	"references": [
		{
			"id": 1,
			"eventId": 1,
			"service": "user-hub",
			"object": "user",
			"objectId": 1
		}
	]
}
```

## `GET /v1/references`
Provides a list of references for a given object.

__Params__
* `token` - Required. Parameter or cookie of user token.
* `service` - Required. Service name to search.
* `object` - Required. Name of object to filter by.
* `objectId` - Required. ID of object to filter by.
* `limit` - Integer. Number of results to return, defaults to 100.
* `offset` - Integer. Offset for results, defaults to 0.

__Responses__

* __Code__: 200<br>
__Content__: Array of event objects.
```json
[
	{
		"id": 1,
		"eventId": 1,
		"service": "user-hub",
		"object": "user",
		"objectId": 1,
		"event": {
			"userId": 1,
			"officeId": null,
			"message": "Sample message",
			"createdAt": "2016-12-19 12:00:00.000",
			"occurredAt": "2016-12-19 12:00:00.000"
		}
	}
]
```


## `GET /v1/references/{id}`
Provides details of reference, with event.

__Params__
* `{id}` - Required. Numeric ID of a given reference.
* `token` - Required. Parameter or cookie of user token.

__Responses__

* __Code__: 200<br>
__Content__: Reference object with event.
```json
{
	"id": 1,
	"eventId": 1,
	"service": "user-hub",
	"object": "user",
	"objectId": 1,
	"event": {
		"id": 1,
		"userId": 1,
		"officeId": null,
		"service": "user-hub-v1",
		"message": "Sample message",
		"metadata": {},
		"delta": "",
		"createdAt": "2016-12-19 12:00:00.000",
		"occurredAt": "2016-12-19 12:00:00.000"
	}
}
```
