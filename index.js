const express = require('express');
const app = express();
const path = require('path');
const url = require('url');
const fetch = require('node-fetch');

var loops = {};

app.use(express.static(path.join(__dirname, 'public')));

const validGoParams = ['id', 'type', 'interval'];
const validStopParams = ['id'];

app.get("/go", (req, res) => {
  const data = url.parse(req.url,true).query;
  if (JSON.stringify(Object.keys(data)) != JSON.stringify(validGoParams)) {
    res.end("Invalid parameters.");
    return;
  }
  const link = `https://cpalms.org/PreviewResource/LikeResourceVideo?id=${data.id}`;
  if (loops[data.id])
    res.end(`<a href="${link}" target="_blank">${data.id}</a> is already being spammed`);

  function request() {
    if (!loops[data.id]) return;
    fetch(reqLink)
      .then(res => res.json())
      .then(resData => console.log(`${data.id}: ${resData.LikesCount}`));
    setTimeout(request, data.interval);
  }
  
  const reqLink = `https://cors-anywhere.7ih.repl.co/cpalms.org/PreviewResource/LikeResourceVideo?id=${data.id}&LikeUnlike=${data.type}`;
  loops[data.id] = true;

  request();
  res.end(`Spamming ${data.type} requests to <a href="${link}" target="_blank">${data.id}</a>`);
});
app.get("/stop", (req, res) => {
  const data = url.parse(req.url,true).query;
  if (JSON.stringify(Object.keys(data)) != JSON.stringify(validStopParams)) {
    res.end("Invalid parameters.");
    return;
  }
  const link = `https://cpalms.org/PreviewResource/LikeResourceVideo?id=${data.id}`;

  if (loops[data.id]) {
    loops[data.id] = false;
    res.end(`Stopped sending requests to <a href="${link}" target="_blank">${data.id}</a>`);
  }
  else res.end(`<a href="${link}" target="_blank">${data.id}</a> isn't being spammed`);
});

app.listen(3000, () => {
  console.log('server started');
});