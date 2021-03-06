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
        //console.log(moment(this).fromNow().locale(lang))
        var processedDueDate = TAPi18n.__('taskDueIcon') +" "+ moment(this).fromNow();
    
        return processedDueDate;
        },
    colorDate : function() {
        dueDate = moment(this);
        now = moment();
        timeToDate = dueDate.diff(now,'days',true);        
        if (timeToDate < 0 ) {
            dateClass ="due";
        } else if ( timeToDate > 0 &&  timeToDate < 8 ) {
            dateClass ="lt-week-left";
        } else if ( timeToDate > 8 &&  timeToDate < 30 ) {
            dateClass ="gt-week-left";
        } else {
            dateClass ="no-rush";
        }
        return dateClass;
    },
    activeLabels: function() {
        var labels = [];
        _.each(this.labels, function(label) {
            if (label.active == true) {
                labels.push(label);
            }
        });
        if (labels.length > 0) {
            return labels;
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
    }
});