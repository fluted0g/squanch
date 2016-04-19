Template.profile.onCreated(function() {
  var instance = this;

  instance.autorun(function() {
    instance.subscribe('users');
  });
});

Template.profile.helpers({
	users : function() {
		return Meteor.users.find({});
	},
	userProfile : function() {
		return Meteor.user();
	}
});
