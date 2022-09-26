import { Controller, Logger } from '@nestjs/common';
import { ParserService } from './parser.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { AddUrlDto } from './dto/add-url.dto';

@Controller('parser')
export class ParserController {
  constructor(private readonly parserService: ParserService) {
  }

  private logger = new Logger(ParserController.name);

  @EventPattern('parse')
  async scrape(@Payload() addUrlDto: AddUrlDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const content = await this.parserService.scrape(addUrlDto.url);
      await channel.ack(originalMsg);
      console.log(content);
      return content;
    } catch (error) {
      this.logger.error(`Error : ${JSON.stringify(error.message)}`);
    }
  }
}
