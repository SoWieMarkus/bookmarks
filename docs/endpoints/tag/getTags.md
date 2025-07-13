# Get Tags

Retrieve all tags for the authenticated user, with optional title filtering.

```http
GET /api/tags?title=search_term
Authorization: <web-token>
```

## Authentication

Requires [User Authentication](../../authentication/web.md).

## Query Parameters

- `title` (string, optional) - Filter tags by title (partial match)

## Response

- Status `200 OK`

```js
[
  {
    id: "tag_123",
    title: "Technology",
    userId: "user_123",
    createdAt: "2024-01-15T10:30:00.000Z",
  },
  {
    id: "tag_456",
    title: "Programming",
    userId: "user_123",
    createdAt: "2024-01-16T10:30:00.000Z",
  },
];
```
