// menu UI
$("a.random").on("click", function(e){
  e.preventDefault();
  getRandomFun();
})

$("a.contact").on("click", function(e){
  term.exec("contact");
  e.preventDefault();
})

function getRandomFun() {
  var fun = ["gif", "glitch","wave","network","map"];
  // term.exec("clear");
  term.exec(fun[getRandInt(0, fun.length)]);
}

function clearAllShows (divName) {
  window.sineWavePlaying = false;
  $(divName + " *").remove();
  d3.selectAll(divName + " *").remove();
}


var context = new (window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext )();
var data;
var buffer;

function Speaker(sound_url, div) {
  this.url=sound_url;
  this.div= div;
  this.playing=false;
}

Speaker.prototype.play = function(){

  var request = new XMLHttpRequest();
  request.open('GET', this.url, true);
  request.responseType = 'arraybuffer';
  var self= this; // scope issue

  self.source = context.createBufferSource(); //  source node
  
  self.analyser = context.createAnalyser(); // setup a analyzer
  self.analyser.smoothingTimeConstant = 0.3;
  self.analyser.fftSize = 1024;
  
  self.gain = context.createGain(); // gain node (volume)

  // connect the source to the analyser and the splitter
  // self.source.connect(self.splitter);
  self.source.connect(self.analyser);

  // connect one of the outputs from the splitter to the analyser
  // self.splitter.connect(self.analyser,0,0);

  // connect analyzer to gain
  self.analyser.connect(self.gain);  

  // connect to the speakers
  self.gain.connect(context.destination);

  request.onload = function() {

    context.decodeAudioData(request.response, function(b) {
      self.source.buffer = b;
      // start
      if (!self.source.start) self.source.start = self.source.noteOn;
      self.source.start(0);

    },function(error){

       console.log(error);
    });
  }
  request.send();
}

Speaker.prototype.changeVolume = function(element, max) {
  // var volume = element;
  var fraction = parseInt(element) / parseInt(max);
  // Let's use an x*x curve (x-squared) since simple linear (x) does not
  // sound as good.
  console.log(fraction);
  this.gain.gain.value = fraction * fraction;
};

Speaker.prototype.stop = function(){
  if (!this.source.stop)
    this.source.stop = source.noteOff;
  this.source.stop(0);
}

Speaker.prototype.toggle = function() {
  this.playing ? this.stop() : this.play();
  this.playing = !this.playing;
};

Speaker.prototype.draw = function() {
 //  initialize the processing draw when the buffer is ready
  var canvas = document.getElementById(this.div);
  var processing = new Processing(canvas,drawSpeaker);
  processing.speaker = this;
}


var w, h;
var nbSquare =5;
var baseStep=100;
var strokeStep=5;
var musicLoaded=false;
var volume=0;

//processing -  display Speaker- canvas 
var drawSpeaker = function(p){

  var self = this;

  w = parseInt($('#content').css('width'),10); //get the width
  h = parseInt($('#content').css('height'),10)*2; //get the height
  console.log(w,h);

  p.setup = function(){
    p.size(w, h);
    p.background(0);
    p.smooth();
    // getVolume();
    console.log(p);
  }

  p.draw = function(){
    // console.log(self);
    p.background(0);
    if(p.speaker.playing){

      // analyze
      var bufferLength = p.speaker.analyser.frequencyBinCount; 
      var dataArray = new Uint8Array(bufferLength); // create an array to store the data;
      p.speaker.analyser.getByteFrequencyData(dataArray); // store data
      volume=getAverageVolume(dataArray); //get a single value
    }

    console.log(volume);

    if (volume && volume < 10 ) {
        squareStep=parseInt(p.random(baseStep-2,baseStep));
    } else {
        squareStep=baseStep+volume;
    }

    // draw core
    p.rectMode(p.CORNER);
    p.stroke(255);
    p.strokeWeight(1);
    p.fill(255);
    p.rect(w/2-squareStep/2, h/2, squareStep, squareStep/2);

    // draw rects
    p.fill(0,0);
    p.stroke(255);
    for (var i = 0; i < nbSquare; ++i) {
        p.strokeWeight((i+1)*strokeStep);
        p.rectMode(p.CENTER);   
        p.rect(w/2, h/2, i*squareStep, i*squareStep);
    }

  }
  function getAverageVolume(array) {
    var values = 0;
    var average;

    var length = array.length;

    // get all the frequency amplitudes
    for (var i = 0; i < length; i++) {
      values += array[i];
    }

    average = values / length;
    return average;
  }

  }

