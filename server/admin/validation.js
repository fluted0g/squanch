
//Validacion de email via kickbox
//

var Future;

Future = Npm.require('fibers/future');

Meteor.methods({
  validateEmailAddress: function(address) {
    var validateEmail;
    check(address, String);
    validateEmail = new Future();
    HTTP.call("GET", "https://api.kickbox.io/v2/verify", {
      params: {
        email: address,
        apikey: "fe2e53acce2157c506495ebcc080da381664086c47025041ddc5dc50c9416435"
      }
    }, function(error, response) {
      if (error) {
        return validateEmail["return"](error);
      } else {
        if (response.data.result === "invalid" || response.data.result === "unknown" || response.data.result === "risky" || response.data.result === "undeliverable") {
          return validateEmail["return"]({
            error: "Sorry, your email was returned as invalid. Please try another address."
          });
        } else {
          return validateEmail["return"](true);
        }
      }
    });
    return validateEmail.wait();
  }
});