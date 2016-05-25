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
    label: "Card label",
    optional: true
  },
  cardIndex: {
    type: Number,
    label: "Card index",
    optional: true,
    autoValue: function() {
      if (this.isInsert) {
        return 999;
      }
    }
  }
});

Cards.attachSchema( CardSchema );