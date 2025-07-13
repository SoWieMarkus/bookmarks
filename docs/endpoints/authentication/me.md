# Get Current User

Get information about the currently authenticated user.

```http
GET /api/authentication/me
Authorization: <web-token>
```

## Authentication

Requires [User Authentication](../../authentication/web.md).

## Response

- Status `200 OK`

```js
{
  "id": "user_123",
  "username": "john_doe",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

- Status `404`

```js
{
  "error": "User not found."
}
```
