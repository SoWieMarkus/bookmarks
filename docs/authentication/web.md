# Web Token Authentication

The `web token` is used to authenticate users in the web interface and for endpoints that require user-level authentication.

## How it works

- The web token is a JWT signed with your backend's `JWT_SECRET_WEB`.
- It contains the user's ID and an expiration timestamp.
- The backend validates the token, checks expiration, and ensures the user exists.
- If no token is provided the server will return `Status 401 Unauthorized`

```js
{
  "error": "Unauthorized. Please provide a valid token."
}
```

## Obtaining a Web Token

1. **Register a new account** with a username and password via the [registration endpoint](../endpoints/authentication/register.md)
2. **Receive your token** - Upon successful registration, the backend returns a web token:

```js
{ "token": "<your-web-token>" }
```

3. **Include in requests** - Add the token to the `Authorization` header for all authenticated endpoints:

```http
GET /api/example
Authorization: <web token>
```

4. **Future access** - For subsequent sessions, obtain a new token using your credentials via the [login endpoint](../endpoints/authentication/login.md)

## Token Expiration

- Web tokens are valid for 31 day by default.
- If your token expires, you must log in again to obtain a new one.
