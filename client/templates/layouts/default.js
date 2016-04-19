const handleRedirect = ( routes, redirect ) => {
	let currentRoute = FlowRouter.getRouteName();
	if ( routes.indexOf( currentRoute ) > -1 ) {
		FlowRouter.go( redirect );
		return true;
	}
};

Template.default.helpers({
	loggingIn() {
		return Meteor.loggingIn();
	},
	authenticated() {
		return !Meteor.loggingIn() && Meteor.user();
	},
	redirectAuthenticated() {
	 	return handleRedirect([
			'login',
			'signup',
			'recover-password',
			'reset-password'
		], '/' );
	},
	redirectPublic() {
		return handleRedirect([
			'projects',
			'profile'
		], '/login' );
	}
});

Template.default.events({
	'click .editable' : function() {
		console.log($(event.currentTarget));
		console.log($(event.target));
		console.log($(event.target).get(0).tagName);

		if ($(event.target).get(0).tagName == 'SPAN') {
			console.log("I'm a span");

			var $input = $("<input>", {
        	val: $(event.target).text(),
        	type: "text",
        	class: "editable"
    		});
    		$(event.target).replaceWith($input);
    		$input.select();

    		//this has to be another EVENT:

    		//$input.on("blur", switchToSpan);

		}
	},
	'blur .editable' : function() {
		if ($(event.target).get(0).tagName == 'INPUT') {
			console.log("I'm an input");

			var $span = $("<span>", {
        		text: $(event.target).val(),
        		class: "editable"
    		});
   			$(event.target).replaceWith($span);
		}
	}
});
