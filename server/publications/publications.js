
/*
Meteor.publish( 'template', function() {
	return Projects.find( { 'owner': this.userId } );
});
*/


//Publication for all user's projects
//Members not supported
Meteor.publish( 'projects', function() {
	var id = this.userId;
	userProjects = Projects.find( { 'members' :  { $elemMatch: { '_id' : id} } } );

	if ( userProjects ) {
		return userProjects;
	}

	return this.ready();
});


//Publication of single project
Meteor.publish('project',function(id) {
	var userId = this.userId;
	check(id,String);
	curr_project = Projects.find( { 'members' :  { $elemMatch: { '_id' : userId} } , '_id': id } );
	project_tasks = Tasks.find( {'project_id':id} );

	if(curr_project) {
		return [
		curr_project,
		project_tasks
		];
	}

	return this.ready();
});

//maybe there's something like this needed:
//get the card from the project and all tasks matching the card id
Meteor.publish('tasksInCard',function(projectId,cardId) {
	check(projectId, String);
	check(cardId, String);
	var curr_card = Projects.findOne({'_id': projectId, 'cards.$._id': cardId});
	var curr_tasks = Tasks.find({'card_id':cardId});

	if (curr_card) {
		return [
		curr_card,
		curr_tasks
		];
	}

	return this.ready();
});

//Publication for single task, we'll see how it behaves with modal...
Meteor.publish('task',function(taskId) {
	
	var ownerId = this.userId;

	check(taskId,String);

	var oTask = Tasks.find({'_id':taskId});

	if (oTask) {
		return oTask;
	}

	return this.ready();
});

//!!!Publication of each card!!!
//!!!Might be useless now!!!
Meteor.publish('card', function(projectId,cardId) {

	var ownerId = this.userId;
	check(projectId, String);
	check(cardId, String);

	oCard = Projects.find({'owner': ownerId, '_id':projectId,'cards.$._id':cardId});
	
	if ( oCard ) {
		return oCard;
	}

	return this.ready();
});

Meteor.publish('users', function() {

	var allUsers = Meteor.users.find({},{fields:{username:1,emails:1,profile:1}});

	if (allUsers) {
		return allUsers;
	}

	return this.ready();
});

Meteor.publish('members', function(projectId) {

	check(projectId,String);

	var members = Projects.find( {_id : projectId}, {fields : { members : 1 } } )

	var memberList = [];

	members.forEach(function(item){
    	memberList.push(item._id);
	});

	var projectMembers = Meteor.users.find({ '_id' : { $in : memberList } },{ fields : { _id: 1, emails : 1, username : 1} } );

	if (projectMembers) {
		return projectMembers;
	}
	return this.ready();
});

//###########################################################//
//###########################################################//
//###########################################################//

Meteor.methods({

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
			members : [{ _id : Meteor.userId() }]
		});
	},

	//project page related

	addMember : function(memberId) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		check(memberId, String);

		Projects.update({ members : [{_id: memberId}] });
	},

	insertCard : function(projectId,cardName) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		var status = "active";
		var oCard = {
			project_id: projectId,
			name: cardName,
			status: status
		}
		
		check(projectId, String);
		check(cardName, String);
		check(status, String);
		check(oCard, Object);

		//to EDIT specific things of the card you can use {$set: {"cards.$.title": "newTitle"}}
		Projects.update(
			{_id: projectId},
			{$push: {cards : oCard}}
			);
		//{"cards.$.title" : card, "cards.$.status":status }
	},
	newTask : function(projectId, cardId,taskName) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		var userId = Meteor.userId();
		var status = "active";
		var label = "default";

		var oTask = {
			name: taskName,
			project_id: projectId,
			card_id: cardId,
			status: status,
			label: label,
			author: userId
		}

		check(userId, String);
		check(taskName, String);
		check(projectId, String);
		check(cardId, String);
		check (oTask, Object);

		Tasks.insert(oTask);
	},

	//supongamos que lo cambiamos todo de una
	//funciona bien, falta ver como acepta los embebidos
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
				'project_id' : oTask.project_id,
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
	editTaskStatus : function(taskId,input) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		check(taskId, String);
		check(input, String);

		Tasks.update({'_id':taskId},
		{
			$set: {'status': input}
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
	}

});
