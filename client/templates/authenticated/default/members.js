Template.members.onCreated(function() {
  var instance = this;

  instance.autorun(function() {
  	var projectId = Session.get("projectID");
    instance.subscribe('members', projectId);
  });
});

Template.members.helpers({
	//old isOwner helper
	isOwner : function() {
		var projectId = Session.get("projectID");
		var ownerP = Projects.find({_id:projectId},{fields:{owner:1}}).fetch()[0];
		if (ownerP.owner == this._id) {
			return true;
		}
	},
	//new isOwner helper(checks if current user is the owner)
	userIsOwner : function() {
		var projectId = Session.get("projectID");
		var ownerP = Projects.find({_id:projectId},{fields:{owner:1}}).fetch()[0];
		if (ownerP.owner == Meteor.user()._id) {
			return true;
		} else {
			return false;
		}
	},
	initials : function() {
		if (this.username) {
			return this.username.substr(0,3).toUpperCase();
		} else {
			return this.emails[0].address.substr(0,3).toUpperCase();
		}
		
	}
});

Template.members.events({
	'mouseover .userFrame' : function(e) {
		var member = $(e.currentTarget).data("id");
		Session.set("memberNameOrMail", member);
	},
	'click .deleteMember' : function(e) {
		var project = Session.get("projectID");
		var member = Session.get("memberNameOrMail");
		Meteor.call("removeMember",project,member);
	}
});