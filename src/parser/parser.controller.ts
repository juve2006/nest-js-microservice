import { Controller, Logger } from '@nestjs/common';
import { ParserService } from './parser.service';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from "@nestjs/microservices";
import { AddUrlDto } from './dto/add-url.dto';
import { IContent } from "./interfaces/IContent";

@Controller('parser')
export class ParserController {
  constructor(private readonly parserService: ParserService) {
  }

  private logger = new Logger(ParserController.name);

  @EventPattern('parse')
  async scrape(@Payload() addUrlDto: AddUrlDto, @Ctx() context: RmqContext): Promise<void> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.parserService.scrape(addUrlDto.url);
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(`Error : ${JSON.stringify(error.message)}`);
    }
  }

  @MessagePattern('get-content')
  async getContent(@Ctx() context: RmqContext): Promise<IContent[]>{
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      return await this.parserService.getContent();
    } catch (error) {
      this.logger.error(`Error : ${JSON.stringify(error.message)}`);
    } finally {
      await channel.ack(originalMsg);
    }
  }
}
