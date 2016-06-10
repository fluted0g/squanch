Template.searchUser.onCreated(function() {
  var instance = this;

  instance.autorun(function() {
    var projectId = Session.get("projectID");
    instance.subscribe('members', projectId);
  });
});

var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var fields = ['emails', 'username'];
userSearch = new SearchSource('searchUser', fields, options);

Template.searchUser.helpers({
  getUsers: function() {
      return userSearch.getData();
  },
  isLoading: function() {
    return userSearch.getStatus().loading;
  }
});

Template.searchUser.events({
  'keyup .searchUser' : _.throttle( function(e) {
      e.preventDefault();
      var text = $(e.target).val().trim();
      if (text.length >= 3) {
        userSearch.search(text);
      } else if (text.length < 3) {
        //chapuza que flipas, pero me vale
        userSearch.search("20G25N81Y77B79");
      }
  },200),
  //continuando la chapuza
	'submit .searchUserForm' :  function(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
    	var projectId = Session.get("projectID");
      var text = $(e.target.searchUser).val().trim();
      Meteor.call('addMember',projectId, text, function(error,success) {
        if (error) {
          Bert.alert("User is already a member.","danger");
        }
      });
      $('.searchUser').val("");
      userSearch.search("20G25N81Y77B79");
  },
  'click .addUser' : function(e) {
      var member = this.username;
      if (!member) {
        member = this.emails[0].address;
      }
      var projectId = Session.get("projectID");
      Meteor.call('addMember',projectId, member, function(error,success) {
        if (error) {
          Bert.alert("User is already a member.","danger");
        }
      });
      $('.searchUser').val("");
      userSearch.search("20G25N81Y77B79");
  }
});