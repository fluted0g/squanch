Template.members.onCreated(function() {
  var instance = this;

  instance.autorun(function() {
    var projectId = Session.get("projectID");
    instance.subscribe('members', projectId);
  });
});

Template.members.helpers({
	member : function() {
		var memberList = Projects.find({},{fields : { members : 1}});
		return Meteor.users.find({_id : {$in : memberList}});
	}
});

Template.members.events({
	'.click .deleteMember' : function(e) {
		
	}
});