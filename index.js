 /*
Clément Renaud - 2015
Website builder for http://clementrenaud.com

*/

var Metalsmith = require('metalsmith'),
    markdown   = require('metalsmith-markdown'),
    collections = require('metalsmith-collections'),
    permalinks  = require('metalsmith-permalinks'),
    templates  = require('metalsmith-templates'),
    sass = require('metalsmith-sass'),
    convert = require('metalsmith-convert'),
    define  = require('metalsmith-define'),
    tags = require('metalsmith-tags'),
    handlebars = require('handlebars'),
    reverseEach = require( 'bullhorn-handlebars-helpers/src/collection/reverseEach' )( handlebars ),
    highlight  = require('highlight.js'),
    fs = require('fs'),
    uglify  = require('metalsmith-uglify')
    concat = require('metalsmith-concat'), 
    filenames = require( "metalsmith-filenames"),
    images = require("metalsmith-scan-images"),
    watch = require('metalsmith-watch');


var _ = require('lodash');
var url = "http://clementrenaud.com/";

// parse biblio from .bib to JSON

// var bibParser = require("bibtex-parser")
// var biblio  = bibParser( fs.readFileSync(__dirname +"/src/data/biblio.bib" ).toString() )

// 
// handlebars templates
//
var partials = {
    'header' : '/templates/partials/header.html',
    'footer' : '/templates/partials/footer.html',
    'small-tile' : '/templates/home/small-tile.html',
    'tile' :  '/templates/home/tile.html',
     'project-desc' : '/templates/projects/_desc.html'
}

// register partials
for (partial in partials) {
    handlebars.registerPartial(partial, fs.readFileSync(__dirname +partials[partial] ).toString());
}

// add console.log for handelbars
// usage : {{ log anything}}
handlebars.registerHelper("log", function(optionalValue) {
    if(optionalValue) console.log(optionalValue) ;
    else console.log(this);
})

// group by for loops 
// attr : name of the attribute in the current context to be split, will be forwarded to the descendants
// count : number of elements in a group
// opts : parameter given by Handlebar, opts.fn is the block template
handlebars.registerHelper('splitter', function (attr, count, opts) {
    var context, result, arr, i, zones, inject;
    
    context = this;
    arr = attr;
    zones = Math.ceil(arr.length / count);

    result="";
    for (i = 0; i < zones; i++) {
        inject = {};
        inject[attr] = arr.slice(i * count, (i + 1) * count);

        result += opts.fn(inject);
    }

    return result;
});

handlebars.registerHelper('grouped_each', function(every, context, options) {
    var out = "", subcontext = [], i;
    if (context && context.length > 0) {
        for (i = 0; i < context.length; i++) {
            if (i > 0 && i % every === 0) {
                out += options.fn(subcontext);
                subcontext = [];
            }
            subcontext.push(context[i]);
        }
        out += options.fn(subcontext);
    }
    return out;
});


handlebars.registerHelper('breaklines', function(text) {
    text = handlebars.Utils.escapeExpression(text);
    text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
    return new handlebars.SafeString(text);
});

var app =Metalsmith(__dirname)
    .source('src')
    .metadata({ 
        site: {
            title: "clementrenaud.com",
            description: "Data columns & newspaper rows",
            url: url
        },
        author: require('./author.json'),
        resume: require('./src/data/resume.json')
    })
    .use(collections({
        projects: {
            pattern: 'content/projects/*/*.md',
            sortBy: 'date',
            reverse: true,
            metadata: {
                name: 'Projects',
                description: 'List of projects'
            }
        },
        websites: {
            pattern: 'content/websites/*/*.md',
            sortBy: 'date',
            reverse: true,
            metadata: {
                name: 'Websites',
                description: 'List of websites'
            }
        },
        workshops: {
            pattern: 'content/workshops/*/*.md',
            sortBy: 'date',
            reverse: true,
            metadata: {
                name: 'Workshops / Talks',
                description: 'List of workshops'
            }
        },
        pages: {
            pattern: 'content/pages/*/*.md'
        }
    }))
    


    
    // convert markdown to html (wih code highlight)
    .use(markdown({
        gfm: false,
        tables: true,
        sanitize : false,
        highlight: function (code, lang) {
            if (!lang) {
                return code;
            }
            try {
                return highlight.highlight(lang, code).value;
            } catch (e) {
                return code;
            }
        }
    }))
     // add a list of images in folder to post data  
    .use(images( 'content/**/**/index.html' ))
    .use(permalinks({
        pattern : ':collections/:title',
        relative : true
    }))

    .use(templates('handlebars'))



    .use(sass({
        outputStyle: "expanded"// 'compressed'
    }))
    .use(concat({
        files: 'scss/**/*.css',
        output: 'scss/app.css'
    }))

    .use(concat({
        files: 'js/**/*.js',
        output: 'js/app.js'
    }))
    // create thumbnails
    .use(convert([
        {
            "src": "**/thumb*",
            "target": "png",
            "resize": {width: 240, height: 200},
            "nameFormat": "thumbnail.png",
        }
        ]
    ))
    .use(tags({
        handle: 'category',
        path: 'categories', 
        template:'category.html', 
        sortBy: 'date',  
        reverse: true 
    }))



// parse mode
var args = process.argv.slice(2);
console.log((args[0] == "watch"));

if (args[0] == "watch") {
    app
        .use(watch({
        paths: {
            "${source}/**/*": true,
            "${source}/**/**/*": true,
            "${source}/scss/**/*": true,
            "${source}/templates/**/*": true,
            "${source}/templates/**/*": "**/*.md",
          }
    }))
    .use(sass({
        outputStyle: "expanded"// 'compressed'
    }))
    .use(concat({
        files: 'scss/**/*.css',
        output: 'scss/app.css'
    }))
    .use(concat({
        files: 'js/**/*.js',
        output: 'js/app.js'
    }))

} else if (args[0] == "deploy") {
    app.use(uglify())
}

app.destination('./build')
    .build(function (err) {
        // console.log( this._metadata.projects);
        if (err) {
            throw err;
        } else {
            // console.log(this);   
        }
    })
