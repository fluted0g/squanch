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
        helper : 'clone',
        connectWith: '.task_manager',
        receive: function(e,ui) {
            newCard = $(e.target).data("id");
            taskId = $(ui.item).data("id");
            Meteor.call("editTaskCardId",taskId,newCard);
        }
    });
});

Template.task.helpers({
    commentsNumber : function() {
        comments = Tasks.find({},{comments:1}).fetch();
        console.log(comments);
        return comments.size();
    }
});

Template.task.events({
    'sortreceive .task_manager' : function(event,ui) {
        console.log(event);
        console.log(ui);
    },
    'mouseover .task_frame' : function(event) {
        var taskId = $(event.currentTarget).data("id");
        Session.set("taskID",taskId);
    },
    'click .taskOptions' : function(event) {
        Modal.show('taskManager');
    },
    'click .archiveTask' : function(event) {
    	var id = this._id;
        Meteor.call("toggleStatus","task",id);
    },
    'click .tellMeIndex' : function(event) {
        var listItem = document.getElementById( this._id );
        console.log($(".task_frame").index(listItem));
    }
});
