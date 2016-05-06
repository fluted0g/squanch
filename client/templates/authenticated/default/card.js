
Template.card.helpers ({
    tasks : function() {  
        var cardId = this._id;
        return  Tasks.find({'card_id':cardId,'status':'active'});
    }
});

Template.card.events ({
	"submit .insert_task" : function(event) {
		event.preventDefault();
		var pId = FlowRouter.getParam("_id");
		var cardId = Session.get("cardID");
		var taskTitle = event.target.task_title.value;

		Meteor.call("newTask",pId,cardId,taskTitle);
		event.target.task_title.value = "";
	},	
	"mouseover .card_frame" : function(event) {
		var card = event.currentTarget.id;
		Session.set("cardID",card);
	},
    "click .cardOptions" : function(event) {
        var id = this._id;
        Meteor.call("toggleStatus","card",id)
    },
    "dblclick .bubble" : function (event) {
        time = 800;
        elem = event.currentTarget;
        var expanded;

        if ( $(elem).hasClass("expanded") ) {
            expanded = true;
        } else {
            expanded = false;
        }
        $(elem).toggleClass("reduced", time).promise().done(function () {

            if (!expanded) {
                $(elem).find(".reduced_body").hide(0, function() {
                    $(elem).toggleClass("expanded", time);
                    $(elem).after('<li class="ghostCard"></li>');
                    $(elem).find(".expanded_body").fadeIn(800);

                });
                          
            } else if (expanded) {
                $(elem).find(".expanded_body").hide(0, function() {
                   $(elem).toggleClass("expanded", time);
                   $(elem).next().remove();
                    $(elem).find(".reduced_body").fadeIn(800);  
                });
            }
        });
    },
    "click .bubble" : function(event) {

        var bubbles = $(".bubble");
        // Set up click handlers for each bubble
        var clickedBubble = event.currentTarget, // The bubble that was clicked
        max = 0;
        // Find the highest z-index
        bubbles.each(function() {
            self = $(this);
            // Find the current z-index value (has to be INT for Math.max)
            var z = parseInt( self.css( "z-index" ), 10 );
            // Keep either the current max, or the current z-index, whichever is higher
            max = Math.max( max, z );
        });
        // Set the bubble that was clicked to the highest z-index plus one
        $(clickedBubble).css("z-index", max + 1 );
    }
});