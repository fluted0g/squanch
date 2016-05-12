Meteor.publish( 'projects', function() {
	var id = this.userId;
	userProjects = Projects.find( { 'members' :  { $in:  [id] } } );

	if ( userProjects ) {
		return userProjects;
	}
	return this.ready();
});

Meteor.publish('project',function(id) {
	var userId = this.userId;
	check(id,String);

	//find project and his cards
	curr_project = Projects.find( { 'members' :  { $in: [userId] } , '_id': id } );
	project_cards = Cards.find({'project_id': id});

	//find all tasks belonging to the project cards
	var cardIds = [];
	arrangedCards = project_cards.fetch();
	_.each(arrangedCards, function(card) {
		cardIds.push(card._id);
	});
	test_tasks = Tasks.find({'card_id' : { $in: cardIds}});

	if(curr_project) {
		return [
		curr_project,
		project_cards,
		test_tasks
		];
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

Meteor.publish('members', function(projectId) {
	check(projectId,String);

	var project = Projects.find({_id: projectId}).fetch()[0];
	console.log(project.members);

	var projectMembers = Meteor.users.find({ '_id' : { $in : project.members } },{ fields : {services : 0 } });
	if (projectMembers) {
		return projectMembers;
	}
	return this.ready();
});

//###########################################################//
//###########################################################//
//###########################################################//

Meteor.methods({
	//user related
	addMember : function(projectId, memberNameOrMail) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(projectId, String);
		check(memberNameOrMail, String);

		var member;
		member = Accounts.findUserByUsername(memberNameOrMail);
		if (!member) {
			member = Accounts.findUserByEmail(memberNameOrMail);
		}
		var memberId = member._id;
		var memberExists = Projects.findOne({ _id: projectId, members : { $in: [memberId] } }, { fields : { members : 1} });
		
		if (memberExists) {
			throw new Meteor.error("member-exists");
		} else {
			Projects.update({ _id : projectId },{ $push: {members : memberId} });
		}	
	},
	removeMember : function(projectId, memberNameOrMail) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(projectId, String);
		check(memberNameOrMail, String);

		var member = Accounts.findUserByUsername(memberNameOrMail);
		if (!member) {
			member = Accounts.findUserByEmail(memberNameOrMail);
		}
		var memberId = member._id;
		var isOwner = Projects.findOne({_id:projectId,owner:memberId});
		
		if (Meteor.userId() == memberId) {
			var isSelf = true;
		}
		if (!isOwner || !isSelf) {
			Projects.update({_id : projectId },{ $pull : { members : { $in : [memberId]}} });
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

		//console.log(member);
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
			theme: theme,
			members : [Meteor.userId()]
		});
	},
	deleteProject : function(projectId) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		check(projectId,String);
		var userId = Meteor.userId();

		var project = Projects.findOne({_id:projectId});
		//console.log(project.owner);
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
	}
});