'use strict';
const puppeteer = require('puppeteer');
const fs = require('fs');

(async function main() {
  try {
    const browser = await puppeteer.launch();
    const [page] = await browser.pages();
    await page.goto('https://eddb.io/commodity', { waitUntil: 'networkidle0' });
    await page.waitForXPath("//tr[@class='even']");
    let Even = await page.$x("//tr[@class='even']");
    let Odd = await page.$x("//tr[@class='odd']");
    let ev_arr = [];
    let o_arr = [];
    for(var i=0; i<Even.length; i++) {
      let Eodd = await page.evaluate(el => el.textContent, Even[i]);
      let ev_1 = Eodd.split("\n")
      ev_arr.push(Eodd)
      o_arr.push(ev_1)
      

    }
    for(var i=0; i<Odd.length; i++) {
      let Eodd = await page.evaluate(el => el.textContent, Odd[i]);
      let ev_1 = Eodd.split("\n")
      ev_arr.push(Eodd)
      o_arr.push(ev_1)
      
      

    }
    for(var i=0; i<o_arr.length; i++) {  
      let ov = o_arr[i];
      let o2 = ov.filter(function(a){return a!=='                            '})
      for(var j = 0; j<o2.length; j++){
        o2[j] = o2[j].replace(/\s+/g, '');
        o2[j] = o2[j].replace(",", "");
      }
      let o_obj = {
        name : o2[1],
        buy_price : parseInt(o2[2]),
        value: parseInt(o2[3]),
        sell_price : parseInt(o2[4]),
        profit: parseInt(o2[5]),

      }
      let o_json = JSON.stringify(o_obj);
      console.log(o_obj);
      
      fs.appendFileSync("data.json","\n"+o_json+",");
    }
    await browser.close();
  } catch (err) {
    console.error(err);
  }
})();
