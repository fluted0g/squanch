Meteor.publish('projects', function() {
	if (this.userId) {
		var userId = this.userId;
		userProjects = Projects.find( {members: {$in:[userId]}} );
		if ( userProjects ) {
			return userProjects;
		}
	}
	return this.ready();
});

Meteor.publish('membershipProjects', function() {
	if (this.userId) {
		userProjectsIds = Meteor.users.findOne({_id:this.userId},{fields: {project_ids:1}});
		userMembershipProjects = Projects.find({_id: {$in : userProjectsIds.project_ids}});
		if (userMembershipProjects) {
			return userMembershipProjects;
		}
	}
	return this.ready();
});

Meteor.publish('ownedProjects', function() {
	if (this.userId) {
		var id = this.userId;
		userProjects = Projects.find({owner : id});
		if (userProjects) {
			return userProjects;
		}
	}
	return this.ready();
});

Meteor.publish('project',function(project_id) {

	var userId = this.userId;
	check(project_id,String);
	//find project and his cards
	curr_project = Projects.find({_id: project_id });
	project_cards = Cards.find({project_id: project_id},{sort:{cardIndex:1}});
	//check user is member or owner
	var fetchedProject = Projects.findOne({_id: project_id });
	var isOwner;
	if (fetchedProject.owner == this.userId) {
		isOwner = true;
	} else {
		isOwner = false;
	}
	var isMember = Meteor.users.findOne({ _id:this.userId , project_ids: project_id});
	var cardIds = [];
	arrangedCards = project_cards.fetch();
	_.each(arrangedCards, function(card) {
		cardIds.push(card._id);
	});

	var project_tasks = Tasks.find({ card_id : { $in: cardIds}},{sort:{taskIndex:1,updatedAt:1}});
	var taskIds = [];
	arrangedTasks = project_tasks.fetch();
	_.each(arrangedTasks, function(task) {
		taskIds.push(task._id);
	});
	tasks_comments = Comments.find({ task_id : { $in: taskIds}},{sort:{createdAt:1}});

	if (isOwner || isMember) {
		if(curr_project) {
			return [
			curr_project,
			project_cards,
			project_tasks,
			tasks_comments
			];
		}
	}
	return this.ready();
});

Meteor.publish('members',function(projectId) {
	check(projectId,String);
	var members = Meteor.users.find({project_ids : {$in: [projectId]}}, {fields: {services:0}});
	if (members) {
		return members;
	}
	return this.ready();
});

Meteor.publish('owner',function(projectId) {
	check(projectId,String);
	var project = Projects.find({_id:projectId});
	var owner = Meteor.users.find({_id:project.owner},{fields:{services:0}});
	if (owner) {
		return owner;
	}
	return this.ready();
});

Meteor.publish('user',function() {
	var userId = this.userId;

	user = Meteor.users.find({_id:userId},{fields:{services:0}});

	if (user) {
		return user;
	}
	return this.ready();
});

Meteor.publish('taskMembers', function(taskId) {
	check(taskId, String);
	var task = Tasks.findOne({_id:taskId});
	if (task.members) {
		var members = Meteor.users.find({_id: { $in: task.members } });
		return members;
	}
	return this.ready();
});

//###########################################################//
//###########################################################//
//###########################################################//

