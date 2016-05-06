/*
Template.taskManager.onCreated( () => {
	var projectId = Session.get("projectID");
	var cardId = Session.get("cardID");
	var taskId = Session.get("taskID");
	Template.instance().subscribe('task_modal',projectId,cardId,taskId );
});
*/

Template.taskManager.onCreated(function() {
  var instance = this;
  
  instance.autorun(function() {

  	var oTask = Session.get("oTask");
    var taskId = oTask._id;
    instance.subscribe('task',taskId);  
  });
});

Template.taskManager.onRendered(function() {
    this.$('#picker-dueDate').datetimepicker();
});

Template.taskManager.helpers({
    task: function() {
    	return Session.get("oTask");
	    //return Tasks.find();
  	},
  	cards: function() {
  		var projectId = Session.get("projectId");

  		return Cards.find({'project_id':projectId})
  	}
});

Template.taskManager.events({
	"submit .set_desc" : function(event) {
		event.preventDefault();
		var newDesc = event.target.editDesc.value;

		//should use some kind of blocky thing? a function?
		var oTask = Session.get("oTask");

		oTask.description = newDesc;

		Meteor.call("editTaskDescription",oTask._id,newDesc);
		Session.set("oTask",oTask);
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
		
		var oTask = Session.get("oTask");

		oTask.label = newLabel;

		Meteor.call("editTaskLabel",oTask._id,newLabel);
		Session.set("oTask",oTask);
	},
	"submit .moveTask" : function(event) {
		
		event.preventDefault();

		var newCardId = event.target.moveTask.value;

		var oTask = Session.get("oTask");

		oTask.card_id = newCardId;
		
		Meteor.call("editTaskCardId",oTask._id,newCardId);
		Session.set("oTask",oTask);
	},
	"submit .set_name" : function(event) {
		event.preventDefault();

		var newName = event.target.editName.value;
		var oTask = Session.get("oTask");
		oTask.name = newName;

		Meteor.call("editTaskName",oTask._id,newName);
		Session.set("oTask",oTask);
	},/*
	"submit .set_date" : function(event) {

		event.preventDefault();

		var dueDate = $('#picker-dueDate').data("DateTimePicker").getDate();

		var oTask = Session.get("oTask");
		oTask.dueDate = dueDate;

		Meteor.call("editDueDate".oTask._id,dueDate);
		Session.set("oTask",oTask);
	},*/
	'blur #picker-dueDate' : function(event) {
		event.preventDefault();

		var dueDate = $('.set-due-date').data("DateTimePicker").getDate();
		var date = $(event.target).find('#picker-dueDate').val();
		console.log(date);
		var oTask = Session.get("oTask");
		oTask.dueDate = date;

		Meteor.call("editDueDate", oTask._id,date);
		Session.set("oTask",oTask);
	},
	"click .archiveTask": function(event) {
		event.preventDefault();

		var id = this._id;

		Meteor.call("toggleStatus","task",id);
		$("#modalTask").modal('hide');
	}/*,
	".hide.bs.modal #modalTask" : function(event) {
		oTask = Session.get("oTask");
		Meteor.call("editTask",oTask);
	}*/
});