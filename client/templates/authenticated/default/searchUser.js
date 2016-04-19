
var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};

var fields = ['emails', 'username'];

userSearch = new SearchSource('searchUser', fields, options);

Template.searchUser.helpers({
  getUsers: function() {
    return userSearch.getData({
      transform: function(matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>")
      },
      sort: {username: 1}
    });
  },
  isLoading: function() {
    return userSearch.getStatus().loading;
  }
});

Template.searchUser.events({
	'keyup .searchUser' : _.throttle(function(e) {
    	var text = $(e.target).val().trim();
    	userSearch.search(text);
    	var searchQuery = userSearch.getCurrentQuery();
    	console.log(searchQuery);
  	}, 200)
});