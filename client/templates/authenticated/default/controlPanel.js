Template.controlPanel.onCreated(function() {
  var instance = this;

  instance.autorun(function() {
    //var projectId = Session.get("projectID");
    //instance.subscribe('project', projectId);
    //instance.subscribe('members', projectId);
  });
});

Template.controlPanel.helpers ({
	members : function() {
		return Meteor.users.find();
	},
	archivedCards : function() {
		return Cards.find({status :'archived'});
	},
	archivedTasks : function() {
		return Tasks.find({status :'archived'});
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
		var id = Session.get("projectID");
		//prompt confirmation!!!!
		Meteor.call("deleteProject",id);
	}
});