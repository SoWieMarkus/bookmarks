# Delete Account

Permanently delete the current user's account.

```http
POST /api/authentication/remove
Authorization: <web-token>
```

## Authentication

Requires [User Authentication](../../authentication/web.md).

## Request Body

```js
{
  "password": "securePassword123"
}
```

## Response

- Status `204 No Content`

- Status `400 Bad Request`

```js
{
  "error": "Validation error message."
}
```
