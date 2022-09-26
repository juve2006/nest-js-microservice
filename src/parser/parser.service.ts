import { Injectable } from "@nestjs/common";
import { Browser, Builder, By } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome";
import { IParserService } from "./interfaces/IParserService";
import { IContent } from "./interfaces/IContent";

require("chromedriver");

@Injectable()
export class ParserService implements IParserService {
  contents: Array<IContent>;

  constructor() {
    this.contents = [];
  }

  async scrape(url: string): Promise<void> {
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

      this.contents.push({
        "url": url,
        "title": title,
        "content": mainPageContent
      });
      for (let link of links) {
        await driver.get(link);
        const pageTitle = await driver.getTitle();
        await driver.manage().setTimeouts({ implicit: 5000 });
        const pageContent = await driver.findElement(By.tagName("body")).getText();
        this.contents.push({
          "url": link,
          "title": pageTitle,
          "content": pageContent
        });
      }
      console.log(this.contents);
    } catch (error) {
      throw (error);
    } finally {
      await driver.quit();
    }
  }

  async getContent(): Promise<IContent[]>{
    return this.contents;
  }
}
