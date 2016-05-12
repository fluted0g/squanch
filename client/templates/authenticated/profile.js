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
    	var html = $(event.target).text().trim();
		var editableText = 
    		$("<input class='editableContentFluid' id='editableProfileName' type='text' placeholder='"+html+"'>");
        editableText.val(html);
            $(event.target).replaceWith(editableText);
            
            $(".editableContentFluid").val(html);
    		editableText.select();
	},
	'blur .editableContentFluid' : function(event) {    	
    	var html = $(event.target).val();    	
    	var viewableText = $("<span class='editableContentSolid' id='editableProfileName'></span>");
    	
        if (html == "") {
            viewableText.html(Meteor.user().username);
            $(event.target).replaceWith(viewableText);
        } else {
            viewableText.html(html);
            Meteor.call("isUser",html, function(error,result) {
                if(error) {
                    Meteor.users.update({_id:Meteor.user()._id}, {$set:{username:html}});
                    $(event.target).replaceWith(viewableText);
                } else {
                    Bert.alert("Name already in use","warning");
                    viewableText.html(Meteor.user().username);
                    $(event.target).replaceWith(viewableText);         
                }
            });
        }
	}
});
