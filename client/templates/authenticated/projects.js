Template.projects.onCreated(function() {
  var instance = this;

  instance.autorun(function() {
    //instance.subscribe('projects');
    instance.subscribe('membershipProject');
    instance.subscribe('ownedProjects');
    });
});

Template.projects.helpers ({

	projects : function() {
		return Projects.find({}, {sort: {createdAt: -1}});
	}

});

Template.projects.events({

	//creating new project
	"submit .start_project": function($event) {
		event.preventDefault();
		//getting the inputs
		var name = event.target.proj_name.value;
		var description = event.target.proj_desc.value;
		var proj_type = event.target.proj_type.value;
		var theme = event.target.proj_theme.value;
		//determining project_type and reformatting for collection
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
		Meteor.call("newProject", name,description,proj_type,theme);
      	// clearing form, closing modal;
      	event.target.proj_name.value = "";
      	event.target.proj_desc.value = "";
      	$("#newPmodal").modal("hide");
  	},
  	"mouseover .projectLink" : function(event) {
		var proj_type = event.currentTarget.id;
		Session.set("proj_type",proj_type);
	}

});
