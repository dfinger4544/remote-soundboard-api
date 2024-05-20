# remote-soundboard-api

## Setup

1. Clone repository
2. Run npm install
3. Run npx tsc
4. node app.js

### .env

Please include an .env file in the root folder.

- PORT should be the port desired for the API (Default 3000)
- JWT_SECRET should be a complex string. This is used to encrypt the bearer tokens (Default: "secret")

```env
PORT=[Port Number]
JWTSECRET=[Complex String]
```

### Login

Default user is root:root. Change this as soon as possible.

## API Documentation

### Error Responses

Error responses will be returned when there are problems with the request along with its related HTTP status code.

Example Response (Error list is optional)

```JSON
{
    "message": "[Summarized Error Message]",
    "errors": [
        {
            "type": "[Type of error]",
            "value": "[Value provided by you]",
            "msg": "[Specific error message]",
            "path": "[Path of error]",
            "location": "[Location of error (params/body)]"
        },
        ...
    ]
}
```

### Auth

Paths with an( \*) are locked behind authentication

#### POST /auth/login

Response provides a JWT bearer token to be included in the header of future requests

Example Request

```JSON
{
    "username": "[Username]",
    "password": "[Password]"
}
```

Example Response

```JSON
{
    "message": "Logged in successfully",
    "token": "JWT Token",
    "userId": "[User ID]"
}
```

#### POST /auth/user (\*)

Creates a user

Example Request

```JSON
{
    "username": "[Username]",
    "password": "[Password]",
    "passwordConfirm": "[Password]"
}
```

Example Response

```JSON
{
    "message": "User created",
    "userId": "[User ID]"
}
```

#### POST /auth/user/updatePassword (\*)

Updates the password for a user.

Example Request

```JSON
{
    "currentPassword": "[User's Password]",
    "newPassword": "[New Password]",
    "newPasswordConfirm": "[New Password]"
}
```

Example Response

```JSON
{
    "message": "User updated",
    "userId": "[User ID]"
}
```

### Sounds

Paths with an (\*) are locked behind authentication

#### GET /sounds (\*)

Returns all sounds information

Example Response

```JSON
{
    "message": "sounds retrieved successfully",
    "sounds": [
        {
            "id": [Sound ID],
            "name":" [Sound Name]",
            "imagePath": "[Path to sound file's image]",
            "soundPath": "[Path to sound file's audio]",
            "createdAt": "[DateTime]",
            "updatedAt": "[DateTime]"
        },
        ...
    ]
}

```

#### GET /sounds/{soundId} (\*)

Returns a single sound's information

Example Response

```JSON
{
    "message": "sounds retrieved successfully",
    "sound": {
        "id": [Sound ID],
        "name": "[Sound Name]",
        "imagePath": "[Path to sound file's image]",
        "soundPath": "[Path to sound file's audio]",
        "createdAt": "[DateTime]",
        "updatedAt": "[DateTime]"
    }
}

```

#### GET /sounds/random/play (\*)

Plays a random sound

Example Response

```JSON
{
    "message": "Sound played successfully",
    "soundId": [Sound ID]
}
```

#### GET /sounds/{soundId}/play (\*)

Plays the sound of the corresponding soundId

Example Response

```JSON
{
    "message": "Sound played successfully",
    "soundId": [Sound ID]
}
```

#### POST /sounds (\*)

Creates a new sound

Example Request

```JSON
{
    "name": "[Sound Name]",
    "image": "[Image File]",
    "audio": "[Audio File]"
}
```

Example Response

```JSON
{
    "message": "Sound uploaded successfully",
    "sound": {
        "id": [Sound ID],
        "name": "[Sound Name]",
        "imagePath": "[Path to sound file's image]",
        "soundPath": "[Path to sound file's audio]",
        "createdAt": "[DateTime]",
        "updatedAt": "[DateTime]"
    }
}
```

#### PUT /sounds/{soundId} (\*)

Updates an existing sound

Example Request (only one field must exist)

```JSON
{
    "name": "[Sound Name]",
    "image": "[Image File]",
    "audio": "[Audio File]"
}
```

Example Response

```JSON
{
    "message": "Sound uploaded successfully",
    "sound": {
        "id": [Sound ID],
        "name": "[Sound Name]",
        "imagePath": "[Path to sound file's image]",
        "soundPath": "[Path to sound file's audio]",
        "createdAt": "[DateTime]",
        "updatedAt": "[DateTime]"
    }
}
```

#### DELETE /sounds/{soundId} (\*)

Deletes the sound with the corresponding soundId

Example Response

```JSON
{
    "message": "Sound deleted successfully",
    "soundId": [Sound ID]
}
```

## Next Steps

Fix the following:

1. Custom Error class to include statusCode and error list (remove any type from errors)
2. Custom request to include userId (remove any time from requests)
3. Figure out static methods for typescript/sequelize and convert SoundCtrl and gpioCtrl play random to static method
