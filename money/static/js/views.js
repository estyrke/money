window.AccountView = Backbone.View.extend({
    tagName: 'li',
    className: 'account',

    render: function() {
        $(this.el).html(ich.accountTemplate(this.model.toJSON()));
        return this;
    }
});

window.TransactionView = Backbone.View.extend({
    tagName: 'tr',
    className: 'transaction',

    render: function() {
        $(this.el).html(ich.transactionTemplate(this.model.toJSON()));
        return this;
    }
});

window.CategoryView = Backbone.View.extend({
    tagName: 'tr',
    className: 'category',
    
    events: {
        'click .delete': 'deleteCategory'
    },
    
    render: function () {
        console.debug(this.model.toJSON());
        $(this.el).html(ich.categoryTemplate(this.model.toJSON()));
        return this;
    },
    
    deleteCategory: function () {
        this.model.destroy();
    }
})

window.AccountsView = Backbone.View.extend({
    el: "#app",
    events: {
        'click #createAccount': 'createAccount'
    },

    initialize: function() {
        _.bindAll(this, 'addOne', 'addAll', 'render');
        this.accounts = this.options.accounts;
        this.accounts.bind('add', this.addOne);
        this.accounts.bind('reset', this.addAll);
        this.accounts.bind('all', this.render);
        this.render();
    },
    addAll: function() {
        this.accounts.each(this.addOne);
    },
    addOne: function(account) {
        var view = new AccountView({
            model:account
        });
        this.$('#accounts').append(view.render().el);
    },
    createAccount: function() {
        var name = this.$('#name').val();
        var number = this.$('#number').val();
        if(name && number) {
            this.accounts.create({
                name: name,
                number: number
            });
            this.$('#name').val('');
            this.$('#number').val('');
        }
    },
    render: function () {
        $(this.el).html(ich.accountsTemplate());
        this.addAll();
        $(this.el).show();
    }
});

window.TransactionsView = Backbone.View.extend({
    el: "#app",
    events: {
        'click #import': 'import'
    },
    initialize: function() {
        _.bindAll(this, 'addOne', 'addAll', 'render');
        this.transactions = this.options.transactions;
        this.account_id = this.options.account_id;
        this.transactions.bind('add', this.addOne);
        this.transactions.bind('reset', this.addAll);
        this.transactions.bind('all', this.render);
        this.render();
    },
    addAll: function() {
        this.transactions.each(this.addOne);
    },
    addOne: function(transaction) {
        var view = new TransactionView({
            model: transaction
        });
        this.$('#transactions').append(view.render().el);
    },
    render: function () {
        $(this.el).html(ich.transactionsTemplate(this));
        this.addAll();
        $(this.el).show();
    },
    "import": function () {
        $.ajax({ url: '/money/account/' + this.account_id + "/import",
                 type: "POST",
                 data: { import_data: $("#import_data").val(),
                         csrfmiddlewaretoken: CSRF_TOKEN },
                 success: this.reset
        });
    }
});

window.CategoriesView = Backbone.View.extend({
    el: "#categories",

    events: {
        'click #add_category': 'createCategory',
        'click #add_mapping': 'createMapping'
    },
    
    initialize: function() {
        _.bindAll(this, 'addOne', 'addAll', 'render');
        this.categories = this.options.categories;
        console.debug(this.categories);
        this.categories.bind('add', this.addOne);
        this.categories.bind('reset', this.addAll);
        this.categories.bind('all', this.render);
        this.render();
    },
    addAll: function() {
        this.categories.each(this.addOne);
    },
    addOne: function(category) {
        var view = new CategoryView({
            model: category
        });
        this.$('#category_list').append(view.render().el);
        this.$('#mapping_category').append("<option value='" + category.get('id') + "'>" + category.get('name') + "</option>");
    },
    createCategory: function() {
        var name = this.$('#category_name').val();
        if(name) {
            this.categories.create({
                name: name
            });
            this.$('#name').val('');
        }
    },
    createMapping: function () {
        var matcher = this.$('#mapping_regex').val();
        var category_id = this.$('#mapping_category').val();
        var category = this.categories.get(category_id);
        var that = this;
        if(matcher && category) {
            var mapping = new CategoryMappings().create({
                matcher: matcher,
                category: category.url()
            }, {
                success: function () {
                    category.get("mappings").push(mapping.toJSON());
                    console.debug(mapping);
                    console.debug("Modified category = ");
                    console.debug(category);
                    that.render();
                }
            });
            this.$('#mapping_regex').val('');
            this.$('#mapping_category').val('');
        }
    },
    render: function () {
        this.$("#category_list").html("");
        this.$('#mapping_category').html("");
        
        this.addAll();
        $(this.el).show();
    }
});
