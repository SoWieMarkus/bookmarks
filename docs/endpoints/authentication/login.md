# Login

Authenticate a user with username and password.

```http
POST /api/authentication/login
```

## Request Body

```js
{
  "username": "john_doe",
  "password": "securePassword123"
}
```

## Response

- Status `200 OK`

```js
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

- Status `400 Bad Request`

```js
{
  "error": "Validation error message."
}
```
