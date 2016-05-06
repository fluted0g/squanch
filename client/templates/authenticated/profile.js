Template.profile.onCreated(function() {
  var instance = this;

  instance.autorun(function() {

  });
});

Template.profile.helpers({
	userProfile : function() {
		return Meteor.user();
	}
});

Template.profile.events({
	'click .editableContentSolid' : function(event) {
    		var html = $(event.target).val(); // notice "this" instead of a specific #myDiv
    		var editableText = 
    			$("<input class='editableContentFluid' type='text'>");
    		editableText.val(html);
    		$(event.target).replaceWith(editableText);
    		editableText.focus();
	},
	'blur .editableContentFluid' : function(event) {
    	// Preserve the value of textarea
    	var html = $(event.target).val();
    	// create a dynamic div
    	var viewableText = $("<span class='editableContentSolid'></span>");
    	// set it's html 
    	viewableText.html(html);

    	var checkName = Meteor.users.findOne({username:html});
    	// update username and replace out the textarea
    	
    	if (!checkName) {
    		Meteor.users.update({_id:Meteor.user()._id}, {$set:{username:html}});
    		$(event.target).replaceWith(viewableText);
    	} else {
    		Bert.alert("Name already in use","error");
    		viewableText.html(checkName.username);
    		$(event.target).replaceWith("<span class='editableContentSolid'>{{username}}</span>");
    	}
    	
    	
    	
    	
	}
});
