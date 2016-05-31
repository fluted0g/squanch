Template.controlPanel.onCreated(function() {
  var instance = this;

  instance.autorun(function() {
  });
});

Template.controlPanel.onRendered(function() {
	$('.scrollbar-outer').slimScroll();
});

$(document).ready(function(){
    
});

Template.controlPanel.helpers ({
	archivedCards : function() {
		return Cards.find({status :'archived'});
	},
	archivedTasks : function() {
		return Tasks.find({status :'archived'});
	},
	member : function() {
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