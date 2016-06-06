//BlazeLayout.setRoot('.backgrounder');

Template.signup.onRendered( () => {
  Modules.client.signup({
    form: "#signup",
    template: Template.instance()
  });
});

Template.signup.events({
  'submit form': ( event ) => {
  	event.preventDefault();
  	return Meteor.call("validateEmailAdress", user.email, function(error, response) {});
  }
});
