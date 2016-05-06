Template.searchUser.onCreated(function() {
  var instance = this;

  instance.autorun(function() {
    var projectId = Session.get("projectID");
    //instance.subscribe('members', projectId);

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
    /*
    return userSearch.getData({
      transform: function(matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>")
      },
      sort: {username: 1}
    });
    */
  },
  isLoading: function() {
    return userSearch.getStatus().loading;
  }
});

Template.searchUser.rendered = function() {
  userSearch.search('');
};

Template.searchUser.events({
  'keyup , blur .searchUser' : _.throttle( function(e) {
      e.preventDefault();
      var text = $(e.target).val().trim();
      if (text.length >= 3) {
        userSearch.search(text);
      }
      
      
  },200),
	'submit .searchUserForm' :  function(e) {
      e.preventDefault();
    	var projectId = Session.get("projectID");
      var text = $(e.target.searchUser).val().trim();
      /*var isUser = Meteor.users.findOne({ $or :
                                            [ { 'emails' :  { $elemMatch: 
                                            { 'address' : text } } }, 
                                            { 'username' : text } ]
                                            },{fields : {_id : 1}} );
      */
        Meteor.call('addMember',projectId, text);
  	}
});