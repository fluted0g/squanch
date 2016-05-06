Tasks = new Mongo.Collection( 'tasks' );

Tasks.allow({
  insert: () => true,
  update: () => true,
  remove: () => true
});

Tasks.deny({
  insert: () => false,
  update: () => false,
  remove: () => false
});

//track activity in the task
//should be first to load I guess?
Event = new SimpleSchema({

  //update??, move, archive, copy, setDueDate...
  type: {
    type: String,
    label: "event type"
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
  author: {
    type : String,
    label: "author id"
  }
});
/*
//los miembros de task DEBERIAN poder pasarse desde projects
Member = new SimpleSchema({
  //con lo cual DEBERIAN venir con su id
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    autoValue: function(){ return Random.id(); }
  },
  name: {
    type: String,
    label:"Member name"
  },
  email: {
    type: String,
    label:"Member email"
  },
  memberSince: {
    type: Date,
    label: "Member's primerito día",
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

Comment = new SimpleSchema({
  _id : {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    autoValue: function(){ return Random.id(); }
  },
  text: {
    type: String,
    label: "Comment text"
  },
  author : {
    type : String,
    label: "author id"
  },
  createdAt: {
    type: Date,
    label: "createdAt"
  }
});

TaskSchema = new SimpleSchema({
  name: {
    type: String,
    label: "Task name"
  },
  description: {
    type: String,
    label: "Task description",
    optional: true
  },
  project_id : {
    type: String,
    label: "Project ID"
  },
  card_id : {
    type: String,
    label: "Card ID"
  },
  createdAt: {
    type: Date,
    label: "Task creation date",
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
  dueTo: {
    type: Date,
    label: "Task due date",
    optional: true
  },
  //red,yellow,green,buggy,
  label: {
    type: String,
    label: "Task label"
  },
  status : {
    type: String,
    label: "Task status"
  },
  author: {
    type:String,
    label: "Task author"
  },
  events: {
    type: [Event],
    label: "Task events",
    optional: true
  },
  members: {
    type: [String],
    label: "Task members ID's",
    optional: true
  },
  comments: {
    type: [Comment],
    label: "Task comments",
    optional: true
  }
});

Tasks.attachSchema( TaskSchema );
