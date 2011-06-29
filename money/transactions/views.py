from django.views.generic.list import ListView
from django.shortcuts import get_object_or_404
from transactions.models import Account, Transaction

class AccountTransactionsView(ListView):
    context_object_name = "transaction_list"
    
    def get_queryset(self):
        account = get_object_or_404(Account, pk=self.kwargs["pk"])
        return Transaction.objects.filter(account=account)

