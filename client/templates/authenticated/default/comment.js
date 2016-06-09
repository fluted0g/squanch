Template.comment.onCreated(function() {
	var instance = this;

	instance.autorun(function() {
  	//var projectId = Session.get("projectID");
  	//instance.subscribe("project",projectId);
  });
});

Template.comment.onRendered(function() {
});

Template.comment.helpers({
	authorship : function() {
		return Meteor.users.findOne({_id:this.author});
	},
	isAuthor : function() {
		if (Meteor.user()._id == this.author) {
			return this;
		} else {
			return false;
		}
	},
	showDate : function() {
		if (!this.updatedAt) {
			var date = this.createdAt;
			displayDate = moment(new Date(date)).format('MMMM Do YYYY, h:mm a');
			prefix = "Created: ";
			result = prefix.concat(displayDate);
			return result;
		} else {
			var date = this.updatedAt;
			displayDate =  moment(new Date(date)).format('MMMM Do YYYY, h:mm a');
			prefix = "Last update: ";
			result = prefix.concat(displayDate);
			return result;
		}
	}
});

Template.comment.events({
	'click .toggle_edition' : function(e) {
		if (Meteor.user()._id == this.author) {
			dataId = this._id;
			target = $('.comment_text[data-id='+dataId+']');
			var html = target.text().trim();
			if ($(target).prop("tagName") == "SPAN") {
				var editableText = $("<textarea rows='2' cols='50' class='comment_text is_textarea' data-id='"+dataId+"' name='toggle_edition' type='text'>"+html+"</textarea>");
				$(target).replaceWith(editableText);
				editableText.select();
				//$('.edit_comment[data-id='+dataId+']').css('display','block');
			} else if ($(target).prop("tagName") == "TEXTAREA") {
				newMsg = $(target).val().trim();
				if (newMsg != "") {
					Meteor.call("editComment",dataId,newMsg);
					editableText = $('<span class="comment_text is_span" data-id="'+dataId+'">'+newMsg+'</span>');
					$(target).replaceWith(editableText);
				}
				//$('.edit_comment[data-id='+dataId+']').css('display','none');
			}
		} else if (Meteor.user()._id != this.author) {
			Bert.alert("You can't change other people's comments","danger");
		}
	},
	'click .delete_comment' : function(e) {
		if (Meteor.user()._id == this.author) {
			commentId = this._id;
			Meteor.call("deleteComment",commentId);
		} else if (Meteor.user()._id != this.author) {
			Bert.alert("You can't change other people's comments","danger");
		}
	}
});