var glitchImg = function(divName) {

    // 
    var img = new Image();
    $(divName + " *").remove();

    var w=100, 
        h=100,
        canvas = $('<canvas/>',{'class':'img-glitch'})
            .width(w)
            .height(h);

    canvas[0].width  = w;
    canvas[0].height = h;

    // random pic
    var url = "http://lorempixel.com/" + w + "/" + h + "/?" + getRandInt(10000,999999);
    console.log(url);
    var ctx = canvas[0].getContext("2d");

    // 
    img.crossOrigin = 'anonymous';  // prevent security error
    img.onload = function() {

        ctx.drawImage(img, 0, 0);
        $(divName).append(canvas);

        var glitchImg = glitch( $(divName + " canvas")[0], 17);
        $(divName).append(glitchImg);
    };

    img.src = url; // load image
}

var glitch = function(canvas, amount) {
   /**
     * Apply the glitch effect to a canvas object
     *
     * @param  {HTMLCanvasElement} canvas  The canvas (or HTMLImageElement) to apply the glitch to
     * @param  {number}            amount  The amount to glitch the canvas (default: 6)
     * @return {HTMLCanvasElement}         A canvas containing a glitched version
     *                                     of the original canvas
     from 
         @license glitch.js v0.1 <http://www.github.com/sjhewitt/glitch.js>
        Released under MIT License Copyright (c) 2012 Simon Hewitt.
        http://www.twitter.com/sjhewitt
     */
      var
          // cache the width and height of the canvas locally
          x, y, w = canvas.width, h = canvas.height,

          // _len is an iterator limit, initially storing the number of slices
          // to create
          i, _len = amount || 6,

          // pick a random amount to offset the color channel
          channelOffset = (getRandInt(-_len*2, _len*2) * w * + getRandInt(-_len, _len)) * 4,

          // the maximum amount to offset a chunk of the image is a function of its width
          maxOffset = _len * _len / 100 * w,

          // vars for the width and height of the chunk that gets offset
          chunkWidth, chunkHeight,

          // create a temporary canvas to hold the image we're working on
          tempCanvas = document.createElement("canvas"),
          tempCtx = tempCanvas.getContext("2d"),

          srcData, targetImageData, data;

      // set the dimensions of the working canvas
      tempCanvas.width = w;
      tempCanvas.height = h;
      console.log(w,h);

      // draw the initial image onto the working canvas
      tempCtx.drawImage(canvas, 0, 0, w, h);

      // store the data of the original image for use when offsetting a channel
      srcData = tempCtx.getImageData(0, 0, w, h).data;

      // randomly offset slices horizontally
      for (i = 0; i < _len; i++) {

          // pick a random y coordinate to slice at
          y = getRandInt(0, h);

          // pick a random height of the slice
          chunkHeight = Math.min(getRandInt(1, h / 4), h - y);

          // pick a random horizontal distance to offset the slice
          x = getRandInt(1, maxOffset);
          chunkWidth = w - x;

          // draw the first chunk
          tempCtx.drawImage(canvas,
              0, y, chunkWidth, chunkHeight,
              x, y, chunkWidth, chunkHeight);

          // draw the rest
          tempCtx.drawImage(canvas,
              chunkWidth, y, x, chunkHeight,
              0, y, x, chunkHeight);
      }

      // get hold of the ImageData for the working image
      targetImageData = tempCtx.getImageData(0, 0, w, h);

      // and get a local reference to the rgba data array
      data = targetImageData.data;

      // Copy a random color channel from the original image into
      // the working canvas, offsetting it by a random amount
      //
      // ImageData arrays are a single dimension array that contains
      // 4 values for each pixel.
      // so, by initializing `i` to a random number between 0 and 2,
      // and incrementing by 4 on each iteration, we can replace only
      // a single channel in the image
      for(i = getRandInt(0, 3), _len = srcData.length; i < _len; i += 4) {
          data[i+channelOffset] = srcData[i];
      }

      // Make the image brighter by doubling the rgb values
      for(i = 0; i < _len; i++) {
          data[i++] *= 2;
          data[i++] *= 2;
          data[i++] *= 2;
      }

      // TODO: The above loops are the most costly in this function, iterating
      // over all the pixels in the image twice.
      // It maybe possible to optimize this by combining both loops into one,
      // and only processing every other line, as alternate lines are replaced
      // with black in the 'scan lines' block belop

      // copy the tweaked ImageData back into the context
      tempCtx.putImageData(targetImageData, 0, 0);

      // add scan lines
      tempCtx.fillStyle = "rgb(0,0,0)";
      for (i = 0; i < h; i += 2) {
          tempCtx.fillRect (0, i, w, 1);
      }

      return tempCanvas;
};

