# Toggle Read Later

Toggle the read later status of a post.

```http
POST /api/posts/queue/:postId
Authorization: <web-token>
```

## Authentication

Requires [User Authentication](../../authentication/web.md).

## Parameters

- `postId` (string) - The ID of the post to toggle

## Response

- Status `200 OK`

```js
{
  "id": "post_123",
  "url": "https://example.com",
  "title": "Post Title",
  "description": "Post description",
  "readLater": true,
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
