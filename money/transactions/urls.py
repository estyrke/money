
from django.conf.urls.defaults import patterns, url
from django.views.generic.list import ListView
from transactions.models import Transaction, Account
from django.views.generic.detail import DetailView
from transactions.views import AccountTransactionsView, importTransactions


urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'money.views.home', name='home'),
    url(r'^$', ListView.as_view(model=Account), name='home'),
    url(r'^accounts/(?P<pk>\d+)/$', DetailView.as_view(model=Account)),
    url(r'^accounts/(?P<account_id>\d+)/transactions$', AccountTransactionsView.as_view(),
        name = 'account_transactions'),
    url(r'^transactions/$', ListView.as_view(model=Transaction)),
    url(r'^transactions/(?P<pk>\d+)/$', DetailView.as_view(model=Transaction)),
    url(r'^accounts/(?P<account_id>\d+)/import/$', importTransactions),
)

