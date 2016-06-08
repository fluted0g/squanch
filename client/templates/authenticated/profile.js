Template.profile.onCreated(function() {
    var instance = this;

    instance.autorun(function() {

    });
});

Template.profile.onRendered(function() {
    //$('.birthday_input').val(new Date().toDateInputValue());
});

Template.profile.helpers({
	userAccount : function() {
		return Meteor.user();
	},
    userProfile : function() {
        return Meteor.user().profile;
    },
    proccessBirthday : function() {
        return (moment(this.birthday).format('LL'));
    },
    proccessBirthdayInput : function() {
        return moment(this.birthday).format('YYYY-MM-DD');
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
    	var html = $(event.target).val().trim();    	
    	var viewableText = $("<span class='editableContentSolid' id='editableProfileName'></span>");
    	
        if (html == "") {
            viewableText.html(Meteor.user().username);
            $(event.target).replaceWith(viewableText);
        } else {
            viewableText.html(html);
            Meteor.call("changeUsername",Meteor.user().username, html, function(error,success){
                if (error) {
                    Bert.alert("Name already in use","warning");
                    viewableText.html(Meteor.user().username);
                    $(event.target).replaceWith(viewableText);
                } else {
                    $(event.target).replaceWith(viewableText);
                }
            });
        }
	},
    'click .profileEditorSolid' : function(e) {
        e.preventDefault();
        if ($(".profileFormFluid").hasClass("hiddenE")) {
            $(".profileFormFluid").toggleClass("hiddenE");
            $(".profileFormSolid").toggleClass("hiddenE");
        } else {
            $(".profileFormFluid").toggleClass("hiddenE");
            $(".profileFormSolid").toggleClass("hiddenE");
        }
    },
    'submit .profileFormFluid' :function(e) {
        e.preventDefault();
        var profile = {country:{name:'Not defined'}};
        profile.firstName = e.target.first_name_input.value;
        profile.lastName = e.target.first_name_input.value;
        profile.birthday= e.target.birthday_input.value;
        profile.gender= e.target.gender_input.value;
        profile.organization= e.target.organization_input.value;
        profile.website= e.target.website_input.value;
        profile.bio= e.target.bio_input.value;
        profile.country.name= e.target.country_input.value;

        Meteor.call("editUserProfile",profile, function(error,success) {
            if (success) {
                $(".profileFormFluid").toggleClass("hiddenE");
                $(".profileFormSolid").toggleClass("hiddenE");
            }
        });
        
    }
});
