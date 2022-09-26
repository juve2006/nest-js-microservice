import { IsNotEmpty, IsUrl } from 'class-validator';
import { IAddUrl } from '../interfaces/IAddUrl';

export class AddUrlDto implements IAddUrl {
  @IsNotEmpty()
  @IsUrl()
  url: string;
}