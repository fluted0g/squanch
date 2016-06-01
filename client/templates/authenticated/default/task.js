Template.task.onCreated(function() {
    var instance = this;

    instance.autorun(function() {
        var projectId = Session.get("projectID");
        instance.subscribe('project', projectId);
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
        stop : function(e,ui) {
        taskId = $(ui.item).data("id");
        taskIndex = $(ui.item).index();
        siblings = ui.item.siblings();
        Meteor.call("assignTaskIndex",taskId,taskIndex);
        _.each(siblings, function(item) {
            idx = $(item).index();
            if (idx == taskIndex) {
                Meteor.call("assignTaskIndex",$(item).data("id"),idx++);
            } else {
                Meteor.call("assignTaskIndex",$(item).data("id"),idx);    
            }
        });   
        }
    });
    var taskIndex = $(this.firstNode).index();
    var taskId = $(this.firstNode).data("id");
    Meteor.call("assignTaskIndex",taskId,taskIndex);
});

Template.task.helpers({
    comments: function() {
        return Comments.find({task_id:this._id}).fetch();
    },
    timeLeft : function() {
        return "Due " + moment(this).fromNow();
    },
    colorDate : function() {
        //classes = ['due','lt-week-left','gt-week-left','no-rush'];
        
        dueDate = moment(this);
        now = moment();
        timeToDate = dueDate.diff(now,'days',true);
        console.log(timeToDate);
        
        if (timeToDate < 0 ) {
            dateClass ="due";
        } else if ( timeToDate > 0 &&  timeToDate < 8 ) {
            dateClass ="lt-week-left";
        } else if ( timeToDate > 8 &&  timeToDate < 30 ) {
            dateClass ="gt-week-left";
        } else {
            dateClass ="no-rush";
        }
        console.log(dateClass);
        return dateClass;
    },
    label : function() {
        if (this.label != "default") {
            return this.label;
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