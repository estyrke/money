from django.contrib import admin
from transactions.models import Transaction, Account, CategoryMapping, Category

admin.site.register(Account)
admin.site.register(Transaction)
admin.site.register(Category)
admin.site.register(CategoryMapping)