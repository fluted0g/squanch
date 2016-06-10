Meteor.methods({
	editUserProfile : function(objProfile) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(objProfile, Object);
		return Meteor.users.update({_id:Meteor.userId()},{$set: {profile:objProfile}});
	},
	addMember : function(projectId,nameOrMail) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(projectId, String);
		check(nameOrMail, String);
		var member;
		member = Accounts.findUserByUsername(nameOrMail);
		if (!member) {
			member = Accounts.findUserByEmail(nameOrMail);
		}
		var memberExists = Meteor.users.findOne({ _id: member._id, project_ids : { $in: [projectId] } }, { fields : { services : 0} });
		if (memberExists) {
			throw new Meteor.error("member-exists");
		} else {
			Meteor.users.update({ _id : member._id },{ $push: {project_ids : projectId} });
			Projects.update({_id:projectId},{$push:{members:member._id}});
		}	
	},
	removeMember : function(projectId, nameOrMail) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(projectId, String);
		check(nameOrMail, String);
		var member = Accounts.findUserByUsername(nameOrMail);
		if (!member) {
			member = Accounts.findUserByEmail(nameOrMail);
		}
		var isOwner = Projects.findOne({_id:projectId, owner:member._id});
		if (Meteor.userId() == member._id) {
			var isSelf = true;
		}

		if (!isSelf) {
			Meteor.users.update({_id : member._id },{ $pull : { project_ids : { $in : [projectId]}} });
			Projects.update({_id:projectId},{$pull:{members:member._id}});
		} else {
			throw new Meteor.error("invalid-target");
		}
	},
	isUser : function(nameOrMail) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(nameOrMail, String);
		var member = Accounts.findUserByUsername(nameOrMail);
		if (!member) {
			member = Accounts.findUserByEmail(nameOrMail);
		}
		if (member) {
			return true;
		} else if (!member) {
			throw new Meteor.error("user-not-exists");
		}
	},
	changeUsername : function(nameOrMail,newUsername) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(nameOrMail, String);
		check(newUsername, String);

		var member = Accounts.findUserByUsername(nameOrMail);
		if (!member) {
			member = Accounts.findUserByEmail(nameOrMail);
		}

		if (!member) {
			throw new Meteor.error("not-found");
		}

		if (member._id == Meteor.user()._id) {
			Meteor.users.update({_id:member._id}, {$set:{username:newUsername}});
		} else {
			throw new Meteor.error("not-authorized");
		}

	}
});