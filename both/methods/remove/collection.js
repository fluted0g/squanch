Meteor.methods({
  removeMethod( argument ) {
    check( argument, String );

    try {
      Projects.remove( argument );
    } catch( exception ) {
      return exception;
    }
  }
});
