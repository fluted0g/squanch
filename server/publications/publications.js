Meteor.publish('projects', function() {
	var id = this.userId;
	userProjects = Projects.find( { 'members' :  { $in:  [id] } } );

	if ( userProjects ) {
		return userProjects;
	}
	return this.ready();
});

Meteor.publish('membershipProjects', function() {
	userProjectsIds = Meteor.users.find({_id:this.userId},{fields: {project_ids:1}});
	console.log(userProjectsIds);
	userMembershipProjects = Projects.find({_id: {$in : userProjectsIds}});

	if (userMembershipProjects) {
		return userMembershipProjects;
	}
	return this.ready();
});

Meteor.publish('ownedProjects', function() {
	var id = this.userId;
	userProjects = Projects.find({owner : id});

	if (userProjects) {
		return userProjects;
	}
	return this.ready();
});

Meteor.publish('project',function(project_id) {
	var userId = this.userId;
	check(project_id,String);
	//find project and his cards
	curr_project = Projects.find({_id: project_id });
	project_cards = Cards.find({project_id: project_id});
	//check user is member or owner
	var isOwner;
	if (curr_project.owner == this.userId) {
	 	isOwner = true;
	} else {
		isOwner = false;
	}
	var isMember = Meteor.users.find({ _id:this.userId , projects_ids: {$in : project_id} });
	var cardIds = [];
	arrangedCards = project_cards.fetch();
	_.each(arrangedCards, function(card) {
		cardIds.push(card._id);
	});
	test_tasks = Tasks.find({'card_id' : { $in: cardIds}});
	if (isOwner || isMember) {
		if(curr_project) {
			return [
			curr_project,
			project_cards,
			test_tasks
			];
		}
	}
	return this.ready();
});
/*
Meteor.publish('users', function() {
	var allUsers = Meteor.users.find({},{fields:{username:1,emails:1,profile:1}});

	if (allUsers) {
		return allUsers;
	}
	return this.ready();
});
*/
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

//###########################################################//
//###########################################################//
//###########################################################//

Meteor.methods({
	//user related
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
		var isOwner = Projects.findOne({_id:projectId,owner:member._id});
		
		if (Meteor.userId() == member._id) {
			var isSelf = true;
		}
		if (!isOwner || !isSelf) {
			Meteor.users.update({_id : member._id },{ $pull : { project_ids : { $in : [projectId]}} });
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
	//general purpose
	newProject : function(name,description,proj_type,theme) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(name, String);
		check(description, String);
		check(proj_type,String);
		check(theme,String);

		Projects.insert({
			name: name,
			owner: Meteor.userId(),
			description: description,
			proj_type: proj_type,
			theme: theme
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
		} else {
			throw new Meteor.Error("not-authorized");
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
	//task related
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
	//not sure how this worked
	editTask : function(oTask) {
		
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(oTask, Object);

		var taskId = oTask._id;

		Tasks.update({'_id':taskId},
			{
			$set: {
				'name': oTask.name,
				'description' : oTask.description,
				'card_id' : oTask.card_id, 
				'createdAt' : oTask.createdAt,
				'dueTo' : oTask.dueTo,
				'label' : oTask.label,
				'status' : oTask.status,
				'author' : oTask.author,
				'events' : oTask.events,
				'members' : oTask.members,
				'comments' : oTask.comments
			}		
		});	
	},
	editTaskName : function(taskId,input) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(taskId, String);
		check(input, String);

		Tasks.update({'_id':taskId},
		{
			$set: {'name': input}
		});
	},
	editTaskDescription : function(taskId,input) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(taskId, String);
		check(input, String);

		Tasks.update({'_id':taskId},
		{
			$set: {'description': input}
		});
	},
	//supongamos que cambiamos una cosa cada vez
	editTaskLabel : function(taskId,input) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(taskId, String);
		check(input, String);

		Tasks.update({'_id':taskId},
		{
			$set: {'label': input}
		});
	},
	editTaskCardId : function(taskId,input) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(taskId, String);
		check(input, String);

		Tasks.update({'_id':taskId},
		{
			$set: {'card_id': input}
		});
	},
	editDueDate : function(taskId, input) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(taskId, String);
		check(input, Date);

		Tasks.update({'_id':taskId},
		{
			$set: {'dueDate': input}
		});
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
							{$set: {status: 'archived'}
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
							{$set: {status: 'archived'}
				});
			} else {
				Tasks.update({'_id':id},
							{$set: {status: 'active'}
				});
			}
		}
	},
	//task comments
	newComment : function(taskId,msg,author) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(taskId,String);
		check(msg,String);
		check(author,String);

		var comment = {
			text: msg,
			author: author
		};

		Tasks.update({_id:taskId},{$push : {comments: comment}});
	}
});