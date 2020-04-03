$(function () {
   $("#headerContainer").load("./globalHtml/navBar.html", function () {
       $("#homeNavEntry").prepend($("#navActiveImgTemplate").html())
   });
});