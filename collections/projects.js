Projects = new Mongo.Collection( 'projects' );

Projects.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Projects.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

ProjectSchema = new SimpleSchema({
  name: {
    type: String,
    label: "Project name"
  },
  description: {
    type: String,
    label: "Project description",
    optional: true
  },
  proj_type: {
    type: String,
    label: "Project type"
  },
  theme: {
    type: String,
    label: "Project theme"
  },
  createdAt: {
    type: Date,
    label: "Project creation date",
    autoValue: function(){
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();
      }
    }
  },
  updatedAt: {
    type: Date,
    label: "last update",
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert : true,
    optional: true
  },
  owner: {
    type:String,
    label: "Project owner ID"
  },
  members: {
    type: [String],
    label: "Project members",
    optional: true
  }
});



Projects.attachSchema( ProjectSchema );
