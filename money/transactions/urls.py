
from django.conf.urls.defaults import patterns, url, include
from tastypie.api import Api
from transactions.api import TransactionResource, AccountResource, \
    CategoryResource, CategoryMappingResource
from transactions.views import importTransactions

v1_api = Api(api_name='v1')
v1_api.register(TransactionResource())
v1_api.register(AccountResource())
v1_api.register(CategoryResource())
v1_api.register(CategoryMappingResource())

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'money.views.home', name='home'),
    url(r'^$',
        'django.views.generic.simple.direct_to_template',
        {'template':'transactions/base.html'},
        name="home"),
    url(r'^account/(?P<account_id>\d+)/import', importTransactions),
    url(r'^api/', include(v1_api.urls)),
)

