Template.members.onCreated(function() {
  var instance = this;

  instance.autorun(function() {
  	var projectId = Session.get("projectID");
    instance.subscribe('members', projectId);
  });
});

Template.members.helpers({
	isOwner : function() {
		var projectId = Session.get("projectID");
		var ownerP = Projects.find({},{fields:{owner:1}}).fetch()[0];
		if (ownerP.owner == this._id) {
			return true;
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
		var member = e.currentTarget.id;
		Session.set("memberNameOrMail", member);
	},
	'click .deleteMember' : function(e) {
		var project = Session.get("projectID");
		var member = Session.get("memberNameOrMail");
		Meteor.call("removeMember",project,member);
	}
});