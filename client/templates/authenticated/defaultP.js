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
	},
	cards : function() {
		var projectId = Session.get("projectID");
		return Cards.find({'status' : 'active','project_id':projectId});
	}
});

Template.defaultP.events ({
	"submit .insert_card" : function(event) {
		event.preventDefault();
		var projectId = Session.get("projectID");
		var cardTitle = event.target.card_title.value;
		if (cardTitle != "") {
			Meteor.call("insertCard", projectId, cardTitle);
			event.target.card_title.value = "";
			
			$(".cardInserter").toggleClass("activeC");
			$(".submitCard, .cancelFormC, .card_title, .fake_card_title").toggleClass("hiddenE");
		}
	},
	"click .fake_card_title" : function(event) {
		$(".cardInserter").toggleClass("activeC");
		$(".submitCard, .cancelFormC, .card_title, .fake_card_title").toggleClass("hiddenE");
		$(".card_title").select();
	},
	"click .cancelFormC" : function(event) {
		$(".cardInserter").toggleClass("activeC");
		$(".submitCard, .cancelFormC, .card_title, .fake_card_title").toggleClass("hiddenE");
	}
});