Meteor.methods({
	//user related
	editUserProfile : function(objProfile) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(objProfile, Object);
		return Meteor.users.update({_id:Meteor.userId()},{$set: {profile:objProfile}});
	},
	addMember : function(projectId,nameOrMail) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(projectId, String);
		check(nameOrMail, String);
		var member;
		member = Accounts.findUserByUsername(nameOrMail);
		if (!member) {
			member = Accounts.findUserByEmail(nameOrMail);
		}
		var memberExists = Meteor.users.findOne({ _id: member._id, project_ids : { $in: [projectId] } }, { fields : { services : 0} });
		if (memberExists) {
			throw new Meteor.error("member-exists");
		} else {
			Meteor.users.update({ _id : member._id },{ $push: {project_ids : projectId} });
			Projects.update({_id:projectId},{$push:{members:member._id}});
		}	
	},
	removeMember : function(projectId, nameOrMail) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(projectId, String);
		check(nameOrMail, String);
		var member = Accounts.findUserByUsername(nameOrMail);
		if (!member) {
			member = Accounts.findUserByEmail(nameOrMail);
		}
		var isOwner = Projects.findOne({_id:projectId, owner:member._id});
		if (Meteor.userId() == member._id) {
			var isSelf = true;
		}

		if (!isSelf) {
			Meteor.users.update({_id : member._id },{ $pull : { project_ids : { $in : [projectId]}} });
			Projects.update({_id:projectId},{$pull:{members:member._id}});
		} else {
			throw new Meteor.error("invalid-target");
		}
	},
	isUser : function(nameOrMail) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(nameOrMail, String);
		var member = Accounts.findUserByUsername(nameOrMail);
		if (!member) {
			member = Accounts.findUserByEmail(nameOrMail);
		}
		if (member) {
			return true;
		} else if (!member) {
			throw new Meteor.error("user-not-exists");
		}
	},
	changeUsername : function(nameOrMail,newUsername) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(nameOrMail, String);
		check(newUsername, String);

		var member = Accounts.findUserByUsername(nameOrMail);
		if (!member) {
			member = Accounts.findUserByEmail(nameOrMail);
		}

		if (!member) {
			throw new Meteor.error("not-found");
		}

		if (member._id == Meteor.user()._id) {
			Meteor.users.update({_id:member._id}, {$set:{username:newUsername}});
		} else {
			throw new Meteor.error("not-authorized");
		}

	},
	//project related
	newProject : function(name,description,proj_type,theme) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(name, String);
		check(description, String);
		check(proj_type,String);
		check(theme,String);

		return Projects.insert({
			name: name,
			owner: Meteor.userId(),
			description: description,
			proj_type: proj_type,
			theme: theme,
			members: [Meteor.userId()]
		},function(err,doc) {
			Meteor.users.update({ _id : Meteor.userId() },{ $push: {project_ids : doc} });
		});
	},
	deleteProject : function(projectId) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(projectId,String);
		var userId = Meteor.userId();
		var project = Projects.findOne({_id:projectId});
		if (project.owner == userId) {
			Projects.remove({_id:projectId});
			Meteor.users.update({_id:userId},{$pull:{project_ids:projectId}});
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	editProjectName : function(projectId,input) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}		
		check(projectId, String);
		check(input, String);
		var project = Projects.findOne({_id:projectId});
		if (project) {
			Projects.update({_id:projectId},{$set:{name:input}});
		} else {
			throw new Meteor.error("invalid-target")
		}
	},
	//card related
	insertCard : function(projectId,cardName) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}		
		check(projectId, String);
		check(cardName, String);
		var status = "active";
		var oCard = {
			project_id: projectId,
			name: cardName,
			status: status
		}
		Cards.insert(oCard);
	},
	editCardName : function(cardId,input) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(cardId,String);
		check(input,String);
		var card = Cards.findOne({_id:cardId});
		if (card) {
			Cards.update({_id:cardId},{$set:{name:input}});
		} else {
			throw new Meteor.error("invalid-target")
		}
	},
	editCardLabel : function(cardId, input) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(cardId,String);
		check(input,String);
		var card = Cards.findOne({_id:cardId});
		if(card) {
			Cards.update({_id:cardId},{$set:{label:input}});
		} else {
			throw new Meteor.error("invalid-target")
		}
	},
	assignCardIndex : function(cardId, input) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(cardId, String);
		check(input, Number);
		Cards.update({_id:cardId}, {$set:{cardIndex:input} } );
	},
	archiveAllCards: function(projectId) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(projectId, String);
		var cards = Cards.find({project_id:projectId});
		if (cards) {
			Cards.update({project_id:projectId}, { $set : {status:'archived'}},{multi:true});
		}
	},
	//task related
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
	newTask : function(cardId,taskName) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(taskName, String);
		check(cardId, String);
		var userId = Meteor.userId();
		var status = "active";
		var label = "default";
		var oTask = {
			name: taskName,
			card_id: cardId,
			status: status,
			label: label,
			author: userId
		}
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
	editTaskLabel : function(taskId,input) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(taskId, String);
		check(input, String);
		Tasks.update({'_id':taskId},{$set:{'label': input}});
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
	//task and card related
	toggleStatus: function(type,id) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(type,String);
		check(id,String);
		if (type == "card") {
			card = Cards.findOne({_id:id});
			if (card.status == 'active') {
				Cards.update({'_id':id},
					{$set: {status: 'archived',cardIndex:999}
				});
			} else {
				Cards.update({'_id':id},
					{$set: {status: 'active'}
				});
			}
		} else if (type =="task") {
			task = Tasks.findOne({_id:id});
			if (task.status == 'active') {
				Tasks.update({'_id':id},
					{$set: {status: 'archived',taskIndex:999}
				});
			} else {
				Tasks.update({'_id':id},
					{$set: {status: 'active'}
				});
			}
		}
	},
	//task comments
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