Meteor.methods({ 
	insertCard : function(projectId,cardName) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}		
		check(projectId, String);
		check(cardName, String);
		var status = "active";
		var oCard = {
			project_id: projectId,
			name: cardName,
			status: status
		}
		Cards.insert(oCard);
	},
	editCardName : function(cardId,input) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(cardId,String);
		check(input,String);
		var card = Cards.findOne({_id:cardId});
		if (card) {
			Cards.update({_id:cardId},{$set:{name:input}});
		} else {
			throw new Meteor.error("invalid-target")
		}
	},
	editCardLabel : function(cardId, input) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(cardId,String);
		check(input,String);
		var card = Cards.findOne({_id:cardId});
		if(card) {
			Cards.update({_id:cardId},{$set:{label:input}});
		} else {
			throw new Meteor.error("invalid-target")
		}
	},
	assignCardIndex : function(cardId, input) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(cardId, String);
		check(input, Number);
		Cards.update({_id:cardId}, {$set:{cardIndex:input} } );
	},
	archiveAllCards: function(projectId) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(projectId, String);
		var cards = Cards.find({project_id:projectId});
		if (cards) {
			Cards.update({project_id:projectId}, { $set : {status:'archived'}},{multi:true});
		}
	},
	//task and card related
	toggleStatus: function(type,id) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		check(type,String);
		check(id,String);
		if (type == "card") {
			card = Cards.findOne({_id:id});
			if (card.status == 'active') {
				Cards.update({'_id':id},
					{$set: {status: 'archived',cardIndex:999}
				});
			} else {
				Cards.update({'_id':id},
					{$set: {status: 'active'}
				});
			}
		} else if (type =="task") {
			task = Tasks.findOne({_id:id});
			if (task.status == 'active') {
				Tasks.update({'_id':id},
					{$set: {status: 'archived',taskIndex:999}
				});
			} else {
				Tasks.update({'_id':id},
					{$set: {status: 'active'}
				});
			}
		}
	}
});