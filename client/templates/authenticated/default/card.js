Template.card.onCreated(function() {
  var instance = this;
  instance.autorun(function() {
    var projectId = Session.get("projectID");
    instance.subscribe('project', projectId);
  });
});

Template.card.onRendered( function() {
    $(".card_manager").sortable({
        grid: [1,10], 
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
            event.target.task_title.value = "";
            $(".taskInserter[data-id="+cardId+"]").toggleClass("activeT");
            $(".submitTask[data-id="+cardId+"]"+
                ", .cancelFormT[data-id="+cardId+"]"+
                ", .task_title[data-id="+cardId+"]"+
                ", .fake_task_title[data-id="+cardId+"]").toggleClass("hiddenE");
        }
	},
    "click .fake_task_title" : function(event) {
        var cardId = this._id;
        $(".taskInserter[data-id="+cardId+"]").toggleClass("activeT");
        $(".submitTask[data-id="+cardId+"]"
            +", .cancelFormT[data-id="+cardId+"]"
            +", .task_title[data-id="+cardId+"]"
            +", .fake_task_title[data-id="+cardId
            +"]").toggleClass("hiddenE");
        $(".task_title").select();
    },
    "click .cancelFormT" : function(event) {
        var cardId = this._id;
        $(".taskInserter[data-id="+cardId+"]").toggleClass("activeT");
        $(".submitTask[data-id="+cardId+"]"+
            ", .cancelFormT[data-id="+cardId+"]"
            +", .task_title[data-id="+cardId+"]"
            +", .fake_task_title[data-id="+cardId
            +"]").toggleClass("hiddenE");
    },
    //try if this method is useless (use this._id DUHHHH!)
	"mouseover .card_frame" : function(event) {
        var card = $(event.currentTarget).data("id");
		Session.set("cardID",card);
	},
    "click .cardOptions" : function(event) {
        var targetMenu = $(".cardMenu[data-id="+ this._id +"]");
        if (targetMenu.css("display") == "none") {
            targetMenu.fadeToggle();
            targetMenu.css("display","block");
        } else if (targetMenu.css("display") == "block") {
            targetMenu.fadeToggle();
            targetMenu.css("display","none");
        }
    },
    "click .archiveCard" : function(event) {
        Meteor.call("toggleStatus","card",this._id);
    },
    "click .tellMeIndex" : function(event) {
        var listItem = document.getElementById( this._id );
        console.log($(".card_frame").index(listItem));
    }
});