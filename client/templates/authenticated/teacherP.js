 

Template.teacherP.onCreated( () => {
	Template.instance().subscribe( 'project',FlowRouter.getParam("_id") );
});

//Meteor.subscribe("projects",FlowRouter.getParam("_id") );

Template.teacherP.helpers ({

	project : function() {
		return Projects.find();
	}

});
