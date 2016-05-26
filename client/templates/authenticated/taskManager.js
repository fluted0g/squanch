Template.taskManager.onCreated(function() {
	var instance = this;

	instance.autorun(function() {
		var projectId = Session.get("projectID");
		instance.subscribe('project', projectId);
		instance.subscribe('owner', projectId);
		instance.subscribe('members', projectId); 
	});
});

Template.taskManager.onRendered(function() {
	this.$('#picker-dueDate').datetimepicker();
	this.$("#descButton").hide();
});

Template.taskManager.helpers({
	task: function() {
		var taskId = Session.get("taskID");
		return Tasks.findOne({_id: taskId});
	},
	cards: function() {
		return Cards.find({status: 'active'});
	},
	comments: function() {
		return Comments.find({task_id:this._id});
	}
});

Template.taskManager.events({
	"submit .set_desc" : function(event) {
		event.preventDefault();
		var newDesc = event.target.editDesc.value;
		Meteor.call("editTaskDescription",oTask._id,newDesc);
	},
	"submit .set_label" : function(event) {
		event.preventDefault();

		var newLabel = event.target.editLabel.value;
		//determining project_type and reformatting for collection
		switch (newLabel) {
			case "Red" :
			newLabel = "redL";
			break;
			case "Green" :
			newLabel = "greenL";
			break;
			case "Blue" :
			newLabel = "blueL";
			break;
			case "Yellow" :
			newLabel = "yellowL";
			break;
			case "Orange" :
			newLabel = "orangeL";
			break;
			case "Purple" :
			newLabel = "purpleL";
			break;
		}
		Meteor.call("editTaskLabel",this._id,newLabel);
	},
	"submit .taskMover" : function(event) {
		event.preventDefault();
		var newCardId = $(event.target).find(':selected').data('id');		
		Meteor.call("editTaskCardId",this._id,newCardId);
	},
	"submit .set_name" : function(event) {
		event.preventDefault();
		console.log(this._id);
		var newName = event.target.editName.value;
		Meteor.call("editTaskName",this._id,newName);
	},
	'click .dateSetter' : function(event) {
		event.preventDefault();
		var dueDate = $('.datetimepicker').data("DateTimePicker").date().toDate();
		Meteor.call("editDueDate", this._id,dueDate);
	},
	"click .archiveTask": function(event) {
		event.preventDefault();
		var id = this._id;
		Meteor.call("toggleStatus","task",id);
		$("#modalTask").modal('hide');
	},
	"submit .new_comment" : function(event) {
		event.preventDefault();
		var taskId = this._id;
		var commentMsg = event.target.commentMsg.value;
		var author = Meteor.user().username;
		Meteor.call("newComment",taskId,commentMsg,author);
	},
	'click .editableContentSolid' : function(event) {
		var html = $(event.target).text().trim();

		if ($(event.target).prop("tagName") == "H4") {
			var editableText = $("<input class='editableContentFluid editableTaskName' name='editableTaskName' type='text' placeholder='"+html+"'>");
			editableText.val(html);
			$(event.target).replaceWith(editableText);
			$(".editableContentFluid").val(html);
			editableText.select();
		}
		else if ($(event.target).prop("tagName") == "SPAN") {
			var editableText = $("<textarea rows='4' cols='50' class='editableContentFluid editableTaskDescription' name='editableTaskDescription' type='text'></textarea>");
			editableText.val(html);
			$(event.target).replaceWith(editableText);
			$(".editableContentFluid").val(html);
			editableText.select();

			$("#descButton").show();
		}
	},
	'blur .editableContentFluid' : function(event) {    	
		var html = $(event.target).val().trim();

		if ($(event.target).prop("tagName") == "INPUT") {
			var viewableText = $("<h4 class='editableContentSolid editableTaskName'></h4>");
			if (html == "") {
				viewableText.html(this.name);
				$(event.target).replaceWith(viewableText);
			} else {
				viewableText.html(html);
				Meteor.call("editTaskName",this._id,html);
				$(event.target).replaceWith(viewableText);
			}
		}
		else if ($(event.target).prop("tagName") == "TEXTAREA") {
			if (html != "") {
				var viewableText = $("<span class='editableContentSolid editableTaskDescription'></span>");
				viewableText.html(html);
				Meteor.call("editTaskDescription",this._id,html);
				$(event.target).replaceWith(viewableText);
				$("#descButton").hide();
			}
			else {
				var viewableText = $("<span class='editableContentSolid editableTaskDescription'></span>");
				Meteor.call("editTaskDescription",this._id,html);
				viewableText.html("Task has no description.");
				$(event.target).replaceWith(viewableText);
				$("#descButton").hide();
			}
				
		}	
	},
	'submit .editableTaskNameForm' : function(event) {
		event.preventDefault(); 
		var html = $(event.target.editableTaskName).val().trim();
		var viewableText = $("<h4 class='editableContentSolid editableTaskName'></h4>");
		if (html == "") {
			viewableText.html(this.name);
			$(event.target.editableTaskName).replaceWith(viewableText);
		} else {
			viewableText.html(html);
			Meteor.call("editTaskName",this._id,html);
			$(event.target.editableTaskName).replaceWith(viewableText);
		}
	},
	'submit .editableTaskDescriptionForm' : function(event) {
		event.preventDefault(); 
		var html = $(event.target.editableTaskDescription).val().trim();

		if (html != "") {
			var viewableText = $("<span class='editableContentSolid editableTaskDescription'></span>");
			viewableText.html(html);
			Meteor.call("editTaskDescription",this._id,html);
			$(event.target.editableTaskDescription).replaceWith(viewableText);
			$("#descButton").hide();
		} else {
			var viewableText = $("<span class='editableContentSolid editableTaskDescription'></span>");
			Meteor.call("editTaskDescription",this._id,html);
			
			viewableText.html("Task has no description.");
			$(event.target.editableTaskDescription).replaceWith(viewableText);
			$("#descButton").hide();
		}
		
	}
});