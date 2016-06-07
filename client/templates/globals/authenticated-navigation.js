Template.authenticatedNavigation.onCreated(function() {
  var instance = this;

  instance.autorun(function() {
  	//instance.subscribe('projects');
    instance.subscribe('membershipProjects');
    instance.subscribe('ownedProjects');
    });
});

Template.authenticatedNavigation.helpers ({

	navProjects: function() {
		var logged = Session.get("loggedUser");
		if (logged) {
			return Projects.find({}, {sort: {createdAt: -1}});
		}
	}

});