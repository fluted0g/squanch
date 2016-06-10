Template.header.helpers({
  brandLink() {
    let login = FlowRouter.path( 'login' ),
        index = FlowRouter.path( 'projects' );
    return !Meteor.loggingIn() && !Meteor.userId() ? login : index;
  }
});

Template.header.events({
  'click .logout' : function(e) {
    e.preventDefault();
    Meteor.logout( ( error ) => {
      if ( error ) {
        Bert.alert( error.reason, 'danger' );
      } else {
        Bert.alert( TAPi18n.__('bertLogout'), 'success' );
        Session.set("loggedUser",false);
        FlowRouter.go('/login');
      }
    });
  }
});
