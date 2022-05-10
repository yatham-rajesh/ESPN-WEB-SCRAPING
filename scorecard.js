const cheerio=require('cheerio');
const request=require('request');
const xlsx=require("xlsx");
const fs=require("fs");
const path=require("path");

function allMatch(url)
{
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
}
function extractLink(html)
{
    // we want following details 
    // 1. get venue
    // 2. get Date
    // 3. get result 
    // 4. get teams names
    // 5. get innings
   let $=cheerio.load(html);
   //1)venue
   let matchVenue=$('.ds-text-tight-m.ds-font-regular.ds-text-ui-typo-mid').text().split(",");
   let venue=matchVenue[1];
   let date=matchVenue[2]+matchVenue[3];
//    console.log(venue+":"+date);
//result
let result=$('.ds-text-tight-m.ds-font-regular.ds-truncate').text();
//    console.log(result.text());
   //teams
      let teams=$('.ds-text-tight-l.ds-font-bold');
      //a[class = 'ds-text-ui-typo hover:ds-text-ui-typo-primary ds-block']"
      let ownTeam=$(teams[0]).text();
      let opponetTeam=$(teams[1]).text();
    //   let htmlOfScorecard="";
      let innings=$('.ds-w-full.ds-table.ds-table-xs.ds-table-fixed.ci-scorecard-table');
      let teamname=ownTeam;
      for(let i=0;i<innings.length;i++)
       {   if(i==0)
        {
           console.log(venue+"|"+date+"|"+ownTeam+"|"+opponetTeam+"|"+result);
           
        }
           else{
           console.log(venue+" "+date+" "+opponetTeam+"|"+ownTeam+"|"+result);
           teamname=opponetTeam
        }
           function excelReader(playerPath, sheetName) {
    if (!fs.existsSync(playerPath)) {
      //if playerPath does not exists, this means that we have never placed any data into that file , so return empty object
      return [];
    }
    //if playerPath already has some data in it 
    let workBook = xlsx.readFile(playerPath);
    //A dictionary of the worksheets in the workbook. Use SheetNames to reference these.
    let excelData = workBook.Sheets[sheetName];
    let playerObj = xlsx.utils.sheet_to_json(excelData);
    return playerObj
}

//this function writes the data to excel file
function excelWriter(playerPath, jsObject, sheetName) {
    //Creates a new workbook
    let newWorkBook = xlsx.utils.book_new();
    //json data -> excel format convert
    let newWorkSheet = xlsx.utils.json_to_sheet(jsObject);
    //it appends a worksheet to a workbook, sheetname is name of worksheet tht we want
    xlsx.utils.book_append_sheet(newWorkBook, newWorkSheet, sheetName);
    // Attempts to write or download workbook data to file
    //add workbook to filesystem (playerpath is filepath)
    xlsx.writeFile(newWorkBook, playerPath);
}
          let allRows=$(innings[i]).find("tr");
          for(let j=0;j<allRows.length;j++)
          {
              let count=0;
              let allCol=$(allRows[j]).find("td");
               if(allCol.length>7)
               {
                   let playerName=$(allCol[0]).text().trim();
                   let runs=$(allCol[2]).text().trim();
                   let balls=$(allCol[3]).text().trim();
                   let fours=$(allCol[5]).text().trim();
                   let sixes=$(allCol[6]).text().trim();
                   let strikerate=$(allCol[7]).text().trim()
                   processPlayer(teamname,playerName,runs,balls,fours,sixes,strikerate);
                  
               }
          }
         

      }
function processPlayer(teamname,playerName,runs,balls,fours,sixes,strikerate)
{
    let teampath=path.join(__dirname,"ipl",teamname);
    dirCreater(teampath);
    let palyerpath=path.join(teampath,playerName+".xlsx");
    console.log(palyerpath);
    let content=excelReader(palyerpath,playerName);
    content.push({
        playerName,
        runs,
        balls,
        fours,
        sixes,
        strikerate

    })
    excelWriter(palyerpath,content,playerName);
}
      
      

     
     
}
function dirCreater(path)
{
    if(fs.existsSync(path)==false)
      fs.mkdirSync(path);
}
function excelReader(playerPath, sheetName) {
    if (!fs.existsSync(playerPath)) {
      //if playerPath does not exists, this means that we have never placed any data into that file , so return empty object
      return [];
    }
    //if playerPath already has some data in it 
    let workBook = xlsx.readFile(playerPath);
    //A dictionary of the worksheets in the workbook. Use SheetNames to reference these.
    let excelData = workBook.Sheets[sheetName];
    let playerObj = xlsx.utils.sheet_to_json(excelData);
    return playerObj
}

//this function writes the data to excel file
function excelWriter(playerPath, jsObject, sheetName) {
    //Creates a new workbook
    let newWorkBook = xlsx.utils.book_new();
    //json data -> excel format convert
    let newWorkSheet = xlsx.utils.json_to_sheet(jsObject);
    //it appends a worksheet to a workbook, sheetname is name of worksheet tht we want
    xlsx.utils.book_append_sheet(newWorkBook, newWorkSheet, sheetName);
    // Attempts to write or download workbook data to file
    //add workbook to filesystem (playerpath is filepath)
    xlsx.writeFile(newWorkBook, playerPath);
}
module.exports={
    getAllmatchScorecard:allMatch
}