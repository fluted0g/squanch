Meteor.methods({ 
	addTaskMember : function(taskId,memberName) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(taskId, String);
		check(memberName, String);

		var member = Accounts.findUserByUsername(memberName);
		var task = Tasks.findOne({_id:taskId});
		var memberExists = false;

		_.each(task.members, function(item) {
			if (item == member._id) {
				memberExists = true;
			}
		});

		if (member && memberExists == false) {
			Tasks.update({_id:taskId},{$push:{members:member._id}});
		}
	},
	removeTaskMember : function(taskId,memberName) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(taskId, String);
		check(memberName, String);

		var member = Accounts.findUserByUsername(memberName);
		if (member) {
			Tasks.update({_id:taskId},{$pull:{members:member._id}});
		}
	},
	newTask : function(projectId,cardId,taskName) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(taskName, String);
		check(cardId, String);
		check(projectId, String);

		//check if another card exists, to find the existing labels
		projectCards = Cards.find({project_id:projectId}).fetch();
		var cardIds = [];
		_.each(projectCards, function(card) {
			cardIds.push(card._id);
		});
		existingTask = Tasks.findOne({card_id:{$in: cardIds}});

		//build the task object
		var userId = Meteor.userId();
		var status = "active";
		var oTask = {
			name: taskName,
			card_id: cardId,
			status: status,
			author: userId
		}
		//if task is not the first one, copy the label settings from another one
		//else, create the default labels
		if (existingTask) {
			oTask.labels = existingTask.labels;
		} else {
			oTask.labels = [{color:'#DA5347'},{color:'#75BA50'},{color:'#8E4585'},{color:'#FAD131'},{color:'#E87600'}];
		}
		//instert the task into mongo
		Tasks.insert(oTask);
	},
	moveAllTasks : function(parentCard,targetCard) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(parentCard, String);
		check(targetCard, String);
		var tasks = Tasks.find({card_id:parentCard});
		if (tasks) {
			Tasks.update({card_id:parentCard}, { $set : {card_id:targetCard}},{multi:true});
		}
	},
	archiveAllTasks: function(card) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(card, String);
		var tasks = Tasks.find({card_id:card});
		if (tasks) {
			Tasks.update({card_id:card}, { $set : {status:'archived'}},{multi:true});
		}
	},
	editTaskName : function(taskId,input) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(taskId, String);
		check(input, String);
		Tasks.update({'_id':taskId},{$set: {'name': input}});
	},
	editTaskDescription : function(taskId,input) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(taskId, String);
		check(input, String);
		if (input == "") {
			Tasks.update({'_id':taskId},{$unset:{description:""}});
		}
		else if(input =="Task has no description.") {
			Tasks.update({_id:taskId},{$unset:{description:"Task has no description."}});
		}
		else {
			Tasks.update({'_id':taskId},{$set: {'description': input}});
		}
	},
	toggleLabel : function(taskId, color, status) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(taskId, String);
		check(color, String);
		check(status, Boolean);
		
		Tasks.update({_id:taskId,'labels.color':color},{$set:{'labels.$.active':status}});
	},
	setLabelText : function(taskId, color, text) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(taskId, String);
		check(color, String);
		check(text, String);
		
		return Tasks.update({'labels.color':color},{$set:{'labels.$.text':text}},{multi:true});
	},
	editTaskCardId : function(taskId,input) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(taskId, String);
		check(input, String);
		Tasks.update({'_id':taskId},{$set: {'card_id': input}});
	},
	editDueDate : function(taskId, input) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(taskId, String);
		check(input, Date);
		Tasks.update({'_id':taskId},{$set: {'dueDate': input}});
	},
	removeDueDate : function(taskId) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(taskId, String);

		Tasks.update({_id:taskId},{$unset:{dueDate : ""}})
	},
	assignTaskIndex : function(taskId, input) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(taskId, String);
		check(input, Number);
		Tasks.update({_id:taskId},{$set:{taskIndex:input}});
	},
	//comment related
	newComment : function(taskId,msg,authorName) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(taskId,String);
		check(msg,String);
		check(authorName,String);
		authorId = Accounts.findUserByUsername(authorName);
		var oComment = {
			task_id: taskId,
			text: msg,
			author: authorId._id
		};
		if (authorId._id = Meteor.userId()) {
			Comments.insert(oComment);
		}
	},
	editComment: function(commentId,newMsg) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(commentId,String);
		check(newMsg,String);
		comment = Comments.findOne({_id:commentId});
		if (Meteor.userId() == comment.author) {
			Comments.update({_id:commentId},{$set: {text: newMsg}}); 
		} else {
			throw new Meteor.Error("not-authorized");
		}	
	},
	deleteComment: function(commentId) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(commentId,String);
		comment = Comments.findOne({_id:commentId});
		if (Meteor.userId() == comment.author) {
			Comments.remove({_id:commentId});
		} else {
			throw new Meteor.Error("not-authorized");
		}
	}
});