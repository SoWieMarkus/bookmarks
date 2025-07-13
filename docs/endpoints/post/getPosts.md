# Get Posts

Retrieve all posts for the authenticated user.

```http
GET /api/posts
Authorization: <web-token>
```

## Authentication

Requires [User Authentication](../../authentication/web.md).

## Response

- Status `200 OK`

```js
[
  {
    id: "post_123",
    url: "https://example.com",
    title: "Post Title",
    description: "Post description",
    readLater: false,
    userId: "user_123",
    createdAt: "2024-01-15T10:30:00.000Z",
    tags: [
      {
        id: "tag_123",
        title: "Technology",
      },
    ],
    creators: [
      {
        id: "creator_123",
        name: "Creator Name",
      },
    ],
  },
  // ...
];
```
