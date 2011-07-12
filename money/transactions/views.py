from django.http import HttpResponse, HttpResponseNotAllowed, \
    HttpResponseBadRequest
from django.shortcuts import get_object_or_404
from django.views.generic.list import ListView
from transactions.forms import ImportForm
from transactions.models import Account, Transaction

class AccountTransactionsView(ListView):
    context_object_name = "transaction_list"
    
    def get_queryset(self):
        account = get_object_or_404(Account, pk=self.kwargs["account_id"])
        return Transaction.objects.filter(account=account)

def importTransactions(request, account_id):
    account = get_object_or_404(Account, pk=account_id)
    if request.method == 'POST': # If the form has been submitted...
        form = ImportForm(request.POST) # A form bound to the POST data
        if form.is_valid(): # All validation rules pass
            try:
                account.import_data(form.cleaned_data['import_data'])
                return HttpResponse(status=201)
            except ValueError as e:
                return HttpResponseBadRequest(content=e.args)
    else:
        return HttpResponseNotAllowed(['POST']);
    