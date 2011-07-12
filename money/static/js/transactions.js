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
    window.Account = Backbone.Model.extend({
        url: function() {
            return this.get('resource_uri') || this.collection.url;
        }
    });
    window.Transaction = Backbone.Model.extend({
        url: function() {
            return this.get('resource_uri') || this.collection.url;
        }
    });
    window.Accounts = Backbone.Collection.extend({
        url: ACCOUNT_API,
        model: Account,
        parse: function(data) {
            return data.objects;
        }
    });
    window.Transactions = Backbone.Collection.extend({
        url: TRANSACTION_API,
        model: Transaction,
        parse: function(data) {
            return data.objects;
        },
        
        forAccount: function(account) {
            return new Transactions(this.filter(function (t) { return t.get('account') === account }));
        }
    })

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

    var App = Backbone.Router.extend({
        routes: {
            "accounts": "accounts",
            "accounts/:id": "accounts"
        },

        initialize: function (onLoaded) {
            var loaded = 0;
            var onLoad = function () {
                if (++loaded == 2)
                    onLoaded();
            };
            this.accounts = new Accounts();
            console.debug("Fetching accounts");
            this.accounts.fetch({ success: onLoad});

            this.transactions = new Transactions(); 
            console.debug("Fetching transactions");
            this.transactions.fetch({ success: onLoad});

        },
        
        accounts: function(id) {
            if (!id) {
                this.accountsView = new AccountsView({ accounts: this.accounts});
            } else {
                this.transactionsView = new TransactionsView({ transactions: this.transactions.forAccount(this.accounts.get(id).url()),
                                                               account_id: id});
            }
        }
    });

    new App(function () {
        Backbone.history.start({
            root: "/money/"
        });
    });

});