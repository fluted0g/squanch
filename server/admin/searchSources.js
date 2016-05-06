SearchSource.defineSource('searchUser', function(searchText, options) {
  
  var options = { fields: {_id : 1, username : 1, emails : 1}};

  if(searchText) {
    var regExp = buildRegExp(searchText);
    var selector = {$or: [
      { 'emails' :  { $elemMatch : { 'address': regExp } } },
      {username: regExp}
    ]};

    //console.log(Meteor.users.find(selector, options).fetch());
    
    return Meteor.users.find(selector, options).fetch(); //fetch???
  } else {
    return "No users found";
  }
});

function buildRegExp(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  reg = new RegExp("(" + parts.join('|') + ")", "ig");
  return reg;
}