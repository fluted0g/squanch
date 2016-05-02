Projects = new Mongo.Collection( 'projects' );

Projects.allow({
  insert: () => true,
  update: () => true,
  remove: () => true
});

Projects.deny({
  insert: () => false,
  update: () => false,
  remove: () => false
});
/*
Member = new SimpleSchema({
  memberId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  memberSince: {
    type: Date,
    label: "Member's primerito día",
    optional: true,
    autoValue: function(){
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();
      }
    }
  }

});
*/
Card = new SimpleSchema({
  _id: {    
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    autoValue: function(){ return Random.id(); }
  },
  project_id: {
    type: String,
    label: "Project ID"
  },
  name:{
    type: String,
    label: "Card title"
  },
  status:{
    type: String,
    label: "Card status"
  },
  label: {
    type: String,
    label: "Card status",
    optional: true
  }
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
  /*
  members: {
    type: [Member],
    label: "Project members",
    optional: true
  }
  */
  members : {
    type: [String],
    label: "Project members"
  },
  cards: {
    type: [Card],
    label: "Project cards",
    optional: true
  }
  
  /*,
  tasks: {
    type: [String],
    label: "Card tasks",
    optional: true
  }
  */
});



Projects.attachSchema( ProjectSchema );
