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
    console.log(`\x1b[36m%s\x1b[0m`,'result.MediaUrl0: ', result.MediaUrl0);
    
    
    if (result.MediaUrl0 && result.Body) {
      twiml.message(`Thanks for psoting. Here's your weird ass image: ${result.MediaUrl0} and your awful text: "${result.Body}"`); 
    } else if (result.MediaUrl0 && !result.Body) {
      twiml.message(`Thanks for psoting. Here's your weird ass image: ${result.MediaUrl0}`);
    } else {   
      twiml.message(`Thanks for psoting. You said "${result.Body}." That's funny.`);
    }
    
    res.end(twiml.toString());
  });




