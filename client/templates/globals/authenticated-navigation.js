Template.authenticatedNavigation.onCreated(function() {
  var instance = this;

  instance.autorun(function() {
  	instance.subscribe('projects');
    //instance.subscribe('membershipProjects');
    //instance.subscribe('ownedProjects');
    });
});

Template.authenticatedNavigation.helpers ({

	navProjects: function() {
		var projects = Projects.find({});
		if (projects.count() > 0) {
			return Projects.find({}, {sort: {createdAt: -1}});
		}
	}

});