# Remove Tag

Delete a tag by ID.

```http
DELETE /api/tags/remove/:tagId
Authorization: <web-token>
```

## Authentication

Requires [User Authentication](../../authentication/web.md).

## Parameters

- `tagId` (string) - The ID of the tag to delete

## Response

- Status `200 OK`

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

- Status `404 Not Found`

```js
{
  "error": "Tag not found."
}
```
