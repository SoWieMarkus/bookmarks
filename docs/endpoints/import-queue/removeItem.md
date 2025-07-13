# Remove Item from Import Queue

Remove a specific item from the import queue.

```http
DELETE /api/import-queue/remove/:itemId
Authorization: <web-token>
```

## Authentication

Requires [User Authentication](../../authentication/web.md).

## Parameters

- `itemId` (string) - The ID of the import queue item to remove

## Response

- Status `200 OK`

```js
{
  "id": "item_123",
  "url": "https://example.com/article1",
  "userId": "user_123",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

- Status `400 Bad Request`

```js
{
  "error": "Item ID is required."
}
```