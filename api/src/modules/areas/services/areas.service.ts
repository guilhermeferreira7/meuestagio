import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Area } from '../entities/area.entity';

@Injectable()
export class AreasService {
  constructor(
    @InjectRepository(Area)
    private readonly repository: Repository<Area>,
  ) {}

  async findAll() {
    const areas = await this.repository.find();
    return areas;
  }
}
