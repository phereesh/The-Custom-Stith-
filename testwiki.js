const http = require('https');
const urls = [
  'https://upload.wikimedia.org/wikipedia/commons/c/cf/Worsted_cloth.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/7/7b/Cotton_twill.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/1/15/Linen_plain_weave.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/a/a2/Harris_Tweed_cloth.jpg'
];
urls.forEach(url => {
  http.get(url, res => console.log(url, res.statusCode)).on('error', console.error);
});
