# Edit Post

Update an existing post.

```http
POST /api/posts/edit/:postId
Authorization: <web-token>
```

## Authentication

Requires [User Authentication](../../authentication/web.md).

# Parameters

- `postId` (string) - The ID of the post to update

## Request Body

- Status `200 OK`

```js
{
  "url": "https://example.com",
  "title": "Updated Post Title",
  "description": "Updated description",
  "readLater": true,
  "tags": ["tag_123", "tag_789"], // tag ids
  "creators": ["creator_123", "creator_456"] // creator ids
}
```

## Response

- Status `200 OK`

```js
{
  "id": "post_123",
  "url": "https://example.com",
  "title": "Updated Post Title",
  "description": "Updated description",
  "readLater": true,
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

- Status `404 Not Found`

```js
{
  "error": "Post not found."
}
```
