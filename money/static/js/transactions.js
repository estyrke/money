$( function() {
    var oldSync = Backbone.sync;

    Backbone.sync = function(method, model, options) {
        var oldSuccess = options.success;
        options.success = function(resp, status, xhr) {
            if(xhr.statusText === "CREATED") {
                var location = xhr.getResponseHeader('Location');
                return $.ajax({
                    url: location,
                    success: oldSuccess
                });
            }
            return oldSuccess(resp, status, xhr);
        };
        return oldSync(method, model, options);
    };

    var App = Backbone.Router.extend({
        routes: {
            "accounts": "accounts",
            "accounts/:id": "account_transactions",
            "categories": "categories",
            "categories/months": "categoriesPerMonth"
        },

        initialize: function (onLoaded) {
            var loaded = 0;
            var onLoad = function () {
                if (++loaded == 3)
                    onLoaded();
            };
            this.accounts = new Accounts();
            console.debug("Fetching accounts");
            this.accounts.fetch({ success: onLoad});

            this.transactions = new Transactions(); 
            console.debug("Fetching transactions");
            this.transactions.fetch({ success: onLoad});
            
            this.categories = new Categories();
            this.categories.fetch({ success: onLoad});
            
            this.view = {el: "#app" };
        },
        
        accounts: function () {
            $(this.view.el).hide();
            this.view = new AccountsView({ accounts: this.accounts});
        },
        
        account_transactions: function (id) {
            $(this.view.el).hide();
            this.view = new TransactionsView({ transactions: this.transactions.forAccount(this.accounts.get(id).url()),
                                                           account_id: id});
        },
        
        categories: function () {
            $(this.view.el).hide();
            this.view = new CategoriesView({ categories: this.categories });
        },
        
        categoriesPerMonth: function () {
            $(this.view.el).hide();
            var categories = new Categories();
            var that = this;
            categories.fetch({success: function () {
                that.view = new CategoriesView({ categories: categories });
            }});
        }
    });

    new App(function () {
        Backbone.history.start({
            root: "/money/"
        });
    });

});