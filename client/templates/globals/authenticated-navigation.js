Template.authenticatedNavigation.onCreated(function() {
  var instance = this;

  instance.autorun(function() {
    instance.subscribe('membershipProjects');
    instance.subscribe('ownedProjects');
    });
});

Template.authenticatedNavigation.helpers ({

	navProjects: function() {
		return Projects.find({}, {sort: {createdAt: -1}});
	}

});