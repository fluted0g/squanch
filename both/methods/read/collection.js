Meteor.methods({
  readMethod( argument ) {
    check( argument, String );

    var project = Projects.findOne( argument );

    if ( !project ) {
      throw new Meteor.Error( 'project-not-found', 'No projects found matching this query.' );
    }

    return project;
  }
});
