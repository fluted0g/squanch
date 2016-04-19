Meteor.methods({
  updateMethod( argument ) {
    check( argument, Object );

    try {
      var projectId = Projects.update( argument._id, {
        $set: { 'key': argument.key }
      });
      return projectId;
    } catch( exception ) {
      return exception;
    }
  }
});
