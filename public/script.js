function $(id) {return document.getElementById(id);}
function fb(msg) {$("feedback").innerHTML = msg;}
var type;
$("stop").addEventListener("click", function() {
  var linkDirs = $("link").value.split("/");
  var id = linkDirs[linkDirs.length-1];
  var params = `?id=${id}`;
  fetch("/stop" + params)
    .then(res => res.text())
    .then(data => fb(data));
});
$("go").addEventListener("click", function() {
  if (!$("link").value.includes("cpalms.org/PreviewResource")) {
    fb("That isn't a valid cpalms link (i think)");
    return;
  }
  var linkDirs = $("link").value.split("/");
  var id = linkDirs[linkDirs.length-1];
  type = $("type").value;
  var interval = parseInt($("interval").value);
  if (!interval || interval < 200) interval = 200;

  var params = `?id=${id}&type=${type}&interval=${interval}`;
  fetch("/go" + params)
    .then(res => res.text())
    .then(data => fb(data));
});