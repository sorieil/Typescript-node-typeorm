const https = require('src/Https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('/etc/letsencrypt/keys/0000_key-certbot.pem', 'utf-8'),
  cert: fs.readFileSync('/etc/letsencrypt/live/api.test.com/fullchain.pem', 'utf-8')
};

// cert: fs.readFileSync('/etc/letsencrypt/csr/0000_csr-certbot.pem', 'utf-8'),

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(443);

