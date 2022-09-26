import { Injectable } from "@nestjs/common";
import { Browser, Builder, By } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome";
import { IParserService } from "./interfaces/IParserService";

require("chromedriver");

@Injectable()
export class ParserService implements IParserService {

  async scrape(url: string): Promise<string[]> {
    const chromeOptions = new Options();
    chromeOptions.addArguments("--disable-software-rasterizer");
    chromeOptions.addArguments("--disable-gpu");
    chromeOptions.addArguments("--disable-notifications");
    chromeOptions.addArguments("--headless");
    chromeOptions.excludeSwitches("enable-logging");
    const driver = await new Builder()
      .forBrowser(Browser.CHROME)
      .setChromeOptions(chromeOptions)
      .build();
    try {
      await driver.get(url);
      const title = await driver.getTitle();
      const mainPageContent = await driver.findElement(By.tagName("body")).getText();

      //всі посилання на сторінці
      const elements = await driver.findElements(By.tagName("a"));
      let links = [];
      for (let element of elements) {
        const link = await element.getAttribute("href");
        if (link !== null && (link.startsWith("http://") || link.startsWith("https://"))) {
          links.push(link);
        }
      }
     // console.log(links);
      let parsed = [];
      parsed.push({
        "url": url,
        "title": title,
        "content": mainPageContent
      });
      for (let link of links) {
        await driver.get(link);
        const pageTitle = await driver.getTitle();
        await driver.manage().setTimeouts({ implicit: 5000 });
        const pageContent = await driver.findElement(By.tagName("body")).getText();
        parsed.push({
          "url": link,
          "title": pageTitle,
          "content": pageContent
        });
      }
     // console.log(parsed);
      return parsed;
    } catch (error) {
      throw (error);
    } finally {
      await driver.quit();
    }
  }
}
