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