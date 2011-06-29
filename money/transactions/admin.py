from django.contrib import admin
from transactions.models import Transaction, Account

admin.site.register(Account)
admin.site.register(Transaction)
