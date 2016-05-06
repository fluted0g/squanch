Template.controlPanel.onCreated(function() {
  var instance = this;

  instance.autorun(function() {
    var projectId = Session.get("projectID");
    instance.subscribe('project', projectId);
    //instance.subscribe('members', projectId);
  });
});

Template.controlPanel.helpers ({
	members : function() {
		return Meteor.users.find();
	},
	archivedCards : function() {
		return Projects.find({cards: { status: 'archived'}});
	},
	archivedTasks : function() {
		return Tasks.find({status :'archived'});
	}
});

Template.controlPanel.events ({
	'click .showHideToggler' : function(event) {

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
	}
});