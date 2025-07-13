# Add Creator

Create a new creator.

```http
POST /api/creators
Authorization: <web-token>
```

## Authentication

Requires [User Authentication](../../authentication/web.md).

## Request Body

```js
{
  "name": "Creator Name",
  "image": "base64-encoded-image-string" // optional, can be null
}
```

## Response

- Status `201 Created`

```js
{
  "id": "creator_123",
  "name": "Creator Name",
  "image": "processed-image-data",
  "userId": "user_123",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

- Status `400 Bad Request`

```js
{
  "error": "Validation error message."
}
```
