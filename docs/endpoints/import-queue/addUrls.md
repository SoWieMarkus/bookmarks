# Add URLs to Import Queue

Add multiple URLs to the import queue for processing.

```http
POST /api/import-queue/add
Authorization: <web-token>
```

## Authentication

Requires [User Authentication](../../authentication/web.md).

## Request Body

Array of URLs to add to the import queue.

```js
[
  "https://example.com/article1",
  "https://github.com/user/repo",
  "https://stackoverflow.com/questions/123456"
]
```

## Response

- Status `201 Created`

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
    "createdAt": "2024-01-15T10:30:01.000Z"
  }
]
```

- Status `400 Bad Request`

```js
{
  "error": "Validation error message."
}
```
