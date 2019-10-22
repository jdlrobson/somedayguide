import fetch from 'node-fetch';
import fs from 'fs';
import blogs_json from './data/blogs.json';
import countries_json from './data/countries.json';
import destinations_json from './data/destinations.json';

function cleanup(str) {
    return str.replace(/&#8211;/g, '–').replace('<p>', '').replace('</p>', '');
}
let updates = 0;
fetch('https://public-api.wordpress.com/rest/v1.1/sites/somedaywewillseetheworld.wordpress.com/posts/')
    .then((resp)=>resp.json())
    .then((json) => {
        json.posts.forEach((post) => {
            const id = post.ID;
            const stored = blogs_json[id];
            if ( !stored || stored.modified !== post.modified) {
                updates++;
                console.log('Add blog post', id);
                blogs_json[id] = {
                    summary: cleanup(post.excerpt),
                    title: cleanup(post.title),
                    date: post.date,
                    modified: post.modified,
                    thumbnail: `${post.featured_image}?h=200&crop=1`,
                    href: post.guid
                };
                Object.keys(post.tags).forEach((tag) => {
                    const dest = destinations_json[tag];
                    const country = countries_json[tag];
                    if ( dest ) {
                        dest.blogs = dest.blogs || [];
                        if ( dest.blogs.indexOf(id) === -1 ) {
                            updates++;
                            console.log(`Associate blog post ${id} with ${tag}`);
                            dest.blogs.push( id );
                        }
                    }
                    if ( country ) {
                        country.blogs = country.blogs || [];
                        if ( country.blogs.indexOf(id) === -1 ) {
                            updates++;
                            console.log(`Associate blog post ${id} with ${tag}`);
                            country.blogs.push( id );
                        }
                    }
                })
            }
            
        });

        // do save.
        if ( updates > 0 ) {
            console.log('Updating JSONs...');
        fs.writeFileSync(`${__dirname}/data/blogs.json`, JSON.stringify(blogs_json));
        fs.writeFileSync(`${__dirname}/data/countries.json`, JSON.stringify(countries_json));
        fs.writeFileSync(`${__dirname}/data/destinations.json`, JSON.stringify(destinations_json));
        }
    })