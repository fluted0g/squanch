Template.studentP.onCreated( () => {
	Template.instance().subscribe( 'project',FlowRouter.getParam("_id") );
});

//Meteor.subscribe("projects",FlowRouter.getParam("_id") );

Template.studentP.helpers ({

	project : function() {
		return Projects.find();
	}

});