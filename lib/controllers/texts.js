import { Router } from 'express';
// import app from '../app.js';
// import Text from '../models/Text.js';
import TextService from '../services/TextService.js';
import MessagingResponse from 'twilio/lib/twiml/MessagingResponse.js';
import Find from '../models/Find.js';
import User from '../models/User.js';
import Spot from '../models/Spot.js';
import Photo from '../models/Photo.js';
import FindService from '../services/FindService.js';
import { geocode } from '../utils/geolocation.js';

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
    
    // Is this a command?
    if(firstWord.startsWith('!')) {
      
      // Get associated user object by user phone number
      const associatedUser = await User.findByNumber(result.From);

      // !HELP 
      if(result.Body === '!HELP') {

        twiml.message(`\n\nReply with the following commands:\n\n'!OBSERVATION <description> @ <address>' to add a new observation (attach image to message)\n\n'!ADDSPOT <name of spot> @ <address> ? <radius in miles>' to create a new lookout spot\n\n'!ALLSPOTS' to list your current lookout spots\n\n'!UPDATESPOT <spotname>' to update the radius of an individual lookout spot\n\n'!DELETESPOT <spotname>' to delete a lookout spot
        `);

      // !OBSERVATION
      } else if(firstWord === '!OBSERVATION') {

        // Check if includes '@'
        if (result.Body.includes('@')) {
          const commandAndDescriptionArray = result.Body.split('@')[0].trim().split(' ');

          // Check if there is more data than just a command and @
          if (commandAndDescriptionArray.length > 1) {

            // Slice and dice to get our data
            const parsedTitle = commandAndDescriptionArray.slice(1).join(' ').trim();
            const parsedAddress = result.Body.split('@')[1].trim();
            
            // Check if we have a title and an address
            if(parsedTitle && parsedAddress) { 
              
              // Check if this number is associated with a user account
              if (!associatedUser) {
                twiml.message(`
                  \n\nHmm, we can't seem to find a user associated with this phone number. Visit http://www.curbee.app/ to create an account!
                `);
              } else {
                
                // Convert street address to longitude and latitude
                const location = await geocode(parsedAddress);
                
                //await Spot.create({ name: associatedUser.username, userId: associatedUser.id, radius: 1, latitude: location.latitude, longitude: location.longitude });
                
                // Create find
                const find = await Find.insert({
                  userId: associatedUser.id,
                  title: parsedTitle,
                  latitude: location.latitude,
                  longitude: location.longitude,
                  category: 'misc'
                });

                if (result.MediaUrl0) {
                  Photo.insert({ 
                    userId: associatedUser.id, 
                    findId: find.id, 
                    photo: result.MediaUrl0 
                  });
                }
                
                // Alert subscribers
                await FindService.alert(find.id);

                // Alert user of success
                twiml.message(`\n\n
                Thanks for lookin out for the other bees! Your observation "${parsedTitle}" at ${parsedAddress} has alerted bees nearby. http://curbee.app/listings/${find.id}`);
              }
            } else {

              // Alert user of failure
              twiml.message(`\n\nOops, something went wrong. Did you forget to add a description and location? Reply with !HELP for a list of commands.
              `);
            }
          } else {
            twiml.message(`\n\nOops, something went wrong. Did you forget to add a description and location? Reply with !HELP for a list of commands.
              `);
          }
        }

        
      } else if(firstWord === '!ADDSPOT') {
        
        // Cut string in half by @
        if (result.Body.includes('@')) {

          // Slice and dice
          const commandAndDescriptionArray = result.Body.split('@')[0].trim().split(' ');
          const parsedRadius = result.Body.split('?')[1].trim();
          const parsedAddress = result.Body.split('@')[1].trim();
          const location = await geocode(parsedAddress);

          // Check if there is more data than just a command and @
          if (commandAndDescriptionArray.length > 1) {
            const parsedSpotName = commandAndDescriptionArray.slice(1).join(' ').trim();


            // Create a new lookout spot
            await Spot.create(
              { 
                name: parsedSpotName, 
                userId: associatedUser.id,
                radius: parsedRadius,
                latitude: location.latitude,
                longitude: location.longitude
              }
            );

            // Adjust message for plural or singular
            if (parsedRadius > 1) {
              twiml.message(`
                \\n\nOk! We'll send you a text whenever a new observation is posted within ${parsedRadius} miles of "${parsedSpotName}".
              `);
            } else {
              twiml.message(`\n\nOk! We'll send you a text whenever a new observation is posted within ${parsedRadius} mile of "${parsedSpotName}".
              `);
            }
          }
          
        }

      } else if(firstWord === '!ALLSPOTS') {
        const allSpots = await Spot.findAllByUser(associatedUser.id);
        console.log(`\x1b[35m%s\x1b[0m`,'allSpots: ', allSpots);

        const spotList = [];
        allSpots.forEach(spot => spotList.push(spot.name + ': ' + spot.radius + ' miles\n'));
        
        console.log(`\x1b[35m%s\x1b[0m`,'spotList: ', spotList.flat().join(''));
        
        twiml.message(`\n\nHere is a list of your current lookout spots:\n\n${spotList.flat().join('')}
        `);
        
      // } else if(firstWord === '!UPDATESPOT') {
      //   console.log(`\x1b[35m%s\x1b[0m`,'!updatespot');
      } else if(firstWord === '!DELETESPOT') {
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
    
    res.end(twiml.toString());
  });