function  d3SineWave(divName) {

    // draw graph 
    var svg, x, y, line,
          A, F,
          w = 200,
          h= 100,
          preVi = 0, // iterator for movement
          N = Math.floor(random(1, 20))*6; // multiple of 10 

    // data 
    var generators = {
      random : function (i) {
          return Math.random();
      },
      sineWave : function (i, F, A) {
          var x = 0;
          x =.5
          x += A*Math.sin(F*(i/h)*Math.PI);
          return x;
      }
    }

    // interaction
    var generator = generators["sineWave"];
    var moveOn = true;
    var DEFAULT_SPEED = 500;
    var speed = DEFAULT_SPEED;

    d3.selectAll(divName).on('mouseover', function(i){
        generator = generators["random"]; 
        speed =5;
        moveOn = true;
    });  

    d3.selectAll(divName).on('mouseout', function(i){
        generator = generators["sineWave"];
        speed = DEFAULT_SPEED;
        moveOn = false;
        N = Math.floor(random(1, 60))*10
    });  

    d3.selectAll('#graph').on('click', function(i){
        N = 20;
    });  

    function generateValues(A, F, N) {
          x = d3.scale.linear().domain([0, N]).range([0, w]);
          var values = d3.range(N).map( function (d, i) {
            // console.log( generator(i, F, A) );
            return generator(i, F, A);
          } ) ;
          return values;
    }

    function init (values, callback) {
          // y scale 
          y = d3.scale.linear().range([h, 0]);
          x = d3.scale.linear().domain([0, N]).range([0, w]);

          svg = d3.select(divName)
            .append("svg")
            .attr("id", "playgraph")
            .attr("width", w)
            .attr("height", h)
              // .attr("viewBox", "0 0 " + w + " " + h )
              // .attr("preserveAspectRatio", "xMidYMid meet")
            // .append("g")
              // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          line = d3.svg.line()
            .x(function(d,i) { return x(i); })
            .y(function(d, i) {  return y(d); })

          path = svg.append("g")
            .append("path")
              .datum(values);
          callback(path)
    }

    window.sineWavePlaying = true
    
     function stop () {
      window.sineWavePlaying = false;
    }

    function updateBarGraph() { 

        clearInterval(interval);

        if (values.length == 0 || !moveOn) {

          A= random(.1,.5);  // amplitude left-right
          F = random(10,45); // frequency
          values= generateValues(A, F, N);
          preVi = values.length;

        } else {
          preVi = preVi +1;

          // push a new data point onto the back
          var p = generator(preVi, F, A);
          values.push(p);

          path
              .attr("d", line(values))
              .attr("transform", null)
            .transition()
              .attr("transform", "translate(" + x(-1) + ")");

          values.shift();
        }

        if(!moveOn) {
            path
              .attr("transform", null)
            .transition()
              .duration(500)
              .ease("linear")
              .attr("d", line(values))
          } 

        console.log(speed);

        if (i != 0 && i % 10 == 0) {
          moveOn = (moveOn)? false : true;
          speed =DEFAULT_SPEED;
        } 

        if ( i != 0 && i % 25 == 0){
          N = Math.floor(random(1, 40))*10
          generator = randomProperty(generators); 
          console.log(generator);
          // speed =5;
          speed =DEFAULT_SPEED;
        }
        i++;

        if (window.sineWavePlaying == true) {
          interval = setInterval(updateBarGraph, speed);
        }
        return interval
    }

    // init
    var values = [], 
        interval,
        path,
        i=0;

    init(values, function () {
      // setTimeout(updateBarGraph, 20);
      interval = updateBarGraph(); // update at time interval 
    })
}

function randomNetwork (divName) {

  // generate random data
  var graph = {};
  
  graph.nodes = d3.range(random(10,20)).map(function (d, i) {
    return {name : "ha", group : Math.floor(random(1,4))}
  });

  graph.links = d3.range(random(10,20)).map(function (d, i) {
    return {source : Math.floor(random(0, graph.nodes.length)), target : Math.floor(random(0, graph.nodes.length))}
  });

  var width = 250,
    height = 100;

    var colors = {
        c10 : d3.scale.category10,
        c20 : d3.scale.category20,
        c20b : d3.scale.category20b,
        c20c : d3.scale.category20c
    }
  var color = randomProperty(colors)();

  var force = d3.layout.force()
      .charge(-120)
      .linkDistance(30)
      .size([width, height]);

  var svg = d3.select(divName).append("svg")
      .attr("width", width)
      .attr("height", height);


    force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();

    var link = svg.selectAll(".link")
        .data(graph.links)
      .enter().append("line")
        .attr("class", "link")
        .style("stroke-width", function(d) { return Math.sqrt(d.value); });

    var node = svg.selectAll(".node")
        .data(graph.nodes)
      .enter().append("circle")
        .attr("class", "node")
        .attr("r", 5)
        .style("fill", function(d) { return color(d.group); })
        .call(force.drag);

    node.append("title")
        .text(function(d) { return d.name; });

    force.on("tick", function() {
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    });

}

