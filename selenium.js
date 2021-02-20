import Selenium from 'selenium-webdriver';
import vite from "vite"
import express from "express"
(async function () {
  const app = express();

  app.use(express.static("./dist"))

  let server = app.listen("8127", (err) => {
    if (err) return console.error(err);
  })




  let driver = await new Selenium.Builder().forBrowser('chrome').build();
  try {
    await driver.get("http://localhost:8127");
    await driver.wait(Selenium.until.titleIs('Single Crowd Simulator'), 1000);
  } catch (e) {
    console.error(e);
  }
  finally {
    await driver.quit();
  }
  server.close();
  console.error("Finished building");
})();






