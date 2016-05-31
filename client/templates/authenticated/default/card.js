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
        placeholder: 'ghostCard',
        update : function(e,ui) {
            cardId = $(ui.item).data("id");
            cardIndex = $(ui.item).index();
            siblings = ui.item.siblings();
            Meteor.call("assignCardIndex",cardId,cardIndex);
            _.each(siblings, function(item) {
                if(!($(item).attr('class') == "cardInserter")) {
                    Meteor.call("assignCardIndex",$(item).data("id"),$(item).index());
                }
            });
        }
    });
    var cardIndex = $(this.firstNode).index();
    var cardId = $(this.firstNode).data("id");
    Meteor.call("assignCardIndex",cardId,cardIndex);
    //$('.scrollbar-card').slimScroll();
});

Template.card.helpers ({
    tasks : function() {  
        var cardId = this._id;
        return  Tasks.find({'card_id':cardId,'status':'active'});
    },
    cards : function() {
        return Cards.find({status:'active'});
    }
});

Template.card.events ({
    /*
    'mouseover .card_frame' : function(event) {
        Session.set("cardID",this._id);
    },
    */
    "submit .insert_task" : function(event) {
      event.preventDefault();
      var cardId = this._id;
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
"click .cardOptions" : function(event) {
    event.stopImmediatePropagation();
    var targetMenu = $(".cardMenu[data-id="+ this._id +"]");
    if (targetMenu.css("display") == "none") {
        $(".cardMenu").css("display","none");
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
'click .moveTasks' : function(event) {
    Session.set("cardID",this._id);
    var targetMenu = $(".cardList[data-id="+ this._id +"]");
    if (targetMenu.css("display") == "none") {
        targetMenu.fadeToggle();
        targetMenu.css("display","block");
    } else if (targetMenu.css("display") == "block") {
        targetMenu.fadeToggle();
        targetMenu.css("display","none");
    }
},
'click .cardInList' : function(event) {
    var parentCard = Session.get("cardID");
    var targetCard = $(event.target).data("id");
    Meteor.call("moveAllTasks",parentCard,targetCard);
    var targetMenu = $(".cardMenu[data-id="+ parentCard +"]");
    targetMenu.fadeToggle();
    targetMenu.css("display","none");
},
'click .archiveTasks' : function(event) {
    var card = this._id;
    Meteor.call("archiveAllTasks",card);
    var targetMenu = $(".cardMenu[data-id="+ this._id +"]");
    targetMenu.fadeToggle();
    targetMenu.css("display","none");
},
'click .editableContentSolid' : function(event) {
    //event.stopImmediatePropagation();
    var html = $(event.target).text().trim();
    var editableText = 
    $("<input class='editableContentFluid editableCardName' name='editableCardName' type='text' placeholder='"+html+"'>");
    editableText.val(html);
    $(event.target).replaceWith(editableText);
    $(".editableContentFluid").val(html);
    editableText.select();
},
'blur .editableContentFluid' : function(event) {
    var html = $(event.target).val().trim();        
    var viewableText = $("<h3 class='editableContentSolid editableCardName'></h3>");
    if (html == "") {
        viewableText.html(this.name);
        $(event.target).replaceWith(viewableText);
    } else {
        viewableText.html(html);
        Meteor.call("editCardName",this._id,html);
        $(event.target).replaceWith(viewableText);
    }
},
'submit .editableCardNameForm' : function(event) {
    event.preventDefault(); 
    var html = $(event.target.editableCardName).val().trim();
    var viewableText = $("<h4 class='editableContentSolid editableTaskName'></h4>");
    if (html == "") {
        viewableText.html(this.name);
        $(event.target.editableCardName).replaceWith(viewableText);
    } else {
        viewableText.html(html);
        Meteor.call("editCardName",this._id,html);
        $(event.target.editableCardName).replaceWith(viewableText);
    }
}
});