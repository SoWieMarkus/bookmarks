# Edit Creator

Update an existing creator.

```http
PUT /api/creators/:creatorId
Authorization: <web-token>
```

## Authentication

Requires [User Authentication](../../authentication/web.md).

## Parameters

- `creatorId` (string) - The ID of the creator to update

## Request Body

```js
{
  "name": "Updated Creator Name",
  "image": "base64-encoded-image-string" // optional, can be null
}
```

## Response

- Status `200 OK`

```js
{
  "id": "creator_123",
  "name": "Updated Creator Name",
  "image": "processed-image-data",
  "userId": "user_123",
  "createdAt": "2024-01-15T10:30:00.000Z"
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
  "error": "Creator not found."
}
```
