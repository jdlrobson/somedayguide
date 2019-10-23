let searchindex = false;

export default function setup() {
    if (!searchindex) {
        searchindex = { countries: [], destinations: [] };
        return fetch('/index.json').then((resp) => resp.json()).then((json)=>{
            searchindex = json;
            return json;
        });
    } else {
        return Promise.resolve(searchindex);
    }
}
