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
    // const twiml = new MessagingResponse();
  
    // twiml.message('it lives!');
  
    // res.writeHead(200, { 'Content-Type': 'text/xml' });
    
    const result = await req.body;
    console.log(result);
    // res.end(twiml.toString());
  });