function chinaMap (divName) {

    var colorScale = d3.scale.linear()
        .range(randomProperty(colorbrewer)[Math.floor(random(3,9))]) // or use hex values
        .domain([0, 10]);

    var width = 250, height = 100;
     
    var proj = d3.geo.mercator().center([random(102,106), random(35,40)]).scale(random(100,800 )).translate([width/2, height/2]);
    var path = d3.geo.path().projection(proj);
     
    var svg = d3.select(divName).append("svg")
        .attr("class", "map")
        .attr("width", width)
        .attr("height", height);

    d3.json("/data/china_provinces.json", function(error, counties) {

        svg.append("g")
            .attr("class", "counties")
            .selectAll("path")
            .data(counties.features)
            .enter()
            .append("path")
            .style("fill", function(d) { return colorScale(random(0, 10)) })
            .attr("d", path)

    });
}

var random = function(min, max){
    return min + Math.random()*(max-min);
};

var colorbrewer={YlGn:{3:["#f7fcb9","#addd8e","#31a354"],4:["#ffffcc","#c2e699","#78c679","#238443"],5:["#ffffcc","#c2e699","#78c679","#31a354","#006837"],6:["#ffffcc","#d9f0a3","#addd8e","#78c679","#31a354","#006837"],7:["#ffffcc","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#005a32"],8:["#ffffe5","#f7fcb9","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#005a32"],9:["#ffffe5","#f7fcb9","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#006837","#004529"]},YlGnBu:{3:["#edf8b1","#7fcdbb","#2c7fb8"],4:["#ffffcc","#a1dab4","#41b6c4","#225ea8"],5:["#ffffcc","#a1dab4","#41b6c4","#2c7fb8","#253494"],6:["#ffffcc","#c7e9b4","#7fcdbb","#41b6c4","#2c7fb8","#253494"],7:["#ffffcc","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#0c2c84"],8:["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#0c2c84"],9:["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]},GnBu:{3:["#e0f3db","#a8ddb5","#43a2ca"],4:["#f0f9e8","#bae4bc","#7bccc4","#2b8cbe"],5:["#f0f9e8","#bae4bc","#7bccc4","#43a2ca","#0868ac"],6:["#f0f9e8","#ccebc5","#a8ddb5","#7bccc4","#43a2ca","#0868ac"],7:["#f0f9e8","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#08589e"],8:["#f7fcf0","#e0f3db","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#08589e"],9:["#f7fcf0","#e0f3db","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#0868ac","#084081"]},BuGn:{3:["#e5f5f9","#99d8c9","#2ca25f"],4:["#edf8fb","#b2e2e2","#66c2a4","#238b45"],5:["#edf8fb","#b2e2e2","#66c2a4","#2ca25f","#006d2c"],6:["#edf8fb","#ccece6","#99d8c9","#66c2a4","#2ca25f","#006d2c"],7:["#edf8fb","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#005824"],8:["#f7fcfd","#e5f5f9","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#005824"],9:["#f7fcfd","#e5f5f9","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#006d2c","#00441b"]},PuBuGn:{3:["#ece2f0","#a6bddb","#1c9099"],4:["#f6eff7","#bdc9e1","#67a9cf","#02818a"],5:["#f6eff7","#bdc9e1","#67a9cf","#1c9099","#016c59"],6:["#f6eff7","#d0d1e6","#a6bddb","#67a9cf","#1c9099","#016c59"],7:["#f6eff7","#d0d1e6","#a6bddb","#67a9cf","#3690c0","#02818a","#016450"],8:["#fff7fb","#ece2f0","#d0d1e6","#a6bddb","#67a9cf","#3690c0","#02818a","#016450"],9:["#fff7fb","#ece2f0","#d0d1e6","#a6bddb","#67a9cf","#3690c0","#02818a","#016c59","#014636"]},PuBu:{3:["#ece7f2","#a6bddb","#2b8cbe"],4:["#f1eef6","#bdc9e1","#74a9cf","#0570b0"],5:["#f1eef6","#bdc9e1","#74a9cf","#2b8cbe","#045a8d"],6:["#f1eef6","#d0d1e6","#a6bddb","#74a9cf","#2b8cbe","#045a8d"],7:["#f1eef6","#d0d1e6","#a6bddb","#74a9cf","#3690c0","#0570b0","#034e7b"],8:["#fff7fb","#ece7f2","#d0d1e6","#a6bddb","#74a9cf","#3690c0","#0570b0","#034e7b"],9:["#fff7fb","#ece7f2","#d0d1e6","#a6bddb","#74a9cf","#3690c0","#0570b0","#045a8d","#023858"]},BuPu:{3:["#e0ecf4","#9ebcda","#8856a7"],4:["#edf8fb","#b3cde3","#8c96c6","#88419d"],5:["#edf8fb","#b3cde3","#8c96c6","#8856a7","#810f7c"],6:["#edf8fb","#bfd3e6","#9ebcda","#8c96c6","#8856a7","#810f7c"],7:["#edf8fb","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#6e016b"],8:["#f7fcfd","#e0ecf4","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#6e016b"],9:["#f7fcfd","#e0ecf4","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#810f7c","#4d004b"]},RdPu:{3:["#fde0dd","#fa9fb5","#c51b8a"],4:["#feebe2","#fbb4b9","#f768a1","#ae017e"],5:["#feebe2","#fbb4b9","#f768a1","#c51b8a","#7a0177"],6:["#feebe2","#fcc5c0","#fa9fb5","#f768a1","#c51b8a","#7a0177"],7:["#feebe2","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177"],8:["#fff7f3","#fde0dd","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177"],9:["#fff7f3","#fde0dd","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177","#49006a"]},PuRd:{3:["#e7e1ef","#c994c7","#dd1c77"],4:["#f1eef6","#d7b5d8","#df65b0","#ce1256"],5:["#f1eef6","#d7b5d8","#df65b0","#dd1c77","#980043"],6:["#f1eef6","#d4b9da","#c994c7","#df65b0","#dd1c77","#980043"],7:["#f1eef6","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#91003f"],8:["#f7f4f9","#e7e1ef","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#91003f"],9:["#f7f4f9","#e7e1ef","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#980043","#67001f"]},OrRd:{3:["#fee8c8","#fdbb84","#e34a33"],4:["#fef0d9","#fdcc8a","#fc8d59","#d7301f"],5:["#fef0d9","#fdcc8a","#fc8d59","#e34a33","#b30000"],6:["#fef0d9","#fdd49e","#fdbb84","#fc8d59","#e34a33","#b30000"],7:["#fef0d9","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#990000"],8:["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#990000"],9:["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#b30000","#7f0000"]},YlOrRd:{3:["#ffeda0","#feb24c","#f03b20"],4:["#ffffb2","#fecc5c","#fd8d3c","#e31a1c"],5:["#ffffb2","#fecc5c","#fd8d3c","#f03b20","#bd0026"],6:["#ffffb2","#fed976","#feb24c","#fd8d3c","#f03b20","#bd0026"],7:["#ffffb2","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#b10026"],8:["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#b10026"],9:["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"]},YlOrBr:{3:["#fff7bc","#fec44f","#d95f0e"],4:["#ffffd4","#fed98e","#fe9929","#cc4c02"],5:["#ffffd4","#fed98e","#fe9929","#d95f0e","#993404"],6:["#ffffd4","#fee391","#fec44f","#fe9929","#d95f0e","#993404"],7:["#ffffd4","#fee391","#fec44f","#fe9929","#ec7014","#cc4c02","#8c2d04"],8:["#ffffe5","#fff7bc","#fee391","#fec44f","#fe9929","#ec7014","#cc4c02","#8c2d04"],9:["#ffffe5","#fff7bc","#fee391","#fec44f","#fe9929","#ec7014","#cc4c02","#993404","#662506"]},Purples:{3:["#efedf5","#bcbddc","#756bb1"],4:["#f2f0f7","#cbc9e2","#9e9ac8","#6a51a3"],5:["#f2f0f7","#cbc9e2","#9e9ac8","#756bb1","#54278f"],6:["#f2f0f7","#dadaeb","#bcbddc","#9e9ac8","#756bb1","#54278f"],7:["#f2f0f7","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#4a1486"],8:["#fcfbfd","#efedf5","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#4a1486"],9:["#fcfbfd","#efedf5","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#54278f","#3f007d"]},Blues:{3:["#deebf7","#9ecae1","#3182bd"],4:["#eff3ff","#bdd7e7","#6baed6","#2171b5"],5:["#eff3ff","#bdd7e7","#6baed6","#3182bd","#08519c"],6:["#eff3ff","#c6dbef","#9ecae1","#6baed6","#3182bd","#08519c"],7:["#eff3ff","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#084594"],8:["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#084594"],9:["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"]},Greens:{3:["#e5f5e0","#a1d99b","#31a354"],4:["#edf8e9","#bae4b3","#74c476","#238b45"],5:["#edf8e9","#bae4b3","#74c476","#31a354","#006d2c"],6:["#edf8e9","#c7e9c0","#a1d99b","#74c476","#31a354","#006d2c"],7:["#edf8e9","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#005a32"],8:["#f7fcf5","#e5f5e0","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#005a32"],9:["#f7fcf5","#e5f5e0","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#006d2c","#00441b"]},Oranges:{3:["#fee6ce","#fdae6b","#e6550d"],4:["#feedde","#fdbe85","#fd8d3c","#d94701"],5:["#feedde","#fdbe85","#fd8d3c","#e6550d","#a63603"],6:["#feedde","#fdd0a2","#fdae6b","#fd8d3c","#e6550d","#a63603"],7:["#feedde","#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#8c2d04"],8:["#fff5eb","#fee6ce","#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#8c2d04"],9:["#fff5eb","#fee6ce","#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#a63603","#7f2704"]},Reds:{3:["#fee0d2","#fc9272","#de2d26"],4:["#fee5d9","#fcae91","#fb6a4a","#cb181d"],5:["#fee5d9","#fcae91","#fb6a4a","#de2d26","#a50f15"],6:["#fee5d9","#fcbba1","#fc9272","#fb6a4a","#de2d26","#a50f15"],7:["#fee5d9","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#99000d"],8:["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#99000d"],9:["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"]},Greys:{3:["#f0f0f0","#bdbdbd","#636363"],4:["#f7f7f7","#cccccc","#969696","#525252"],5:["#f7f7f7","#cccccc","#969696","#636363","#252525"],6:["#f7f7f7","#d9d9d9","#bdbdbd","#969696","#636363","#252525"],7:["#f7f7f7","#d9d9d9","#bdbdbd","#969696","#737373","#525252","#252525"],8:["#ffffff","#f0f0f0","#d9d9d9","#bdbdbd","#969696","#737373","#525252","#252525"],9:["#ffffff","#f0f0f0","#d9d9d9","#bdbdbd","#969696","#737373","#525252","#252525","#000000"]},PuOr:{3:["#f1a340","#f7f7f7","#998ec3"],4:["#e66101","#fdb863","#b2abd2","#5e3c99"],5:["#e66101","#fdb863","#f7f7f7","#b2abd2","#5e3c99"],6:["#b35806","#f1a340","#fee0b6","#d8daeb","#998ec3","#542788"],7:["#b35806","#f1a340","#fee0b6","#f7f7f7","#d8daeb","#998ec3","#542788"],8:["#b35806","#e08214","#fdb863","#fee0b6","#d8daeb","#b2abd2","#8073ac","#542788"],9:["#b35806","#e08214","#fdb863","#fee0b6","#f7f7f7","#d8daeb","#b2abd2","#8073ac","#542788"],10:["#7f3b08","#b35806","#e08214","#fdb863","#fee0b6","#d8daeb","#b2abd2","#8073ac","#542788","#2d004b"],11:["#7f3b08","#b35806","#e08214","#fdb863","#fee0b6","#f7f7f7","#d8daeb","#b2abd2","#8073ac","#542788","#2d004b"]},BrBG:{3:["#d8b365","#f5f5f5","#5ab4ac"],4:["#a6611a","#dfc27d","#80cdc1","#018571"],5:["#a6611a","#dfc27d","#f5f5f5","#80cdc1","#018571"],6:["#8c510a","#d8b365","#f6e8c3","#c7eae5","#5ab4ac","#01665e"],7:["#8c510a","#d8b365","#f6e8c3","#f5f5f5","#c7eae5","#5ab4ac","#01665e"],8:["#8c510a","#bf812d","#dfc27d","#f6e8c3","#c7eae5","#80cdc1","#35978f","#01665e"],9:["#8c510a","#bf812d","#dfc27d","#f6e8c3","#f5f5f5","#c7eae5","#80cdc1","#35978f","#01665e"],10:["#543005","#8c510a","#bf812d","#dfc27d","#f6e8c3","#c7eae5","#80cdc1","#35978f","#01665e","#003c30"],11:["#543005","#8c510a","#bf812d","#dfc27d","#f6e8c3","#f5f5f5","#c7eae5","#80cdc1","#35978f","#01665e","#003c30"]},PRGn:{3:["#af8dc3","#f7f7f7","#7fbf7b"],4:["#7b3294","#c2a5cf","#a6dba0","#008837"],5:["#7b3294","#c2a5cf","#f7f7f7","#a6dba0","#008837"],6:["#762a83","#af8dc3","#e7d4e8","#d9f0d3","#7fbf7b","#1b7837"],7:["#762a83","#af8dc3","#e7d4e8","#f7f7f7","#d9f0d3","#7fbf7b","#1b7837"],8:["#762a83","#9970ab","#c2a5cf","#e7d4e8","#d9f0d3","#a6dba0","#5aae61","#1b7837"],9:["#762a83","#9970ab","#c2a5cf","#e7d4e8","#f7f7f7","#d9f0d3","#a6dba0","#5aae61","#1b7837"],10:["#40004b","#762a83","#9970ab","#c2a5cf","#e7d4e8","#d9f0d3","#a6dba0","#5aae61","#1b7837","#00441b"],11:["#40004b","#762a83","#9970ab","#c2a5cf","#e7d4e8","#f7f7f7","#d9f0d3","#a6dba0","#5aae61","#1b7837","#00441b"]},PiYG:{3:["#e9a3c9","#f7f7f7","#a1d76a"],4:["#d01c8b","#f1b6da","#b8e186","#4dac26"],5:["#d01c8b","#f1b6da","#f7f7f7","#b8e186","#4dac26"],6:["#c51b7d","#e9a3c9","#fde0ef","#e6f5d0","#a1d76a","#4d9221"],7:["#c51b7d","#e9a3c9","#fde0ef","#f7f7f7","#e6f5d0","#a1d76a","#4d9221"],8:["#c51b7d","#de77ae","#f1b6da","#fde0ef","#e6f5d0","#b8e186","#7fbc41","#4d9221"],9:["#c51b7d","#de77ae","#f1b6da","#fde0ef","#f7f7f7","#e6f5d0","#b8e186","#7fbc41","#4d9221"],10:["#8e0152","#c51b7d","#de77ae","#f1b6da","#fde0ef","#e6f5d0","#b8e186","#7fbc41","#4d9221","#276419"],11:["#8e0152","#c51b7d","#de77ae","#f1b6da","#fde0ef","#f7f7f7","#e6f5d0","#b8e186","#7fbc41","#4d9221","#276419"]},RdBu:{3:["#ef8a62","#f7f7f7","#67a9cf"],4:["#ca0020","#f4a582","#92c5de","#0571b0"],5:["#ca0020","#f4a582","#f7f7f7","#92c5de","#0571b0"],6:["#b2182b","#ef8a62","#fddbc7","#d1e5f0","#67a9cf","#2166ac"],7:["#b2182b","#ef8a62","#fddbc7","#f7f7f7","#d1e5f0","#67a9cf","#2166ac"],8:["#b2182b","#d6604d","#f4a582","#fddbc7","#d1e5f0","#92c5de","#4393c3","#2166ac"],9:["#b2182b","#d6604d","#f4a582","#fddbc7","#f7f7f7","#d1e5f0","#92c5de","#4393c3","#2166ac"],10:["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#d1e5f0","#92c5de","#4393c3","#2166ac","#053061"],11:["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#f7f7f7","#d1e5f0","#92c5de","#4393c3","#2166ac","#053061"]},RdGy:{3:["#ef8a62","#ffffff","#999999"],4:["#ca0020","#f4a582","#bababa","#404040"],5:["#ca0020","#f4a582","#ffffff","#bababa","#404040"],6:["#b2182b","#ef8a62","#fddbc7","#e0e0e0","#999999","#4d4d4d"],7:["#b2182b","#ef8a62","#fddbc7","#ffffff","#e0e0e0","#999999","#4d4d4d"],8:["#b2182b","#d6604d","#f4a582","#fddbc7","#e0e0e0","#bababa","#878787","#4d4d4d"],9:["#b2182b","#d6604d","#f4a582","#fddbc7","#ffffff","#e0e0e0","#bababa","#878787","#4d4d4d"],10:["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#e0e0e0","#bababa","#878787","#4d4d4d","#1a1a1a"],11:["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#ffffff","#e0e0e0","#bababa","#878787","#4d4d4d","#1a1a1a"]},RdYlBu:{3:["#fc8d59","#ffffbf","#91bfdb"],4:["#d7191c","#fdae61","#abd9e9","#2c7bb6"],5:["#d7191c","#fdae61","#ffffbf","#abd9e9","#2c7bb6"],6:["#d73027","#fc8d59","#fee090","#e0f3f8","#91bfdb","#4575b4"],7:["#d73027","#fc8d59","#fee090","#ffffbf","#e0f3f8","#91bfdb","#4575b4"],8:["#d73027","#f46d43","#fdae61","#fee090","#e0f3f8","#abd9e9","#74add1","#4575b4"],9:["#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4"],10:["#a50026","#d73027","#f46d43","#fdae61","#fee090","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"],11:["#a50026","#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"]},Spectral:{3:["#fc8d59","#ffffbf","#99d594"],4:["#d7191c","#fdae61","#abdda4","#2b83ba"],5:["#d7191c","#fdae61","#ffffbf","#abdda4","#2b83ba"],6:["#d53e4f","#fc8d59","#fee08b","#e6f598","#99d594","#3288bd"],7:["#d53e4f","#fc8d59","#fee08b","#ffffbf","#e6f598","#99d594","#3288bd"],8:["#d53e4f","#f46d43","#fdae61","#fee08b","#e6f598","#abdda4","#66c2a5","#3288bd"],9:["#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf","#e6f598","#abdda4","#66c2a5","#3288bd"],10:["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"],11:["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"]},RdYlGn:{3:["#fc8d59","#ffffbf","#91cf60"],4:["#d7191c","#fdae61","#a6d96a","#1a9641"],5:["#d7191c","#fdae61","#ffffbf","#a6d96a","#1a9641"],6:["#d73027","#fc8d59","#fee08b","#d9ef8b","#91cf60","#1a9850"],7:["#d73027","#fc8d59","#fee08b","#ffffbf","#d9ef8b","#91cf60","#1a9850"],8:["#d73027","#f46d43","#fdae61","#fee08b","#d9ef8b","#a6d96a","#66bd63","#1a9850"],9:["#d73027","#f46d43","#fdae61","#fee08b","#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850"],10:["#a50026","#d73027","#f46d43","#fdae61","#fee08b","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"],11:["#a50026","#d73027","#f46d43","#fdae61","#fee08b","#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"]},Accent:{3:["#7fc97f","#beaed4","#fdc086"],4:["#7fc97f","#beaed4","#fdc086","#ffff99"],5:["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0"],6:["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f"],7:["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f","#bf5b17"],8:["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f","#bf5b17","#666666"]},Dark2:{3:["#1b9e77","#d95f02","#7570b3"],4:["#1b9e77","#d95f02","#7570b3","#e7298a"],5:["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e"],6:["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02"],7:["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d"],8:["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666"]},Paired:{3:["#a6cee3","#1f78b4","#b2df8a"],4:["#a6cee3","#1f78b4","#b2df8a","#33a02c"],5:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99"],6:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c"],7:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f"],8:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00"],9:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6"],10:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a"],11:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99"],12:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"]},Pastel1:{3:["#fbb4ae","#b3cde3","#ccebc5"],4:["#fbb4ae","#b3cde3","#ccebc5","#decbe4"],5:["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6"],6:["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc"],7:["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc","#e5d8bd"],8:["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc","#e5d8bd","#fddaec"],9:["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc","#e5d8bd","#fddaec","#f2f2f2"]},Pastel2:{3:["#b3e2cd","#fdcdac","#cbd5e8"],4:["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4"],5:["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9"],6:["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9","#fff2ae"],7:["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9","#fff2ae","#f1e2cc"],8:["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9","#fff2ae","#f1e2cc","#cccccc"]},Set1:{3:["#e41a1c","#377eb8","#4daf4a"],4:["#e41a1c","#377eb8","#4daf4a","#984ea3"],5:["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00"],6:["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33"],7:["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628"],8:["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf"],9:["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf","#999999"]},Set2:{3:["#66c2a5","#fc8d62","#8da0cb"],4:["#66c2a5","#fc8d62","#8da0cb","#e78ac3"],5:["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854"],6:["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f"],7:["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494"],8:["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494","#b3b3b3"]},Set3:{3:["#8dd3c7","#ffffb3","#bebada"],4:["#8dd3c7","#ffffb3","#bebada","#fb8072"],5:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3"],6:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462"],7:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69"],8:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5"],9:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9"],10:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd"],11:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5"],12:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"]}};

// helpers
var random = function(min, max){
    return min + Math.random()*(max-min);
};

var randomProperty = function (obj) {
    var keys = Object.keys(obj)
    return obj[keys[ keys.length * Math.random() << 0]];
};

var getRandInt = function(min, max) {
            return (Math.floor(Math.random() * (max - min) + min));
};
