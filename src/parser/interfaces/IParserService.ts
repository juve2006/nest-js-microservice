import { IContent } from "./IContent";

export interface IParserService {
  scrape (url: string, content: IContent): Promise<void>

  getContent(): Promise<IContent[]>
}