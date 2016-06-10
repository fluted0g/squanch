Meteor.methods({ 
	newProject : function(name,description,proj_type,theme) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(name, String);
		check(description, String);
		check(proj_type,String);
		check(theme,String);

		return Projects.insert({
			name: name,
			owner: Meteor.userId(),
			description: description,
			proj_type: proj_type,
			theme: theme,
			members: [Meteor.userId()]
		},function(err,doc) {
			Meteor.users.update({ _id : Meteor.userId() },{ $push: {project_ids : doc} });
		});
	},
	deleteProject : function(projectId) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(projectId,String);
		var userId = Meteor.userId();
		var project = Projects.findOne({_id:projectId});
		if (project.owner == userId) {
			Projects.remove({_id:projectId});
			Meteor.users.update({_id:userId},{$pull:{project_ids:projectId}});
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	editProjectName : function(projectId,input) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}		
		check(projectId, String);
		check(input, String);
		var project = Projects.findOne({_id:projectId});
		if (project) {
			Projects.update({_id:projectId},{$set:{name:input}});
		} else {
			throw new Meteor.error("invalid-target")
		}
	},
	editProjectDescription : function(projectId,input) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}		
		check(projectId, String);
		check(input, String);
		var project = Projects.findOne({_id:projectId});
		if (project) {
			Projects.update({_id:projectId},{$set:{description:input}});
		} else {
			throw new Meteor.error("invalid-target")
		}
	}
});