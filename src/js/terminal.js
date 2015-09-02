var term =null;

$(document).ready(function() {  
        $("#term").niceScroll({
          cursorborder: null
        });
    });

var messages = {
    // projects : "some projects",
    help : "This help screen.",
    gif : "&#128049;  -- some love from the Internets ",
    hello : "Hello",
    about : "This website was made on 2015, June 27-28-30 using Metalsmith, Saas and d3js.",
    glitch : "&hearts; glitch &hearts; -- a random image",
    wave : "Dancing wave with d3js.",
    network : "Random network with d3js.",
    map : "Some random map of  China."
}

$(function() {
      var terminal = $('#term').terminal({
                  echo: function(arg1) {
                      this.echo(arg1);
                  },
                  ls: function() {
                    var ls = ""
                    Object.keys(messages).map(function (d) { ls += d+"\t" })
                    this.echo(ls)
                  },
                  man: function(cmd) {
                    var man = messages[cmd];
                    if (man == undefined) echoText("Manual for '"+ cmd +"' not found")
                    else echoText(man)
                  },
                  contact: function() {
                    this.echo("Drop me a line at : ")
                    echoText('<a href="mailto:clement.renaud@gmail.com">clement.renaud@gmail.com</a>')
                    echoText('<a href="http://twitter.com/clemsos">http://twitter.com/clemsos</a>')
                    echoText('Clément Renaud, at Atelier des Médias, 9 quai André Lassagne, 69001 Lyon, France. ')
                  },
                  help: function() {
                    
                    var ls = ""
                    Object.keys(messages).map(function (d) { ls += d+",\t" })
                    this.echo("Available commands: ");
                    echoText(ls);
                    this.echo("Try to type one of this command in the terminal")

                  },
                  // projects: function() {
                  //     $(".project").html("hahah")
                  // },
                  gif: function() {
                      clearAllShows("#showcase")
                      
                      var keywords = ["lolcat", "rock", "hope"];
                      var kw = keywords[Math.floor(Math.random() * keywords.length)];
                      var term = this;
                      var url="http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&rating=pg" //&tag="+kw

                      $.get(url, function (gifData) {
                          $("#showcase").html('<img src="'+ gifData.data.fixed_height_small_url + '" />')
                      })

                        echoText(messages["gif"] );
                      
                  },
                  hello : function() {
                      echoText("Hello world ! ");
                  }, 
                  about : function() {
                      echoText(messages["about"]);
                  }, 
                  glitch : function() { // get and glitch a random img from the web
                        clearAllShows("#showcase")
                        glitchImg("#showcase");
                        echoText(messages["glitch"]);
                  },
                  wave : function  () { // free move wave
                      clearAllShows("#showcase");
                      d3SineWave("#showcase");
                      echoText(messages["wave"]);
                  },
                  network : function () { // some basic network
                     clearAllShows("#showcase")
                      randomNetwork("#showcase");
                      echoText(messages["network"]);
                  },
                  map : function () {
                      clearAllShows("#showcase")
                      chinaMap("#showcase");
                      echoText(messages["map"]);
                  } 
                }, {
                    prompt: 'clemsos > ',
                    greetings: "Welcome -- type 'help' or 2x TAB to get started",
                    keypress: function(e, term) {
                        term.insert(String.fromCharCode(e.which));
                        return false;
                    },
                    width: 400,
                    height: 100
                });
            
            term = $.terminal.active();

            function echoText (txt) {
              var msg ="<span style='color:blue'>" + txt + "</span>";
              terminal.echo(msg,{raw:true});
            }

});
