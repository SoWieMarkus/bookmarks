# Add Tag

Create a new tag for the authenticated user.

```http
POST /api/tags/add
Authorization: <web-token>
```

## Authentication

Requires [User Authentication](../../authentication/web.md).

## Request Body

```js
{
  "title": "Tag Title"
}
```

## Response

- Status `201 Created`

```js
{
  "id": "tag_123",
  "title": "Tag Title",
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
