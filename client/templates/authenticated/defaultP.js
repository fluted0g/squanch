Template.defaultP.onCreated(function() {
	var instance = this;
	instance.autorun(function() {
		var projectId = FlowRouter.getParam('_id');
		Session.set("projectID",projectId);
		instance.subscribe('project', projectId);
		instance.subscribe('owner', projectId);
		instance.subscribe('members', projectId);
	});
});

Template.defaultP.onRendered( function() {
	$(document).on('click', function(event) {
		if (!$(event.target).closest('.cardMenu').length) {
				$(".cardMenu").css("display","none"); 
			}
	});
});

Template.defaultP.helpers ({
	project : function() {
		projectId = Session.get("projectID");
		return Projects.find({_id:projectId});    
	},
	members : function() {
		return Meteor.users.find();
	},
	cards : function() {
		var projectId = Session.get("projectID");
		return Cards.find({'status' : 'active','project_id':projectId});
	}
});

Template.defaultP.events ({
	'submit .insert_card' : function(event) {
		event.preventDefault();
		var projectId = Session.get("projectID");
		var cardTitle = event.target.card_title.value;
		if (cardTitle != "") {
			Meteor.call("insertCard", projectId, cardTitle);
			event.target.card_title.value = "";			
			$(".cardInserter").toggleClass("activeC");
			$(".submitCard, .cancelFormC, .card_title, .fake_card_title").toggleClass("hiddenE");
		}
	},
	'click .fake_card_title' : function(event) {
		$(".cardInserter").toggleClass("activeC");
		$(".submitCard, .cancelFormC, .card_title, .fake_card_title").toggleClass("hiddenE");
		$(".card_title").select();
	},
	'click .cancelFormC' : function(event) {
		$(".cardInserter").toggleClass("activeC");
		$(".submitCard, .cancelFormC, .card_title, .fake_card_title").toggleClass("hiddenE");
	},
	'submit .new_comment' : function(event) {
		event.preventDefault();
		var taskId = this._id;
		var commentMsg = event.target.commentMsg.value;
		var author = Meteor.user()._id;
		Meteor.call("newComment",taskId,commentMsg,author);
	},
	'click .editableContentSolid' : function(event) {
		var html = $(event.target).text().trim();
		var editableText = 
		$("<input class='editableContentFluid editableProjectName' name='editableProjectName' type='text' placeholder='"+html+"'>");
		editableText.val(html);
		$(event.target).replaceWith(editableText);
		$(".editableContentFluid").val(html);
		editableText.select();
	},
	'blur .editableContentFluid' : function(event) {
		var html = $(event.target).val().trim();    	
		var viewableText = $("<h2 class='editableContentSolid editableProjectName'></h2>");
		if (html == "") {
			viewableText.html(this.name);
			$(event.target).replaceWith(viewableText);
		} else {
			viewableText.html(html);
			Meteor.call("editProjectName",this._id,html);
			$(event.target).replaceWith(viewableText);
		}
	},
	'submit .editableProjectNameForm' : function(event) {
		event.preventDefault(); 
		var html = $(event.target.editableProjectName).val().trim();
		var viewableText = $("<h2 class='editableContentSolid editableProjectName'></h2>");
		if (html == "") {
			viewableText.html(this.name);
			$(event.target.editableProjectName).replaceWith(viewableText);
		} else {
			viewableText.html(html);
			Meteor.call("editProjectName",this._id,html);
			$(event.target.editableProjectName).replaceWith(viewableText);
		}
	}
});