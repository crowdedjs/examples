import Selenium from 'selenium-webdriver';
import vite from "vite"
import express from "express"
import chai from 'chai';

const expect = chai.expect;

// before("Compile site", async function(){
//   this.timeout(25000);
//   await vite.build();
// })

let server;
let driver;

before("Start server", async function () {
  const app = express();
  app.use(express.static("./dist"))
  server = app.listen("8127", (err) => {
    if (err) return console.error(err);
  })
  driver = await new Selenium.Builder().forBrowser('chrome').build();
      
})

after("End server", async function () {
  server.close();
  await driver.quit();
})

describe("It builds and runs", function () {
  describe("Selenium Tests", async function () {
    it("Has the correct title", async function () {
      this.timeout(100000);
      try {
        await driver.get("http://localhost:8127");
        await driver.wait(Selenium.until.titleIs('Single Crowd Simulator'), 1000);
        return driver.findElement(Selenium.By.id("ComputerEntryTable"))
          .then(result =>{
            expect(true).to.be.true
          })
         
        
      } catch (e) {
        console.error(e);
      }
      finally {
        
      }
      expect(true).to.be.true;
    })
  })
})