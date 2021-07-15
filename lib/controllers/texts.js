import { Router } from 'express';
// import app from '../app.js';
// import Text from '../models/Text.js';
import TextService from '../services/TextService.js';
import MessagingResponse from 'twilio/lib/twiml/MessagingResponse.js';

export default Router()
  .post('/', async (req, res, next) => {
    try {
      const text = await TextService.create(req.body);
      res.send(text);
    } catch(err) {
      
      next(err);
    }
  })

  .post('/sms', async (req, res) => {
    const twiml = new MessagingResponse();
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    const result = await req.body;

    // Isolate first word of incoming SMS
    const firstWord = result.Body.split(' ')[0].toString();
    
    // Does incoming SMS start with a command character?
    if(firstWord.startsWith('!')) {

      // If commands is !HELP 
      if(result.Body === '!HELP') {
        twiml.message(`\n\nReply with the following commands:\n\n'OBSERVATION <description> @ <address>' to add a new observation (attach image to message)\n\n'ADDSPOT <name of spot> @ <address> ! radius' to create a new lookout spot\n\n'ALLSPOTS' to list your current lookout spots\n\n'UPDATESPOT <spotname>' to update the radius of an individual lookout spot\n\n'DELETESPOT <spotname>' to delete a lookout spot
        `);
      } else if(firstWord === '!OBSERVATION') {

        // Check if includes '@'
        if (result.Body.includes('@')) {

          // command and description
          const commandAndDescriptionArray = result.Body.split('@')[0].trim().split(' ');

          if (commandAndDescriptionArray.length > 1) {
            const parsedTitle = commandAndDescriptionArray.slice(1).join(' ').trim();
            const parsedAddress = result.Body.split('@')[1].trim();
  
            if(parsedTitle && parsedAddress) { 
              // Need to add create Find functionality here
              
              twiml.message(`\n\nThanks for lookin out for the other bees! Your observation "${parsedTitle}" at ${parsedAddress} has alerted bees nearby. http://curbee/api/v1/listings/1`);
            } else {
              twiml.message(`\n\nOops, something went wrong. Did you forget to add a description and location? Reply with !HELP for a list of commands.
              `);
            }
          } else {
            twiml.message(`\n\nOops, something went wrong. Did you forget to add a description? Reply with !HELP for a list of commands.
              `);
          }
        }

        
      } else if(firstWord === '!ADDSPOT') {
        console.log(`\x1b[35m%s\x1b[0m`,'!addspot');
      } else if(firstWord === '!ALLSPOTS') {
        console.log(`\x1b[35m%s\x1b[0m`,'!allspots');
      } else if(firstWord === '!UPDATESPOT') {
        console.log(`\x1b[35m%s\x1b[0m`,'!updatespot');
      }else if(firstWord === '!DELETESPOT') {
        console.log(`\x1b[35m%s\x1b[0m`,'!deletespot');
      } else {
        twiml.message(`
        \n\nSorry I cant parse that. Reply with !HELP for a list of commands.`);
      }
    } else if(result.Body === 'HAPPY BIRTHDAY') {
      twiml.message(`
      \n\nThanks! Happy Birthday to you too :)`);
    } else {
      console.log(`\x1b[35m%s\x1b[0m`,'not a command');
      
      twiml.message(`
      \n\nSorry I cant parse that. Did you type the command correctly? Reply with !HELP for a list of commands.`);
      
    }
    
    // if (result.MediaUrl0 && result.Body) {
    //   twiml.message(`Thanks for psoting. Here's your weird ass image: ${result.MediaUrl0} and your awful text: "${result.Body}"`); 
    // } else if (result.MediaUrl0 && !result.Body) {
    //   twiml.message(`Thanks for psoting. Here's your weird ass image: ${result.MediaUrl0}`);
    // } else {   
    //   twiml.message(`Thanks for psoting. You said "${result.Body}." That's funny.`);
    // }
    
    res.end(twiml.toString());
  });




