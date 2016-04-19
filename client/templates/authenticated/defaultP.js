
Template.defaultP.onCreated(function() {
  var instance = this;

  instance.autorun(function() {
    var projectId = FlowRouter.getParam('_id');
    Session.set("projectID",projectId);
    instance.subscribe('project', projectId);
    instance.subscribe('members', projectId);
  });
});


Template.defaultP.helpers ({
	project : function() {
        return Projects.find();    
	},
	members : function() {
		return Meteor.users.find();
	}
	/*
	,
	cards : function() {
		var projectId = Session.get("projectID");
		var oCards = Projects.find({'cards.$.project_id':projectId});
		console.log(oCards);
		Session.set("oCards", oCards);
		return oCards;
	}
	*/
});

Template.defaultP.events ({
	"submit .insert_card" : function(event) {
		event.preventDefault();
		var projectId = Session.get("projectID");
		var cardTitle = event.target.card_title.value;
		Meteor.call("insertCard", projectId, cardTitle);
		event.target.card_title.value = "";
	},
	"submit .delete_card" : function(event) {
		event.preventDefault();
	}
});



