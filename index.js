var Metalsmith = require('metalsmith'),
    markdown   = require('metalsmith-markdown'),
    collections = require('metalsmith-collections'),
    permalinks  = require('metalsmith-permalinks'),
    templates  = require('metalsmith-templates'),
    sass = require('metalsmith-sass'),
    convert = require('metalsmith-convert'),
    handlebars = require('handlebars'),
    reverseEach = require( 'bullhorn-handlebars-helpers/src/collection/reverseEach' )( handlebars ),
    highlight  = require('highlight.js'),
    watch = require('metalsmith-watch'),
    fs = require('fs');

handlebars.registerPartial('header', fs.readFileSync(__dirname + '/templates/partials/header.html').toString());
handlebars.registerPartial('footer', fs.readFileSync(__dirname + '/templates/partials/footer.html').toString());

Metalsmith(__dirname)
    .source('src')
    .use(collections({
        projects: {
             pattern: 'content/projects/*/*.md',
             sortBy: 'date',
             reverse: false,
             metadata: {
                name: 'Projects',
                description: 'List of projects'
            }
        },
        pages: {
            pattern: 'content/pages/*/*.md'
        }
    }))
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
    .use(convert([
        {
            src: '**/*.svg',
            target: 'png'
        },
        {
            src: '**/*.jpg',
            target: 'png'
        },
        {
            src: '**/*.gif',
            target: 'png'
        }
    ]))
    .use(permalinks())
    .use(templates('handlebars'))
    .use(sass({
        outputStyle: 'compressed'
    }))
    // .use(watch())
    .destination('./build')
    .build(function (err) {
        // console.log( this.global );
        if (err) {
            throw err;
        } else {
            // console.log(this);   
        }
    })
