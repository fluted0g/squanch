Template.card.onCreated(function() {
  var instance = this;
  instance.autorun(function() {
    var projectId = Session.get("projectID");
    instance.subscribe('project', projectId);
  });
});

Template.card.onRendered( function() {
    $(".card_manager").sortable({
        grid: [10,20], 
        revert: true, 
        items: '.card_frame', 
        placeholder: 'ghostCard'});
});

Template.card.helpers ({
    tasks : function() {  
        var cardId = this._id;
        return  Tasks.find({'card_id':cardId,'status':'active'});
    }
});

Template.card.events ({
	"submit .insert_task" : function(event) {
		event.preventDefault();
		var cardId = this._id; //Session.get("cardID");
		var taskTitle = event.target.task_title.value;
        if (taskTitle != "") {
            Meteor.call("newTask",cardId,taskTitle);
            var cardIdSelector = "#"+cardId;
            event.target.task_title.value = "";
            $(".taskInserter"+cardIdSelector+"").toggleClass("activeT");
            $(".submitTask"+cardIdSelector+
                ", .cancelFormT"+cardIdSelector+
                ", .task_title"+cardIdSelector+
                ", .fake_task_title"+cardIdSelector+"").toggleClass("hiddenE");
        }
	},
    "click .fake_task_title" : function(event) {
        var cardIdSelector = "#"+this._id;

        $(".taskInserter"+cardIdSelector+"").toggleClass("activeT");
        $(".submitTask"+cardIdSelector+", .cancelFormT"+cardIdSelector+", .task_title"+cardIdSelector+", .fake_task_title"+cardIdSelector+"").toggleClass("hiddenE");
        $(".task_title").select();
    },
    "click .cancelFormT" : function(event) {
        var cardIdSelector = "#"+this._id;
        $(".taskInserter"+cardIdSelector+"").toggleClass("activeT");
        $(".submitTask"+cardIdSelector+", .cancelFormT"+cardIdSelector+", .task_title"+cardIdSelector+", .fake_task_title"+cardIdSelector+"").toggleClass("hiddenE");
    },
    //try if this method is useless (use this._id DUHHHH!)
	"mouseover .card_frame" : function(event) {
		var card = event.currentTarget.id;
		Session.set("cardID",card);
	},
    "click .cardOptions" : function(event) {
        var cardIdSelector = "#"+this._id;
        $(".cardMenu"+cardIdSelector+"").toggleClass("hiddenE");
    },
    "click .archiveCard" : function(event) {
        var id = this._id;
        Meteor.call("toggleStatus","card",id);
    },
    "click .tellMeIndex" : function(event) {
        var listItem = document.getElementById( this._id );
        console.log($(".card_frame").index(listItem));
    }
});