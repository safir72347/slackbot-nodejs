const { WebClient } = require('@slack/web-api');
const { createEventAdapter } = require('@slack/events-api');

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET || '168817304c82eecf9f9bf59bf47d4fbc';
const slackToken = process.env.SLACK_TOKEN || 'xoxb-1677184514177-1649831709863-iGQl9aMStEfiE7JfFrQxRkk5';
const port = process.env.SLACK_PORT || 3000;

const slackEvents = createEventAdapter(slackSigningSecret);
const slackClient = new WebClient(slackToken);


slackEvents.on('app_mention', (event) => {
    console.log(`Got message from user ${event.user}: ${event.text}`);
    console.log(event);
    (async () => {
      try {
        await slackClient.chat.postMessage({ channel: event.channel, text: `Hello <@${event.user}>! :tada:` })
      } catch (error) {
        console.log(error.data)
      }
    })();
});


slackEvents.on('message', (event) => {
    console.log(`Got message from user ${event.user}: ${event.text}`);

    console.log(event);

    let dontSelfMessage = false;

    if(event.bot_profile){
        if(event.bot_id === event.bot_profile.id){
            dontSelfMessage = true;
        } 
    }

    if(!dontSelfMessage){
        (async () => {
            try {
              await slackClient.chat.postMessage({ channel: event.channel, text: `Hello ! :tada: Great to see you!! :blush:"` })
            } catch (error) {
              console.log(error.data)
            }
        })();
    }
});


slackEvents.on('file_shared', (event) => {
  console.log(`File Shared by user ${event.user}: ${event.text}`);

  console.log(event);

  let dontSelfMessage = false;

  if(event.bot_profile){
      if(event.bot_id === event.bot_profile.id){
          dontSelfMessage = true;
      } 
  }

  if(!dontSelfMessage){
      (async () => {
          try {
            await slackClient.chat.postMessage({ channel: event.channel, text: `Hello ! :tada: Great to see you!! :blush:"` })
          } catch (error) {
            console.log(error.data)
          }
      })();
  }
});
  
slackEvents.on('error', console.error);
  
slackEvents.start(port).then(() => {
    console.log(`Server started on port ${port}`)
});