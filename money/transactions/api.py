from tastypie.resources import ModelResource
from transactions.models import Transaction, Account, Category, CategoryMapping
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

class CategoryMappingResource(ModelResource):
    category = fields.ToOneField("transactions.api.CategoryResource", 'category')
    
    class Meta(BaseMeta):
        queryset = CategoryMapping.objects.all()
        resource_name = 'category_mapping'

class CategoryResource(ModelResource):
    mappings = fields.ToManyField(CategoryMappingResource, 'mapping', full=True, null=True)
    parent = fields.ToOneField("transactions.api.CategoryResource", 'parent', null=True)
    
    class Meta(BaseMeta):
        queryset = Category.objects.all()
        resource_name = 'category'

class TransactionResource(ModelResource):
    account = fields.ToOneField(AccountResource, 'account')
    category = fields.ToOneField(CategoryResource, 'category', null=True)

    class Meta(BaseMeta):
        queryset = Transaction.objects.all()
        resource_name = 'transaction'
