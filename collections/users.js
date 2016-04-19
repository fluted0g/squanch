
Meteor.users.allow({
  insert: () => true,
  update: () => true,
  remove: () => true
});

Meteor.users.deny({
  insert: () => false,
  update: () => false,
  remove: () => false
});
