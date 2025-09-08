const axios = require('axios');

function fetchWikiExtract(param){
    const wikiEndpoint = 'https://simple.wikipedia.org/w/api.php'
    const wikiParams = '?action=query'
    + "&prop-extracts" //extract is type of property requested
    + "&exsentences=2" // requests first two sentences
    + "&exlimit=1"
    + "&titles=" + param //tells the link what page to get extract from
    + "&explaintext=1" //provide content in plain text
    + "&format=json"
    + "&formatversion=2"
    + "&origin=";

    const wikiLink = wikiEndpoint + wikiParams;
    console.log(wikiLink);

    var wikiConfig = {
        timeout: 6500
    };

    async function getJsonResponse(url, config)
    {
        const res = await axios.get(url, config);
        return res.data;
    }

    return getJsonResponse(wikiLink, wikiConfig).then(result => {
        return result;
    }).catch(error => {
        console.log("error: " + error)
        return null;
    })
}

const wikiData = await fetchWikiExtract("Lewis Hamilton");
const wikiOutput = wikiData.query.pages[0].extract;
console.log(wikiOutput);

module.exports = { fetchTidesData, fetchLocationData , fetchWikiExtract}