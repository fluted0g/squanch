Cards = new Mongo.Collection( 'cards' );

Cards.allow({
  insert: () => true,
  update: () => true,
  remove: () => true
});

Cards.deny({
  insert: () => false,
  update: () => false,
  remove: () => false
});

CardSchema = new SimpleSchema({
  _id: {    
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    autoValue: function(){ return Random.id(); }
  },
  project_id: {
    type: String,
    label: "Project ID"
  },
  name:{
    type: String,
    label: "Card title"
  },
  status:{
    type: String,
    label: "Card status"
  },
  label: {
    type: String,
    label: "Card status",
    optional: true
  }
});

Cards.attachSchema( CardSchema );