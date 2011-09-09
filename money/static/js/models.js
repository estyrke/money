window.BaseModel = Backbone.Model.extend({
    url: function() {
        return this.get('resource_uri') || this.collection.url;
    }
});

window.BaseCollection = Backbone.Collection.extend({
    parse: function(data) {
        return data.objects;
    }
});

window.Account = BaseModel;
window.Transaction = BaseModel;

window.Category = BaseModel.extend({
    initialize: function () {
      this.set({mapping_string: (this.get("mappings") || []).map(function (mapping) { return "/" + mapping.matcher + "/"; }).join(", ")});  
    }
});

window.CategoryMapping = BaseModel;

window.Accounts = BaseCollection.extend({
    url: ACCOUNT_API,
    model: Account
});

window.Transactions = BaseCollection.extend({
    url: TRANSACTION_API,
    model: Transaction,
    
    forAccount: function(account) {
        return new Transactions(this.filter(function (t) { return t.get('account') === account }));
    }
});

window.Categories = BaseCollection.extend({
   url: CATEGORY_API,
   model: Category,
});

window.CategoryMappings = BaseCollection.extend({
   url: CATEGORY_MAPPING_API,
   model: CategoryMapping,
});
