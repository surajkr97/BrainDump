# BrainDump

Todo app. Django REST API, Next.js frontend, Auth0 for login.

Live: https://brain-dump-ivory-two.vercel.app

Every todo belongs to one account. The backend enforces that, not the frontend.

Stack: Next.js 16 (App Router, TypeScript, Tailwind), Django 5.2 + DRF, Postgres
on Neon, Auth0. Deployed on Vercel and Render.

## How ownership works

One method in `todos/views.py`:

```python
def get_queryset(self):
    return Todo.objects.filter(account=self.request.user)
```

`ModelViewSet` routes every action through it, so list, retrieve, update and
delete are all scoped. Another account's todo returns 404, not 403 — a 403 would
confirm the row exists.

`perform_create` sets the owner from the token, and `account` isn't in the
serializer fields, so sending one does nothing.

`request.user` is an `Account`, found by the `sub` claim on a verified Auth0 JWT.
The frontend never sends a user id.

The browser never sees the access token either. It calls same-origin
`/api/todos`; the Next route handler reads the token from the session cookie
server-side and forwards it to Django.

## Setup

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
cp .env.example .env
.venv/bin/python manage.py migrate
.venv/bin/python manage.py runserver 8000
```

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Or `docker compose up` from the root — that runs both plus a local Postgres.

Fill in both env files first. `AUTH0_SECRET` needs 32 bytes, use
`openssl rand -hex 32`.

## Auth0 setup

You need one API and one application.

API: identifier `https://braindump-api`, signing algorithm RS256, Allow Offline
Access on. The identifier has to match `AUTH0_AUDIENCE` in both env files.

Application: Regular Web App.

    Allowed Callback URLs   http://localhost:3000/auth/callback
    Allowed Logout URLs     http://localhost:3000

The path is `/auth/callback`, not `/callback`, and port 3000 not 8000.

Then on the API, open the Application Access tab and turn on User-delegated
Access for the application. Miss it and login fails with "Client is not
authorized to access resource server".

## Tests

```bash
cd backend  && .venv/bin/python manage.py test   # 5
cd frontend && npm test                          # 16
```

The backend ones are the point. Two accounts, and it checks that Alice can't read
or delete Bob's todo, that the list only returns your own, that a client-supplied
`account` on create is ignored, and that anonymous requests get 401.

## Layout

    backend/todos/          models, serializer, viewset, JWT auth class
    frontend/app/           routes
    frontend/components/    atoms / molecules / organisms
    frontend/hooks/         useTodos, all state and API calls
    frontend/lib/           fetch wrapper, Auth0 client, Django forwarder

Components don't call the API. `useTodos` does and hands back plain functions.

## Decisions

The brief's example env has a public `NEXT_PUBLIC_API_URL`, which means the
browser calling Django directly with the token in JS. I proxied through Next
route handlers instead, so the token stays in an httpOnly cookie. One extra hop,
but nothing can read the token out of the browser.

404 rather than 403 for other people's todos, so IDs don't leak.

Pagination is offset based, 20 a page, so adding a todo while paging can shift
rows.

The Render free tier sleeps when idle. The page loads straight away but the todo
list can take up to a minute on the first request.
