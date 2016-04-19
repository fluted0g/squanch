let signup = ( options ) => {
  _validate( options.form, options.template );
};

let _validate = ( form, template ) => {
  $( form ).validate( validation( template ) );
};

let validation = ( template ) => {
  return {
    rules: {
      userName: {
        required: true,
        minlength: 6
      },
      emailAddress: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minlength: 6
      }
    },
    messages: {
      emailAddress: {
        required: 'Need an email address here.',
        email: 'Is this email address legit?'
      },
      password: {
        required: 'Need a password here.',
        minlength: 'Use at least six characters, please.'
      }
    },
    submitHandler() { _handleSignup( template ); }
  };
};

let _handleSignup = ( template ) => {

  let newProfile = {
    name: {
      first : template.find('[name="userName"]').value
    }
  };

  let user = {
    username: template.find( '[name="userName"]').value,
    email: template.find( '[name="emailAddress"]' ).value,
    password: template.find( '[name="password"]' ).value
  };



  Meteor.call('validateEmailAddress', user.email, function(error, response) {
      if (error) {
        alert(error.reason);
      } else {
        if (response.error) {
          Bert.alert(response.error,'danger');
        } else {
          Accounts.createUser({ username: user.username, email: user.email, password: user.password, profile: newProfile }, function(error) {
            if (error) {
              Bert.alert(error.reason,'danger');
            } else {
              Bert.alert("Welcome!",'success');
            }
          });
        }
      }
    });
};

Modules.client.signup = signup;
