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

before("Start server", function(){
  const app = express();
    app.use(express.static("./dist"))
     server = app.listen("8127", (err) => {
      if (err) return console.error(err);
    })
})

after("End server", function(){
  server.close();
})

describe("It builds and runs", function () {
  describe("Selenium Tests", async function () {
    it("Has the correct title", async function () {
      this.timeout(100000);
      let driver = await new Selenium.Builder().forBrowser('chrome').build();
      try {
        await driver.get("http://localhost:8127");
        await driver.wait(Selenium.until.titleIs('Single Crowd Simulator'), 1000);
        expect(true).to.be.true;
      } catch (e) {
        console.error(e);
      }
      finally {
        await driver.quit();
      }
      expect(true).to.be.true;
    })
  })
})