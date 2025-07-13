# Get Import Queue

Retrieve all items in the import queue for the authenticated user.

```http
GET /api/import-queue/
Authorization: <web-token>
```

## Authentication

Requires [User Authentication](../../authentication/web.md).

## Response

- Status `200 OK`

```js
[
  {
    "id": "item_123",
    "url": "https://example.com/article1",
    "userId": "user_123",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": "item_124",
    "url": "https://github.com/user/repo",
    "userId": "user_123",
    "createdAt": "2024-01-15T09:15:00.000Z"
  }
]
```