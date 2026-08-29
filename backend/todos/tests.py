from rest_framework import status
from rest_framework.test import APITestCase

from .models import Account, Todo


class TodoIsolationTests(APITestCase):
    def setUp(self):
        self.alice = Account.objects.create(auth0_user_id="auth0|alice")
        self.bob = Account.objects.create(auth0_user_id="auth0|bob")
        self.bob_todo = Todo.objects.create(
            account=self.bob, title="Bob's private note"
        )

    def test_anonymous_request_is_rejected(self):
        response = self.client.get("/api/todos/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_returns_only_own_todos(self):
        Todo.objects.create(account=self.alice, title="Alice's task")
        self.client.force_authenticate(user=self.alice)

        response = self.client.get("/api/todos/")

        titles = [todo["title"] for todo in response.data["results"]]
        self.assertEqual(titles, ["Alice's task"])

    def test_cannot_read_another_accounts_todo(self):
        self.client.force_authenticate(user=self.alice)
        response = self.client.get(f"/api/todos/{self.bob_todo.id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_cannot_delete_another_accounts_todo(self):
        self.client.force_authenticate(user=self.alice)

        response = self.client.delete(f"/api/todos/{self.bob_todo.id}/")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(Todo.objects.filter(id=self.bob_todo.id).exists())

    def test_create_ignores_client_supplied_account(self):
        self.client.force_authenticate(user=self.alice)

        response = self.client.post(
            "/api/todos/",
            {"title": "Mine", "account": self.bob.id},
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        created = Todo.objects.get(id=response.data["id"])
        self.assertEqual(created.account, self.alice)
