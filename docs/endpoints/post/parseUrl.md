# Parse URL

Extract metadata from a URL for creating a post.

```http
POST /api/posts/url
Authorization: <web-token>
```

## Authentication

Requires [User Authentication](../../authentication/web.md).

## Request Body

```js
{
  "url": "https://example.com"
}
```

## Response

- Status `200 OK`

```js
{
  "title": "Extracted Page Title",
  "description": "Extracted page description",
  "thumbnail": "https://example.com/image.jpg",
  "url": "http://example.com",
  "duration": 1000, // in ms, can be null
}
```

- Status `400 Bad Request`

```js
{
  "error": "Validation error message."
}
```
