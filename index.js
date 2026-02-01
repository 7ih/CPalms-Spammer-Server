const express = require('express');
const app = express();
const path = require('path');
const url = require('url');
const fetch = require('node-fetch');
const db = require('pouchdb')('cpalms');

app.use(express.static(path.join(__dirname, 'public')));

function genLink(data) {return `https://cpalms.org/PreviewResource/LikeResourceVideo?id=${data.id}&LikeUnlike=${data.type}`;}

let loops = {};
function spam(data) {
  function req() {
    if (!loops[data.id]) return;
    fetch(link, {mode: 'no-cors', timeout: 0}).catch(err => {console.log("Failed a request: " + err);});
    setTimeout(req, data.interval);
  }
  loops[data.id] = true;
  const link = genLink(data);
  console.log(`Spamming ${data.type} requests to ${data.id}`);
  req();
}

// restart ID spam after server restart
db.allDocs({
  include_docs: true
}).then(res => {
  const cpalms = res.rows;
  for (let i = 0; i < cpalms.length; i++)
    spam(cpalms[i].doc.data);
}).catch(err => console.log('database "get" error: ' + err));

const validGoParams = ['id', 'type', 'interval'];
const validStopParams = ['id'];

app.get("/go", (req, res) => {
  const data = url.parse(req.url,true).query;
  if (JSON.stringify(Object.keys(data)) != JSON.stringify(validGoParams)) {
    res.end("Invalid parameters.");
    return;
  }
  const link = genLink(data);
  if (loops[data.id]) {
    res.end(`<a href="${link}" target="_blank">${data.id}</a> is already being spammed`);
    return;
  }

  db.put({ 
    _id: data.id, 
    data: data 
  }).catch(err => console.log('database put: ' + err));

  res.end(`Spamming ${data.type} requests to <a href="${link}" target="_blank">${data.id}</a>`);
  spam(data);
});
app.get("/stop", (req, res) => {
  const data = url.parse(req.url,true).query;
  if (JSON.stringify(Object.keys(data)) != JSON.stringify(validStopParams)) {
    res.end("Invalid parameters.");
    return;
  }
  const link = genLink(data);
  if (loops[data.id]) {
    loops[data.id] = false;
    db.get(data.id)
      .then(cpalms => db.remove(cpalms))
      .catch(err => console.log('database get/remove: ' + err));
    res.end(`Stopped spamming <a href="${link}" target="_blank">${data.id}</a>`);
    console.log(`Stopped spamming ${data.id}`);
  }
  else res.end(`<a href="${link}" target="_blank">${data.id}</a> isn't being spammed`);
});

app.listen((process.env.PORT || 3000), () => {
  console.log('server started');
});
