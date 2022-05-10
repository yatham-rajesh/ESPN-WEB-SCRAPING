let url="https://www.espncricinfo.com//series/ipl-2020-21-1210595/match-results";
const cheerio=require('cheerio');
const request=require('request');
const scorecard = require('./scorecard');
const scorecardobj=require('./scorecard');
request(url,cb);
function cb(err,res,html)
{
    if(err)
    {
        console.log(err);
    }
    else{
        extractLink(html);
    }
}
function extractLink(html)
{  
    let $=cheerio.load(html);
    let scorecardEle=$('.ds-px-4.ds-py-3>a');
    for(let i=0;i<scorecardEle.length;i++)
    { 
        let  link =$(scorecardEle[i]).attr("href");
        let fullLink='https://www.espncricinfo.com'+link;
        scorecardobj.getAllmatchScorecard(fullLink);
    }
}
module.exports={
    getAllmatch:extractLink
}