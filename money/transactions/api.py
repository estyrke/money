from tastypie.resources import ModelResource
from transactions.models import Transaction, Account, Category
from tastypie import fields
from tastypie.authorization import DjangoAuthorization, Authorization
from tastypie.authentication import BasicAuthentication, Authentication

class BaseMeta:
    authentication = Authentication()
    authorization = Authorization()
    
class AccountResource(ModelResource):
    class Meta(BaseMeta):
        queryset = Account.objects.all()
        resource_name = 'account'

class CategoryResource(ModelResource):
    class Meta(BaseMeta):
        queryset = Category.objects.all()
        resource_name = 'category'

class TransactionResource(ModelResource):
    account = fields.ForeignKey(AccountResource, 'account')
    category = fields.ForeignKey(CategoryResource, 'category')

    class Meta(BaseMeta):
        queryset = Transaction.objects.all()
        resource_name = 'transaction'
