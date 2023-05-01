import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateStudentDto } from '../dtos/create-student.dto';
import { City } from '../../../cities/models/city.entity';
import { Institution } from '../../../institutions/models/institution.entity';
import { Course } from '../../../courses/models/course.entity';

@Injectable()
export class StudentValidator {
  constructor(
    @InjectRepository(City)
    private readonly citiesRepository: Repository<City>,
    @InjectRepository(Institution)
    private readonly institutionsRepository: Repository<Institution>,
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
  ) {}

  async validateCreate(
    createStudentDto: CreateStudentDto,
  ): Promise<CreateStudentDto | null> {
    const student: CreateStudentDto = createStudentDto;

    // const city = await this.validateCity(createStudentDto.cityId);
    // if (!city) return null;

    // const institution = await this.validateInstitution(
    //   createStudentDto.institutionId,
    // );
    // if (!institution) return null;

    // const course = await this.validateCourse(createStudentDto.courseId);
    // if (!course) return null;

    return student;
  }

  private async validateCity(cityId: number): Promise<City> {
    const city = await this.citiesRepository.findOneBy({
      id: cityId,
    });

    if (!city) {
      return null;
    }

    return city;
  }

  private async validateInstitution(
    institutionId: number,
  ): Promise<Institution> {
    const institution = await this.institutionsRepository.findOneBy({
      id: institutionId,
    });

    if (!institution) {
      return null;
    }

    return institution;
  }

  private async validateCourse(courseId: number) {
    const course = await this.coursesRepository.findOneBy({ id: courseId });

    if (!course) {
      return null;
    }

    return course;
  }
}
