import fetch from 'node-fetch';
import fs from 'fs';
import blogs_json from './data/blogs.json';
import countries_json from './data/countries.json';
import destinations_json from './data/destinations.json';

function cleanup(str) {
    return str.replace(/&#8211;/g, '–').replace('<p>', '').replace('</p>', '')
        .replace(/&nbsp;/g, '')
        .replace(/&#8217;/g, '\'')
        .replace(/&#8220;/g, '“')
        .replace(/&#8221;/g, '”')
        .replace(/&#8217;/,'\'')
        .replace(/&#8230;/g, '…').replace('[&hellip;]', '');
}
let updates = 0;
fetch('https://public-api.wordpress.com/rest/v1.1/sites/somedaywewillseetheworld.wordpress.com/posts/?order_by=modified')
    .then((resp)=>resp.json())
    .then((json) => {
        // We may repost blog posts under the same title - if this happens remove the old reference
        function removerepostsof(blogs, post) {
            const blogtitles = blogs
                .map((id) => ({ title: blogs_json[id].title, id }) );
            
            // reduce to matching titles
            const reposts = blogtitles.filter((p) => p.title === post.title)
                // reduce back to ids
                .map((p) => p.id);
            // some blogs got renamed
            if (reposts.length) {
                console.log(`Remove ${reposts.join(',')} from blogs.`)
                return blogs.filter((id) => !reposts.includes(id));
            } else {
                return blogs;
            }
        }

        json.posts.forEach((post) => {
            const id = post.ID;
            const stored = blogs_json[id];
            if ( !stored || stored.modified !== post.modified) {
                updates++;
                console.log('Add blog post', id);
                const newpost = {
                    summary: cleanup(post.excerpt),
                    title: cleanup(post.title),
                    date: post.date,
                    modified: post.modified,
                    thumbnail: `${post.featured_image}?h=200&crop=1`,
                    href: post.guid
                };
                blogs_json[id] = newpost;

                Object.keys(post.tags).forEach((tag) => {
                    const dest = destinations_json[tag];
                    const country = countries_json[tag];
                    if ( dest ) {
                        dest.blogs = dest.blogs || [];
                        if ( dest.blogs.indexOf(id) === -1 ) {
                            updates++;
                            console.log(`Associate blog post ${id} with ${tag}`);
                            dest.blogs = removerepostsof(dest.blogs, newpost);
                            dest.blogs.push( id );
                            console.log(dest.blogs);
                        }
                    }
                    if ( country ) {
                        country.blogs = country.blogs || [];
                        if ( country.blogs.indexOf(id) === -1 ) {
                            updates++;
                            console.log(`Associate blog post ${id} with ${tag}`);
                            country.blogs = removerepostsof(country.blogs, newpost);
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