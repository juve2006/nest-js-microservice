export interface IParserService {
  scrape (url: string): Promise<any>
}