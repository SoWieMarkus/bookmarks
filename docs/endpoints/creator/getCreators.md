# Get Creators

Retrieve all creators for the authenticated user, with optional name filtering.

```http
GET /api/creators?name=search_term
Authorization: <web-token>
```

## Authentication

Requires [User Authentication](../../authentication/web.md).

## Query Parameters

- `name` (string, optional) - Filter creators by name (partial match)

## Response

- Status `200 OK`

```js
[
  {
    id: "creator_123",
    name: "Creator Name",
    image: "image-data",
    userId: "user_123",
    createdAt: "2024-01-15T10:30:00.000Z",
  },
  {
    id: "creator_456",
    name: "Another Creator",
    image: null,
    userId: "user_123",
    createdAt: "2024-01-16T10:30:00.000Z",
  },
  //...
];
```
