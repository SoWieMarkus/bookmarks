# Remove Creator

Delete a creator by ID.

```http
DELETE /api/creators/:creatorId
Authorization: <web-token>
```

## Authentication

Requires [User Authentication](../../authentication/web.md).

## Parameters

- `creatorId` (string) - The ID of the creator to delete

## Response

- Status `200 OK`

```js
{
  "id": "creator_123",
  "name": "Creator Name",
  "image": "image-data", //base64
  "userId": "user_123",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

- Status `404 Not Found`

```js
{
  "error": "Creator not found."
}
```
