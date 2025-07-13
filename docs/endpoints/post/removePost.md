# Remove Post

Delete a post by ID.

```http
DELETE /api/posts/remove/:postId
Authorization: <web-token>
```

## Authentication

Requires [User Authentication](../../authentication/web.md).

## Parameters

- `postId` (string) - The ID of the post to delete

## Response

- Status `200 OK`

```js
{
  "id": "post_123",
  "url": "https://example.com",
  "title": "Post Title",
  "description": "Post description",
  "readLater": false,
  "userId": "user_123",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "tags": [],
  "creators": []
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
  "error": "Post not found."
}
```
