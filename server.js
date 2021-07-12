import app from './lib/app.js';
import pool from './lib/utils/pool.js';
import * as http from 'http';
import MessagingResponse from 'twilio/lib/twiml/MessagingResponse.js';

const PORT = process.env.PORT || 7890;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on ${PORT}`);
});

// app.post('/sms', (req, res) => {
//   const twiml = new MessagingResponse();

//   twiml.message('a message');

//   res.writeHead(200, { 'Content-Type': 'text/xml' });
//   res.end(twiml.toString());
// });

// http.createServer(app).listen(1337, () => {
//   console.log('Express server listening on port 7890');
// });

process.on('exit', () => {
  console.log('Goodbye!');
  pool.end();
});
