Template.task.onCreated(function() {
    var instance = this;

    instance.autorun(function() {
        //instance.subscribe('project');
    });
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
        },
        update : function(e,ui) {
            taskId = $(ui.item).data("id");
            taskIndex = $(ui.item).index();
            siblings = ui.item.siblings();
            Meteor.call("assignTaskIndex",taskId,taskIndex);
            _.each(siblings, function(item) {
                Meteor.call("assignTaskIndex",$(item).data("id"),$(item).index());
            });
        }
    });
    var taskIndex = $(this.firstNode).index();
    var taskId = $(this.firstNode).data("id");
    Meteor.call("assignTaskIndex",taskId,taskIndex);
});

Template.task.helpers({
    //se ve que al usar #with, el helper limita su "scope" a los comentarios
    comments: function() {
        var comments =  Comments.find({task_id:this._id}).fetch();
        if (comments.length != 0) {
            commentNumber = comments.length;
            comment = {number:commentNumber};
            return comment;
        }   
    }
});

Template.task.events({
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
