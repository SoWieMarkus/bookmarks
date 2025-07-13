# Add Post

Create a new post/bookmark.

```http
POST /api/posts/add
Authorization: <web-token>
```

## Authentication

Requires [User Authentication](../../authentication/web.md).

## Request Body

```js
{
  "url": "https://example.com",
  "title": "Post Title",
  "description": "Post description",
  "readLater": false,
  "tags": ["tag_123", "tag_456"], // tag ids
  "creators": ["creator_123"] // creator ids
}
```

## Response

- Status `201 Created`

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

- Status `400 Bad Request`

```js
{
  "error": "Validation error message."
}
```

- Status `409 Conflict`

```js
{
  "error": "Post with this URL already exists."
}
```
