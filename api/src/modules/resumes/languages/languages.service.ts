import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Language } from './language.entity';
import { CreateLanguageDto } from './create-language.dto';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectRepository(Language)
    private readonly repository: Repository<Language>,
  ) {}

  async add(body: CreateLanguageDto): Promise<Language> {
    const languageExists = await this.repository.findOne({
      where: { resumeId: body.resumeId, name: body.name },
    });
    if (languageExists) {
      throw new ConflictException('Idioma já cadastrado');
    }
    const language = this.repository.create(body);
    await this.repository.save(language);
    return language;
  }

  async getAll(resumeId: number): Promise<Language[]> {
    return await this.repository.find({
      where: { resumeId },
    });
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);

    await this.repository.delete(id);
  }

  async findById(id: number): Promise<Language> {
    if (!id) {
      throw new BadRequestException();
    }
    return await this.repository.findOne({
      where: { id },
    });
  }
}
