from django.views.generic.list import ListView
from django.shortcuts import get_object_or_404, render_to_response
from transactions.models import Account, Transaction
from django.http import HttpResponseRedirect
from transactions.forms import ImportForm
from django.template.context import RequestContext
from django.core.urlresolvers import reverse

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
            account.import_data(form.cleaned_data['import_data'])
            return HttpResponseRedirect(reverse('account_transactions', kwargs={'account_id': account_id})) # Redirect after POST
    else:
        form = ImportForm() # An unbound form

    return render_to_response('transactions/importTransactions.html', {
                                                                       'account': account,
                                                                       'form': form,
                                                                       },
                              context_instance=RequestContext(request))
