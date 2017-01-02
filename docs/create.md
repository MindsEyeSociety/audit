# Create Endpoint
This endpoint is designed to accept incoming audit requests. It's designed to validate the request and return **before** SQL writes, so not all transactions are guaranteed. All writes are only accepted on the internal port as well, as this is not designed to be open to the public facing network.

## `POST /v1/events`
Saves an audit event.

__Body__
* `userId` - Required. User ID of initiating member.
* `officeId` - Optional. ID of initiating office.
* `service` - Required. Name of service with major version, such as `user-hub-v1`.
* `message` - Required. Human-readable message for log.
* `metadata` - Optional. JSON object for internal reference.
* `delta` - Optional. Text of changes made.
* `occurredAt` - Required. Date and time of change. Should be microtimestamp or standard time format.
* `references` - Optional. Array of objects for other reference objects. _Note:_ Objects without all of below will be silently dropped.
	* `service` - Service name, such as `user-hub`. No version should be specified.
	* `object` - Name of object, such as `user`. Generally should be the table name, if applicable.
	* `objectId` - Numeric ID of object in table.

__Responses__

* __Code__: 200<br>
  __Content__: `{ "success": true }`

* Incorrect port.<br>
  __Code__: 403<br>
  __Content__: `{ "status": 403, "message": "Request over insecure port" }`

* No body found.<br>
  __Code__: 400<br>
  __Content__: `{ "status": 400, "message": "No body provided" }`

* Missing required param.<br>
  __Code__: 400<br>
  __Content__: `{ "status": 400, "message": "Missing [field]" }`
