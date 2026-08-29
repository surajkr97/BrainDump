from django.contrib import admin

from .models import Account, Todo


@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ["auth0_user_id", "email", "created_at"]
    search_fields = ["auth0_user_id", "email"]


@admin.register(Todo)
class TodoAdmin(admin.ModelAdmin):
    list_display = ["title", "account", "completed", "created_at"]
    list_filter = ["completed"]
    search_fields = ["title"]
