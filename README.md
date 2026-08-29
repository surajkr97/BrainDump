# BrainDump

Todo app. Django REST API on one side, Next.js on the other, Auth0 doing the login.

Every todo belongs to one account. The backend is what makes sure you only ever
see your own - not the frontend.

Stack: Next.js 16 (App Router, TypeScript, Tailwind), Django 5.2 + DRF, SQLite, Auth0.

## The important part

All of it goes through one method in `todos/views.py`:

```python
def get_queryset(self):
    return Todo.objects.filter(account=self.request.user)
```

`ModelViewSet` runs every action through that, so list, retrieve, update and
delete are all scoped already. Ask for a todo that isn't yours and you get a
404, not a 403. A 403 would be admitting the row exists.

On create, `perform_create` sets the owner from the token. And `account` isn't
in the serializer fields at all, so posting one does nothing.

`request.user` is an `Account`, found by the `sub` claim on a verified token.
The frontend never sends a user id and the backend wouldn't trust it anyway.

## Auth0 setup

You need one API and one application.

**API** (Applications > APIs > Create API)

    Name        BrainDump API
    Identifier  https://braindump-api
    Algorithm   RS256

The identifier is just a string, it doesn't have to resolve, but it has to match
`AUTH0_AUDIENCE` in both env files exactly. RS256 because Django checks the
signature against Auth0's public keys. Then in that API's Settings turn on
**Allow Offline Access**, the frontend asks for `offline_access`.

**Application** (Regular Web Application)

    Allowed Callback URLs   http://localhost:3000/auth/callback
    Allowed Logout URLs     http://localhost:3000

Note the path is `/auth/callback` and not `/callback` - that's where
`@auth0/nextjs-auth0` v4 puts it. And port 3000, the Next server. Django on 8000
is never part of the browser login.

**Then authorize the app for the API.** Back on the API, Application Access tab,
turn on User-delegated Access for your application. Miss this one and login dies
with "Client is not authorized to access resource server", which is not an
obvious message. Client Access is the machine-to-machine one, you don't need it.

## Running it

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

Fill in both env files before starting. `AUTH0_SECRET` wants 32 bytes,
`openssl rand -hex 32`. Everything else is in the example files.

Then http://localhost:3000.

Admin is at /admin/ if you make a superuser. That's a normal Django user, nothing
to do with Auth0 - the auth class returns `None` when there's no Bearer header so
session login still works next to it.

## Tests

```bash
cd backend  && .venv/bin/python manage.py test   # 5
cd frontend && npm test                          # 16
```

The backend ones are the ones that matter. Two accounts, and it checks that
Alice can't read or delete Bob's todo, that the list only ever returns your own,
that a client-supplied `account` on create gets ignored, and that anonymous
requests are 401.

## Layout

Backend is a normal Django app - models, serializer, viewset, and an
authentication class that verifies the JWT.

Frontend is atomic design:

    app/           routes only
    components/    atoms / molecules / organisms
    hooks/         useTodos - all the state and API calls live here
    lib/           fetch wrapper, Auth0 client, the Django forwarder
    types/

Components don't call the API. `useTodos` owns that and hands back plain
functions, so `TodoList` only decides what to draw.

## Decisions

**Browser never sees the access token.** The assignment's example env has a
public `NEXT_PUBLIC_API_URL`, which means the browser calling Django directly
with the token in JS. I put Next route handlers in between instead - token stays
in an httpOnly cookie, server reads it and forwards. One more hop locally, but
nothing can read the token out of the browser.

**404 instead of 403** for other people's todos, so IDs don't leak.

**Pagination is offset based**, 20 a page. Adding a todo while you're paging can
shift rows. Cursor pagination fixes that but it's more than this needs.

**Feedback on writes** is the list updating and the buttons disabling while a
request is out. No toasts.

Not done: filter by active/completed, search, Docker, deployment.
