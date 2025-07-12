
const http = require('http');
const auth = require('#Controller/Utils/Rclone/Auth');
function Rclone(postData, operation) {
  const options = {
    hostname: auth.auth().hostname,
    port: auth.auth().port,
    path: operation,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'Authorization': auth.auth().auth
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error('Failed to parse JSON response: ' + e.message));
          }
        } else {
          reject(new Error(`HTTP error! Status: ${res.statusCode}, Response: ${data}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(new Error('Request error: ' + e.message));
    });

    req.write(postData);
    req.end();
  });
}

exports.Rclone = Rclone;