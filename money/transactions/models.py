from django.db import models

class Account(models.Model):
    account_number = models.CharField(max_length=30)
    account_name = models.CharField(max_length=100)
    
class Transaction(models.Model):
    transaction_date = models.DateField()
    currency_date = models.DateField()
    reference = models.BigIntegerField()
    account = models.ForeignKey(Account)
    text = models.CharField(max_length=100)
    value = models.DecimalField(decimal_places=2, max_digits=10)

