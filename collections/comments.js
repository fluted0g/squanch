Comments = new Mongo.Collection( 'comments' );

Comments.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Comments.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

CommentSchema = new SimpleSchema({
  task_id : {
    type: String,
    label: "task ID"
  },
  text: {
    type: String,
    label: "Comment text"
  },
  author : {
    type : String,
    label: "author username"
  },
  createdAt: {
    type: Date,
    label: "comment creation date",
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
  	label: "comment last update",
  	autoValue: function() {
  		if (this.isUpdate) {
  			return new Date();
  		}
  	},
  	optional: true
  }
});

Comments.attachSchema( CommentSchema );