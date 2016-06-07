const handleRedirect = ( routes, redirect ) => {
	let currentRoute = FlowRouter.getRouteName();
	if ( routes.indexOf( currentRoute ) > -1 ) {
		FlowRouter.go( redirect );
		return true;
	}
};

Template.default.onCreated(function() {
  var instance = this;

  instance.autorun(function() {
  		var logged = Session.get("loggedUser");
  		if (logged /*Meteor.user()._id*/) {
  			instance.subscribe('user');
  		}
    });
});

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
	'click .editableContent' : function() {
		
		if ($(event.target).get(0).tagName == 'SPAN') {
			var $input = $("<input>", {
        	val: $(event.target).text(),
        	type: "text",
        	class: "editableContent"
    		});
    		$(event.target).replaceWith($input);
    		$input.select();
		}
	},
	'blur .editableContent' : function() {
		if ($(event.target).get(0).tagName == 'INPUT') {
			console.log("I'm an input");

			var $span = $("<span>", {
        		text: $(event.target).val(),
        		class: "editableContent"
    		});
   			$(event.target).replaceWith($span);
		}
	}
});
