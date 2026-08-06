# SkillPro backend

## Step 1: Authentication

1. Copy `.env.example` to `.env` and replace both JWT secrets with long random values.
2. Start MongoDB locally, or set `MONGODB_URI` to your MongoDB Atlas connection base URI (without the database name).
3. Run `npm run dev` from this directory.
4. Check `GET http://localhost:8000/api/v1/health`.

Implemented endpoints:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout` (Bearer token required)
- `POST /api/v1/auth/refresh-token`
- `GET /api/v1/auth/me` (Bearer token required)

Register body example:

```json
{
  "name": "Asha Patel",
  "email": "asha@example.com",
  "password": "secure-password-123",
  "role": "customer",
  "city": "Mumbai"
}
```

For protected endpoints send `Authorization: Bearer <accessToken>` or use the cookies set by login.
