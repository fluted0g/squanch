Template.task.helpers({
});

Template.task.events({

    "mouseover .task_frame" : function(event) {
        var taskId = event.currentTarget.id;
        Session.set("taskID",taskId);
    },

    "click .task_frame" : function(event) {
        Session.set("oTask",this);
        Modal.show('taskManager');
    }

});
