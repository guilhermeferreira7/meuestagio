import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('/')
export class AppController {
  @Get()
  @Redirect('api', 301)
  api() {}
}
