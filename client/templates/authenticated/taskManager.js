Template.taskManager.onCreated(function() {
	var instance = this;

	instance.autorun(function() {
		var projectId = Session.get("projectID");		
        var taskId = Session.get("taskID");

		instance.subscribe('project', projectId);
		instance.subscribe('owner', projectId);
		instance.subscribe('members', projectId);
        instance.subscribe('taskMembers',taskId);
	});
});

Template.taskManager.onRendered(function() {
	this.$('#picker-dueDate').datetimepicker({
		inline: true,
		sideBySide: false,
		toolbarPlacement: 'top'
	});

	$('.browse_date').html(moment().format('LLL'));
    $('#picker-dueDate').on('dp.change', function() {
    	browsing = $('#picker-dueDate').data("DateTimePicker").viewDate();
    	formatBrowse = moment(browsing).format('LLL');
    	$('.browse_date').html(formatBrowse);
    });

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
	isActualCard : function() {
		var taskId = Session.get("taskID");
		task = Tasks.findOne({_id: taskId});
		if (task.card_id == this._id) {
			return true;
		} else {
			return false;
		}
	},
	comments: function() {
		return Comments.find({task_id:this._id},{sort:{createdAt:-1}});
	},
	hasComments: function() {
		comments = Comments.find({task_id:this._id}).fetch();
		if (comments.length > 0) {
			return true;
		} else {
			return false;
		}
	},
	dueDateDisplay : function() {
		displayDate = moment(new Date(this)).format('MMMM Do YYYY, h:mm a');
		if (displayDate != 'Invalid date') {
			return displayDate;
		} else {
			return "Due date not set.";
		}
		
	},
	timeLeft : function() {
		return moment(this).fromNow();
	},
    colorDate : function() {
        dueDate = moment(this);
        now = moment();
        timeToDate = dueDate.diff(now,'days',true);        
        if (timeToDate < 0 ) {
            dateClass ="due-border";
        } else if ( timeToDate > 0 &&  timeToDate < 8 ) {
            dateClass ="lt-week-left-border";
        } else if ( timeToDate > 8 &&  timeToDate < 30 ) {
            dateClass ="gt-week-left-border";
        } else {
            dateClass ="no-rush-border";
        }
        return dateClass;
    },
    projectMembers: function() {
        return Meteor.users.find({});
    },
    taskMembers : function() {
    	if (this.members) {
    		return Meteor.users.find({_id: { $in: this.members }});
    	}
    },
    isMember : function() {
    	var isMember = false;
    	var memberId = this._id;
    	var taskId = Session.get("taskID");
    	var task =  Tasks.findOne({_id: taskId});
    	_.each (task.members, function(item) {
    		if (item == memberId) {
    			isMember = true;
    		}
    	});
    	return isMember;
    },
    isActive : function() {
    	if (this.active == true) {
    		return true;
    	} else {
    		return false;
    	}
    },
    activeLabels: function() {
        var labels = [];
        _.each(this.labels, function(label) {
            if (label.active == true) {
                labels.push(label);
            }
        });
        if (labels.length > 0) {
            return labels;
        }
    }
});

Template.taskManager.events({
	'click .card_target' : function(event) {
		var newCardId = $(event.target).data("id");	
		var taskId = Session.get("taskID");
		Meteor.call("editTaskCardId",taskId,newCardId);
	},
	'submit .set_name' : function(event) {
		event.preventDefault();
		var newName = event.target.editName.value;
		Meteor.call("editTaskName",this._id,newName);
	},
	'click .dateSetter' : function(event) {
		event.preventDefault();
		var dueDate = $('.datetimepicker').data("DateTimePicker").date().toDate();
		Meteor.call("editDueDate", this._id,dueDate);
	},
	'click .dateRemover' : function(event) {
		event.preventDefault();
		Meteor.call("removeDueDate",this._id);
	},
	'click .archiveTask': function(event) {
		event.preventDefault();
		var id = this._id;
		Meteor.call("toggleStatus","task",id);
		$("#modalTask").modal('hide');
	},
	'submit .new_comment' : function(event) {
		event.preventDefault();
		var taskId = this._id;
		var commentMsg = event.target.commentMsg.value;
		var author = Meteor.user().username;
		if (commentMsg != "") {
			Meteor.call("newComment",taskId,commentMsg,author);
			event.target.commentMsg.value = "";
		}
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
			var editableText = $("<textarea rows='2' cols='40' class='editableContentFluid editableTaskDescription' name='editableTaskDescription' type='text'></textarea>");
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
	},
    'click .add_task_member' : function(event) {
        var taskId = Session.get("taskID");
        var memberName = this.username;
        Meteor.call("addTaskMember",taskId,memberName);
    },
    'click .delete_task_member' : function(event) {
        var taskId = Session.get("taskID");
        var memberName = this.username;
        Meteor.call("removeTaskMember",taskId,memberName);
    },
    'click .label_picker' : function(e) {

    	taskId = Session.get("taskID");
    	Meteor.call("toggleLabel",taskId,this.color,!this.active);

    },
    'click .label_editor' : function(e) {
    	if ($(".label_text[data-id="+this.color+"]").hasClass("hiddenE")) {
    		$(".label_picker[data-id="+this.color+"]").css("display","none");
    		$(".label_text[data-id="+this.color+"]").toggleClass("hiddenE");
    		$(".label_text[data-id="+this.color+"]").focus();
    	}/*else {
    		//text = $(".label_text[data-id="+this.color+"]").val();
    		//labelColor = this.color;
    		//taskId = Session.get("taskID");
    		//Meteor.call("setLabelText",taskId,labelColor,text, function(error,success) {
    		//	if (success) {
    				$(".label_picker[data-id="+this.color+"]").css("display","inline-block");
    				$(".label_text[data-id="+this.color+"]").toggleClass("hiddenE");
    		//	}
    		//});	
    	}*/
    },
    'blur .label_text' : function(e) {
    	text = e.currentTarget.value;
    	labelColor = this.color;
    	taskId = Session.get("taskID");
    	Meteor.call("setLabelText",taskId,labelColor,text, function(error,success) {
    		if (success) {
    			$(".label_picker[data-id="+labelColor+"]").css("display","inline-block");
    			$(".label_text[data-id="+labelColor+"]").toggleClass("hiddenE");
    		}
    	});
    }
});