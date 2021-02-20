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
  driver.get("http://localhost:8127");

})

after("End server", async function () {
  server.close();
  await driver.quit();
})

describe("It builds and runs", function () {
  describe("Selenium Tests", async function () {
    it("Has the correct title", async function () {
      this.timeout(100000);
      return driver.wait(Selenium.until.titleIs('Single Crowd Simulator'), 1000);
    })
    it("Has the table element", async function () {
      return driver.findElement(Selenium.By.id("ComputerEntryTable"))
    })
  })
})