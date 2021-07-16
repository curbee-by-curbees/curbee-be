import { Router } from 'express';
import TextService from '../services/TextService.js';
import MessagingResponse from 'twilio/lib/twiml/MessagingResponse.js';
import Find from '../models/Find.js';
import User from '../models/User.js';
import Spot from '../models/Spot.js';
import Photo from '../models/Photo.js';
import FindService from '../services/FindService.js';
import { geocode } from '../utils/geolocation.js';

// Twilio SMS response route
// We used ngrok to allow Twilio to communicate with localhost

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

    // Twilio setup
    const twiml = new MessagingResponse();
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    const result = await req.body;    

    // Isolate first word of incoming SMS
    const firstWord = result.Body.split(' ')[0].toString();
    
    // Is this a command?
    if(firstWord.startsWith('!')) {
      
      // Get associated user object by user phone number
      const user = await User.findByNumber(result.From);

      // !HELP 
      if(result.Body === '!HELP') {

        twiml.message(`\n\nReply with the following commands:\n\n'!OBSERVATION <description> @ <address>' to add a new observation (attach image to message)\n\n'!ADDSPOT <name of spot> @ <address> ? <radius in miles>' to create a new lookout spot\n\n'!ALLSPOTS' to list your current lookout spots\n\n'!UPDATESPOT <spotname> ? <radius>' to update the radius of an individual lookout spot\n\n'!DELETESPOT <spotname>' to delete a lookout spot
        `);

      // !OBSERVATION command
      } else if(firstWord === '!OBSERVATION') {

        // Check if includes '@'
        if (result.Body.includes('@')) {
          const commandAndDescriptionArray = result.Body.split('@')[0].trim().split(' ');

          // Check if there is more data than just a command and @
          if (commandAndDescriptionArray.length > 1) {

            // Slice and dice
            const parsedTitle = commandAndDescriptionArray.slice(1).join(' ').trim();
            const parsedAddress = result.Body.split('@')[1].trim();
            
            // Check if we have a title and an address
            if(parsedTitle && parsedAddress) { 
              
              // Check if this number is associated with a user account
              if (!user) {
                twiml.message(`
                  \n\nHmm, we can't seem to find a user associated with this phone number. Visit http://www.curbee.app/ to create an account!
                `);
              } else {
                
                // Convert street address to longitude and latitude
                const location = await geocode(parsedAddress);
                
                //await Spot.create({ name: user.username, userId: user.id, radius: 1, latitude: location.latitude, longitude: location.longitude });
                
                // Create find
                const find = await Find.insert({
                  userId: user.id,
                  title: parsedTitle,
                  latitude: location.latitude,
                  longitude: location.longitude,
                  category: 'misc'
                });

                // Add photo to db if SMS includes photo
                if (result.MediaUrl0) {
                  Photo.insert({ 
                    userId: user.id, 
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

            // Alert user of failure
            twiml.message(`\n\nOops, something went wrong. Did you forget to add a description and location? Reply with !HELP for a list of commands.
              `);
          }
        }

      // !ADDSPOT command
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
                userId: user.id,
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

      // !ALLSPOTS command 
      } else if(firstWord === '!ALLSPOTS') {
        const allSpots = await Spot.findAllByUser(user.id);
        console.log(`\x1b[35m%s\x1b[0m`,'allSpots: ', allSpots);

        const spotList = [];
        allSpots.forEach(spot => spotList.push(spot.name + ': ' + spot.radius + ' miles\n'));
        
        console.log(`\x1b[35m%s\x1b[0m`,'spotList: ', spotList.flat().join(''));
        
        twiml.message(`\n\nHere is a list of your current lookout spots:\n\n${spotList.flat().join('')}
        `);
        
      // !UPDATESPOT command
      } else if(firstWord === '!UPDATESPOT') {

        const spotName = result.Body.split('?')[0].split(' ').slice(1).join(' ').trim();
        const newRadius = result.Body.split('?')[1].trim();
        
        const spotToUpdate = await Spot.findAllByUserAndName(user.id, spotName);    
        if (spotToUpdate) {

          spotToUpdate.radius = newRadius;
          await Spot.update(spotToUpdate, spotToUpdate.id);

          twiml.message(`
          \n\nThe radius of your lookout spot, '${spotName}', has been updated to ${newRadius}.`);

        } else {
          twiml.message(`
          \n\nWe couldn't find a lookout spot named '${spotName}'. Reply with !ALLSPOTS to see your current lookout spots.`);
        }
        

      // !DELETE command
      } else if(firstWord === '!DELETESPOT') {

        const spotName = result.Body.split(' ').slice(1).join(' ').trim();
        const spotToDelete = await Spot.findAllByUserAndName(user.id, spotName);        
        
        if(spotToDelete) {

          await Spot.delete(spotToDelete.id);
          twiml.message(`
          \n\nYour lookout spot, '${spotName}', has been removed.`);

        } else {

          twiml.message(`
          \n\nWe couldn't find a lookout spot named '${spotName}'. Reply with !ALLSPOTS to see your current lookout spots.`);

        }

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




