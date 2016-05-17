Template.comment.onCreated(function() {
  var instance = this;
  
  instance.autorun(function() {
  });
});

Template.comment.onRendered(function() {
});

Template.registerHelper("prettifyDate", function(timestamp) {
    return new Date(timestamp).toDateString();
});

Template.comment.helpers({
	authorship : function() {
		return Meteor.users.findOne({_id:this.author});
	},
	showDate : function() {
		if (!this.updatedAt) {
			var date = this.createdAt.toDateString();
			return date;
		} else {
			var date = this.updatedAt.toDateString();
			return date;
		}
	}
});

Template.comment.events({
	"click .editComment" : function(e) {

	},
	"click .deleteComment" : function(e) {

	}
});