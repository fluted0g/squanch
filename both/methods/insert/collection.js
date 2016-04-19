Meteor.methods({
  insertMethod( argument ) {
    check( argument, Object );

    try {
      var projectId = Projects.insert( argument );
      return projectId;
    } catch( exception ) {
      return exception;
    }
  }
});
