/*
*
* Clément Renaud
*/

console.log("yo");

$("#projects a").hover(function(e){
  var img = $(this).data("src");
  $(".cover").css("background-image", "url("+img+")");
})

$("#projects a").hover(function(e){
  var img = $(this).data("src");
  $(".cover").css("background-image", "url("+img+")").css({
      "transition-delay": "100ms",
      "opacity": "1"
  });

}, function(e){
  $(".cover").css({
      "transition-delay": "100ms",
      "opacity": "0"
  });
  //.css("background-image", "none");
})
