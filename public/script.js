function $(id) {return document.getElementById(id);}
function fb(msg) {$("feedback").innerHTML = msg;}
$("stop").addEventListener("click", function() {
  var id = parseInt($("link").value.match(/\d/g).join(''));
  var params = `?id=${id}`;
  fetch("/stop" + params)
    .then(res => res.text())
    .then(data => fb(data));
});
$("go").addEventListener("click", function() {
  if (!$("link").value.includes("cpalms.org/PreviewResource") && $("link").value.includes("cpalms.org")) {
    fb("That isn't a valid cpalms tutorial");
    return;
  }
  var id = parseInt($("link").value.match(/\d/g).join(''));
  var type = $("type").value;
  var interval = parseInt($("interval").value);
  if (!interval || interval < 200) interval = 200;
  
  var params = `?id=${id}&type=${type}&interval=${interval}`;
  fetch("/go" + params)
    .then(res => res.text())
    .then(data => fb(data));
});
