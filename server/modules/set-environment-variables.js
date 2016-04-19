let setEnvironmentVariables = () => {
  if ( Meteor.settings.private ) {
    process.env.MAIL_URL = "smtp://postmaster%40sandboxafa4f3494c484a0d8620d637bde7c9b8.mailgun.org:e5a152e1e60f96dec0d346a1c68448c1@smtp.mailgun.org:587";

  }
};

Modules.server.setEnvironmentVariables = setEnvironmentVariables;
