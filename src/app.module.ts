import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { ParserModule } from './parser/parser.module';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true,
  }), ParserModule,],
  controllers: [],
  providers: [],
})
export class AppModule {}
