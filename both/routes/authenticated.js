const authenticatedRoutes = FlowRouter.group({
	name: 'authenticated'
});

authenticatedRoutes.route( '/', {
	name: 'projects',
	action() {
		BlazeLayout.render( 'default', { yield: 'projects' } );
	}
});

authenticatedRoutes.route( '/profile', {
	name: 'profile',
	action() {
		BlazeLayout.render( 'default', { yield: 'profile' } );
	}
});

const projectRoutes = authenticatedRoutes.group({
	prefix: '/projects',
	name: 'project_routes'
});

projectRoutes.route('/:_id', {
	name: 'project_page', /*
	subscriptions: function (params) {
		this.register('projects', params._id);
	},*/
	action: function() {
		var proj_type = Session.get("proj_type");
		switch (proj_type) {
			case "defaultP":
			BlazeLayout.render('default', {yield:'defaultP'});
			break;
			case "studentP":
			BlazeLayout.render('default', {yield:'studentP'});
			break;
			case "teacherP":
			BlazeLayout.render('default', {yield:'teacherP'});
			break;
			default:
			BlazeLayout.render('default', {yield:'defaultP'});
			break;
		}
	}
});
