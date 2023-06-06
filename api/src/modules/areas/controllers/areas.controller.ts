import { Controller, Get } from '@nestjs/common';
import { AreasService } from '../services/areas.service';

@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Get()
  async findAll() {
    console.log('AreasController.findAll');

    return await this.areasService.findAll();
  }
}
