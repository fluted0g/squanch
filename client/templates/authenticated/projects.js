Template.projects.onCreated(function() {
  var instance = this;

  instance.autorun(function() {
  	instance.subscribe('user');
  	//instance.subscribe('projects');
    instance.subscribe('membershipProjects');
    instance.subscribe('ownedProjects');
    });
});

Template.projects.helpers ({
	showProjects : function() {
		return Projects.find({}, {sort: {createdAt: -1}});
	}
});

Template.projects.events({
	'click .start_project_inserter' : function(e) {
		$(".start_project_inserter").toggleClass("hiddenE");
		$(".project_inserter").toggleClass("hiddenE");
	},
	'click .cancelFormP' : function(e) {
		$(".project_inserter").toggleClass("hiddenE");
		$(".start_project_inserter").toggleClass("hiddenE");
	},
	'submit .insert_project': function(e) {
		e.preventDefault();
		var name = e.target.proj_name.value;
		var description = e.target.proj_desc.value;
		var proj_type = "defaultP";
		var theme = "default";
		/*
		switch (proj_type) {
			case "Software project" :
				proj_type = "defaultP";
			break;
			case "Exam planning" :
				proj_type = "studentP";
			break;
			case "Class managing" :
				proj_type = "teacherP";
			break;
		}
		*/
		Meteor.call("newProject", name,description,proj_type,theme , function(error,data) {
			if (error) {
				Bert.alert('Something went wrong','danger');
			} else {
				console.log(data);
				//Meteor.call('fixProject',data);
			}
		});
      	e.target.proj_name.value = "";
      	e.target.proj_desc.value = "";
  	},
  	"mouseover .projectLink" : function(e) {
		var proj_type = $(e.currentTarget).data("id");
		Session.set("proj_type",proj_type);
	}
});

Template.project.helpers({
	isOwner : function() {
		projectId = this._id;
		project = Projects.findOne({});
		if (project.owner == Meteor.user()._id) {
			return true;
		}
	}
});
