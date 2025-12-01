# Deployment Guide (Render)

This project is configured for one-click deployment on [Render](https://render.com) using a Blueprint.

## Prerequisites
- A GitHub account.
- A Render account (you can sign up with GitHub).

## Steps to Deploy

1.  **Push your code to GitHub**: Ensure this repository is pushed to your GitHub account.
2.  **Go to Render Dashboard**: Log in to [dashboard.render.com](https://dashboard.render.com).
3.  **New Blueprint**:
    - Click the **"New +"** button in the top right.
    - Select **"Blueprint"**.
4.  **Connect Repository**:
    - Connect your GitHub account if you haven't already.
    - Select this repository (`site-manager-b`) from the list.
5.  **Apply Blueprint**:
    - Render will automatically detect the `render.yaml` file.
    - It will show you the services it's about to create:
        - `construction-backend` (Web Service)
        - `construction-db` (PostgreSQL Database)
    - Click **"Apply Blueprint"**.

## What Happens Next?
- Render will provision a new PostgreSQL database.
- It will build your backend using the `Dockerfile`.
- It will automatically inject the database connection string into your backend.
- Once the build finishes, your app will be live!

## Troubleshooting
- **Build Failed?** Check the logs. If it's a Prisma error, ensure the `Dockerfile` still has the dummy `DATABASE_URL` fix we applied.
- **Database Connection Error?** Ensure the Blueprint correctly linked the `DATABASE_URL` environment variable.
