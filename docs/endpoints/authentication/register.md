# Register

Create a new user account.

```http
POST /api/authentication/register
```

## Request Body

```js
{
  "username": "john_doe",
  "password": "securePassword123"
}
```

## Response

- Status `201 Created`

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

- Status `409 Bad Request`

```js
{
  "error": "Username already exists."
}
```
