# Get Post

Retrieve a specific post by ID.

```http
GET /api/posts/:postId
Authorization: <web-token>
```

## Authentication

Requires [User Authentication](../../authentication/web.md).

## Parameters

- `postId` (string) - The ID of the post to retrieve

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
  "tags": [
    {
      "id": "tag_123",
      "title": "Technology"
    }
  ],
  "creators": [
    {
      "id": "creator_123",
      "name": "Creator Name"
    }
  ]
}
```

- Status `404 Not Found`

```js
{
  "error": "Post not found."
}
```
