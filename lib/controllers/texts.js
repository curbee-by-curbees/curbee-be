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
    
    console.log(`\x1b[35m%s\x1b[0m`,'result.Body: ', result.Body);

    const firstWord = result.Body.split(' ')[0].toString();
    
    if(firstWord.startsWith('!')) {
      console.log(`\x1b[35m%s\x1b[0m`,'firstWord: ', firstWord);
      if(result.Body === '!HELP') {
        twiml.message(`\n\nReply with the following commands:\n\n'OBSERVATION <description> @ <address>' to add a new observation (attach image to message)\n\n'ADDSPOT <name of spot> @ <address> ! radius' to create a new lookout spot\n\n'ALLSPOTS' to list your current lookout spots\n\n'UPDATESPOT <spotname>' to update the radius of an individual lookout spot\n\n'DELETESPOT <spotname>' to delete a lookout spot
        `);
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




