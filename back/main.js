require('dotenv').config()
const express = require('express')
const app = express()
const port = 8081
const http = require('http');
const https = require('https')
const cors = require('cors');

var whitelist = process.env.ALLOW_CORS
var corsOptions = {
  origin: function (origin, callback) {
    console.log(origin);
    if (whitelist.indexOf(origin) !== -1 || origin==undefined) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.get('/stops', cors(corsOptions), (req, res) => {
    https.get('https://open.tan.fr/ewp/arrets.json', (resp) => {
        let data = '';
      
        resp.on('data', (chunk) => {
          data += chunk;
        });
      
        resp.on('end', () => {
            res.send(data)
        });
      
      }).on("error", (err) => {
        res.send(err)
      });
})

app.get('/stops/:latitude/:longitude', cors(corsOptions), (req, res) => {
  https.get('https://open.tan.fr/ewp/arrets.json/'+req.params.latitude+'/'+req.params.longitude, (resp) => {
      let data = '';
    
      resp.on('data', (chunk) => {
        data += chunk;
      });
    
      resp.on('end', () => {
          res.send(data)
      });
    
    }).on("error", (err) => {
      res.send(err)
    });
})



app.get('/stop/:id', cors(corsOptions), (req, res) => {
  https.get('https://open.tan.fr/ewp/tempsattente.json/'+req.params.id, (resp) => {
      let data = '';
    
      resp.on('data', (chunk) => {
        data += chunk;
      });
    
      resp.on('end', () => {
          res.send(data)
      });
    
    }).on("error", (err) => {
      res.send(err)
    });
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})