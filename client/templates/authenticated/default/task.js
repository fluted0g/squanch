Template.task.onCreated(function() {
  var instance = this;
  instance.autorun(function() {});
});

Template.task.onRendered( function() {
    $(".task_manager").sortable({
        grid: [5,15], 
        revert: true, 
        items: '.task_frame', 
        placeholder: 'ghostTask', 
        helper : 'clone'});
});

Template.task.helpers({

});

Template.task.events({

    "mouseover .task_frame" : function(event) {
        var taskId = event.currentTarget.id;
        Session.set("taskID",taskId);
    }/*,
    "click .task_frame" : function(event) {
        Session.set("oTask",this);
        Modal.show('taskManager');
    }*/,
    "click .taskOptions" : function(event) {
        Session.set("oTask",this);
        Modal.show('taskManager');
    },
    "click .archiveTask" : function(event) {
    	var id = this._id;
        Meteor.call("toggleStatus","task",id);
    },
    "click .tellMeIndex" : function(event) {
        var listItem = document.getElementById( this._id );
        console.log($(".task_frame").index(listItem));
    }

});
