cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const imageId = Math.floor(Math.random() * 10);

cloudinary.v2.uploader.upload('https://i.imgur.com/FWUoIhk.jpg',
  { public_id: imageId }, 
  (error, result) => {
    console.log(result); 
  });

console.log(`https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/v1625691784/${imageId}.jpg`);

const form = document.getElementById('new-find');

form.addEventListener('submit', e => {
  e.preventDefault();
  
});
