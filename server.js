import app from './lib/app.js';
import pool from './lib/utils/pool.js';
// import http from 'http';


const PORT = process.env.PORT || 7890;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on ${PORT}`);
});


// http.createServer(app).listen(1337, () => {
//   console.log('Express server listening on port 1337');
// }); 

process.on('exit', () => {
  console.log('Goodbye!');
  pool.end();
});
