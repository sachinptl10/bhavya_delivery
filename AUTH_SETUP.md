# Google OAuth 2.0 Setup Guide

To finish securing your application with Google OAuth, you need to create OAuth credentials in the Google Cloud Console and add them to your environment variables.

## 1. Create Google Cloud Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new Project (or select an existing one).
3. In the sidebar, navigate to **APIs & Services > OAuth consent screen**.
   - Choose **External** user type.
   - Fill in your App name, user support email, and developer contact information.
   - You can skip adding specific scopes for now (the defaults are fine).
   - Add test users if your app is in "Testing" mode.
4. Navigate to **APIs & Services > Credentials**.
5. Click **+ CREATE CREDENTIALS** and select **OAuth client ID**.
6. Set the **Application type** to **Web application**.
7. Under **Authorized redirect URIs**, you **MUST** add both of the following exactly as they appear (for local development):
   - `http://localhost:5000/api/auth/google/user/callback`
   - `http://localhost:5000/api/auth/google/admin/callback`
   *(Note: When you deploy to production, e.g. Render, you must add the live URLs here as well, like `https://bhavya-backend.onrender.com/api/auth/google/user/callback`)*
8. Click Create. You will be given a **Client ID** and **Client Secret**.

## 2. Update Backend Environment Variables

In your `backend` folder, update or create your `.env` file with the following variables:

```env
# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here

# JWT Secret for Cookie Sessions (make this a long, random string)
JWT_SECRET=super_secret_jwt_key_123!

# Frontend URL for redirecting after login
VITE_FRONTEND_URL=http://localhost:5173

# Admin Whitelist (Comma separated list of emails allowed to log in as admin)
ADMIN_WHITELIST_EMAILS=admin@bhavya.com,your.email@gmail.com
```

## 3. How the Admin System Works

For security, **no one can randomly register as an admin using Google OAuth.** 

If someone tries to log in via the Admin Portal (`/admin/login`), the backend checks if their Google email matches any email in your `ADMIN_WHITELIST_EMAILS` variable.
- If it **does match**, they are logged in and granted the `admin` role.
- If it **does not match**, the login fails, and they are redirected back to the login screen with an "Unauthorized" error message.

This prevents unauthorized users from hijacking your admin dashboard.
