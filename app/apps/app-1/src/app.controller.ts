import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UserEntity } from '@app/dal/repositories/user';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Promise<UserEntity[]> {
    return this.appService.getHello();
  }
}
