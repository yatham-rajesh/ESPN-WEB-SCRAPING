const request=require("request");
let url="https://www.espncricinfo.com/series/ipl-2020-21-1210595"
const cheerio=require("cheerio");
const allMatchObj=require("./allmatch.js")
const xlsx=require("xlsx");
const fs=require("fs");
const path=require("path");
let filename=path.join(__dirname,"ipl");
dirCreater(filename);


request(url,cb);
function cb(err,res,body)
{
    if(err)
    {
        console.log("Error",err);
    }
    else{
        handleHtml(body);
    }

}
function handleHtml(html) 
{
    let $=cheerio.load(html);
   let anchorElem = $(".ds-block.ds-text-center ");
   
    // .attr is method for finding attributes
      let link=anchorElem.attr("href");
    
       
      // let relativeLink = anchorElem.attr("href");
    //   console.log(link);
    let fullLink="https://www.espncricinfo.com/"+link;
    console.log(fullLink);
    
    allMatchObj.getAllmatch(fullLink);
    
 } 
 function dirCreater(path)
 {
     if(fs.existsSync(path)==false)
       fs.mkdirSync(path);
 }
 function excelWriter(filepath,data,sheetname)
 {
     let newWb=xlsx.utils.book_new();
     //coverts json data to sheet
     let newWs=xlsx.utils.json_to_sheet(data);
     //appending to sheet
     xlsx.utils.book_append_sheet(newWb,newWs,sheetname);
 }
 function  excelReader(filepath,sheetname)
 {
     if(s=fs.existsSync(filepath))
     {
         return [];
     }
     let wb=xlsx.readFile(filepath);
     let exceldata=we.sheets[sheetname];
     let ans=xlsx.utils.sheet_to_json(exceldata);
     return ans;
 }
 //extarcing inff from request

//  function     extractAllMatchLink(fullLink){
//      request(fullLink,cb)
//      function cb(err,res,html)
//      {
//          if(err)
//          {
//              console.log(err);
//          }
//          else{
//             getAllMatchLink(html)
             
//          }
//      }


//  }

//  function   getAllMatchLink(html)
//  {   let r=cheerio.load(html);
//     let scorecardEle=r('.ds-px-4.ds-py-3>a');
//     for(let i=0;i<scorecardEle.length;i++)
//     { 
//         let temp=r(scorecardEle[i]).attr("href");
//         console.log(temp);
//     }
//  }