Tasks = new Mongo.Collection( 'tasks' );

Tasks.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Tasks.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

//track activity in the task (NOT IMPLEMENTED)
Event = new SimpleSchema({
  event_id : {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    autoValue: function(){ return Random.id(); }
  },
  type: {
    type: String,
    label: "event type"
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
  author: {
    type : String,
    label: "author username"
  }
});

Label = new SimpleSchema({
  color: {
    type: String,
    label: "Label color"
  },
  text: {
    type: String,
    label: "Label text",
    optional: true
  },
  active: {
    type: Boolean,
    label: "Label activeness",
    autoValue: function() {
      if (this.isInsert) {
        return false;
      } else if (this.isUpsert) {
        return {$setOnInsert: false};
      }
    }
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
  dueDate: {
    type: Date,
    label: "Task due date",
    optional: true
  },
  labels : {
    type: [Label],
    optional: true
  },
  status : {
    type: String,
    label: "Task status"
  },
  author: {
    type:String,
    label: "Task author"
  },
  taskIndex: {
    type: Number,
    label: "Task index",
    optional: true,
    autoValue: function() {
      if (this.isInsert) {
        return 999;
      }
    }
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
  }
});

Tasks.attachSchema( TaskSchema );