Template.controlPanel.onCreated(function() {
  var instance = this;

  instance.autorun(function() {
  	var projectId = Session.get("projectID");
    instance.subscribe('members', projectId);
  });
});

Template.controlPanel.onRendered(function() {
});

Template.controlPanel.helpers ({
	archivedCards : function() {
		return Cards.find({status :'archived'});
	},
	archivedTasks : function() {
		return Tasks.find({status :'archived'});
	},
	owner : function() {
		var owner = Projects.find({},{fields:{owner:1}});
		return Meteor.users.find({_id:owner.owner});
	},
	member : function() {
		//var memberList = Projects.find({},{fields : { members : 1}}).fetch()[0];
		//users = Meteor.users.find({_id : {$in : memberList.members}});
		//return users;
		var projectId = Session.get("projectID");
		var members = Meteor.users.find({project_ids : {$in:[projectId]}});
		return members;
	}
});

Template.controlPanel.events ({
	'click .showHideToggler' : function(e) {

		var bool = $('.controlPanelContainer').hasClass('panelHidden');

		if (!bool) {
			$('.controlPanelContainer').animate({ left : '-22em' },1000,function() {
				$('.controlPanelContainer').toggleClass('panelHidden');
			});
		} else {
			$('.controlPanelContainer').animate({ left : '0em' },1000,function() {
				$('.controlPanelContainer').toggleClass('panelHidden');
			});
		}
	},
	'click .archivedCard' : function(e) {
		var id = this._id;
		Meteor.call("toggleStatus","card",id);
	},
	'click .archivedTask' : function(e) {
		var id = this._id;
		Meteor.call("toggleStatus","task",id);
	},
	'click .deleteProject' : function(e) {
		//prompt confirmation!!!!
		$('.deleteProject').confirmation({
			onConfirm : function(event) {
				event.preventDefault();
				var id = Session.get("projectID");
				Meteor.call("deleteProject",id);
				FlowRouter.go('/');
			},
			popout: true,
			singleton: true
		});	
	}
});