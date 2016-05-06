Template.members.onCreated(function() {
  var instance = this;

  instance.autorun(function() {
    var projectId = Session.get("projectID");
    //instance.subscribe('members', projectId);
  });
});

Template.members.helpers({
	member : function() {
		var memberList = Projects.find({},{fields : { members : 1}}).fetch()[0];
		return Meteor.users.find({_id : {$in : memberList.members}});
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