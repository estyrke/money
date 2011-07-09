$(function() {
var oldSync = Backbone.sync;
 
Backbone.sync = function(method, model, options){
    var oldSuccess = options.success;
    options.success = function(resp, status, xhr){
        if(xhr.statusText === "CREATED"){
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
  url: function(){
     return this.get('resource_uri') || this.collection.url;
  }
});
 
window.Accounts = Backbone.Collection.extend({
  url: ACCOUNT_API,
  model: Account,
  parse: function(data){
      return data.objects;
  }                                             
});

window.AccountView = Backbone.View.extend({
  tagName: 'li',
  className: 'account',
 
  render: function(){
      console.debug("jek");
      $(this.el).html(ich.accountTemplate(this.model.toJSON()));
      return this;
  }                                        
});

window.App = Backbone.View.extend({
  el: $('#app'),
 
  events: {
      'click #createAccount': 'createAccount'
  },
 
  initialize: function(){
      _.bindAll(this, 'addOne', 'addAll', 'render');
      this.accounts = new Accounts();
      this.accounts.bind('add', this.addOne);
      this.accounts.bind('reset', this.addAll);
      this.accounts.bind('all', this.render);
      console.debug("Fetching accounts");
      this.accounts.fetch();
  },
 
  addAll: function(){
      this.accounts.each(this.addOne);
  },
 
  addOne: function(account){
      var view = new AccountView({model:account});
      this.$('#accounts').append(view.render().el);
  },
 
  createAccount: function(){
      var name = this.$('#name').val();
      var number = this.$('#number').val();
      if(name && number){
          this.accounts.create({
                                 name: name,
                                 number: number
                             });
          this.$('#name').val('');
          this.$('#number').val('');
      }
  }                                  
});
 
window.app = new App();

});