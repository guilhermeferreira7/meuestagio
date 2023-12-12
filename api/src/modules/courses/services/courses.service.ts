import {
  BadRequestException,
  Injectable,
  ConflictException,
} from '@nestjs/common';

import { CreateCourseDto } from '../dtos/create-course.dto';

type CourseQuery = {
  page: number;
  limit: number;
  name: string;
  institutionId: number;
  areaId: number;
  orderBy: string;
  order: string;
};

@Injectable()
export class CoursesService {
  constructor() {}

  // async createCourse(createCourseDto: CreateCourseDto): Promise<Course> {
  //   await this.validate(createCourseDto);

  //   const createdCouse = this.coursesRepository.create(createCourseDto);
  //   return this.coursesRepository.save(createdCouse);
  // }

  // async delete(id: number): Promise<Course> {
  //   const course = await this.findOne(id);
  //   await this.coursesRepository.remove(course);
  //   return course;
  // }

  // async findOne(id: number): Promise<Course> {
  //   const course = await this.coursesRepository.findOneBy({ id });
  //   if (!course) {
  //     throw new BadRequestException('Curso não encontrado!');
  //   }
  //   return course;
  // }

  // findAll(query: CourseQuery): Promise<Course[]> {
  //   const orderBy = query.orderBy || 'name';
  //   const courses = this.coursesRepository.find({
  //     relations: ['institution', 'area'],
  //     skip: query.page,
  //     take: query.limit,
  //     where: {
  //       institutionId: query.institutionId,
  //       areaId: query.areaId,
  //       name: query.name ? ILike(`%${query.name}%`) : undefined,
  //     },
  //     order: {
  //       [orderBy]: query.order || 'ASC',
  //     },
  //   });

  //   return courses;
  // }

  // async findByInstitution(institutionId: number): Promise<Course[]> {
  //   return await this.coursesRepository.find({ where: { institutionId } });
  // }

  // async validate(createCourseDto: CreateCourseDto): Promise<boolean> {
  //   const courseAlreadyExists = await this.coursesRepository.findOneBy({
  //     name: createCourseDto.name,
  //     institutionId: createCourseDto.institutionId,
  //   });

  //   if (courseAlreadyExists) {
  //     throw new ConflictException('Esse curso já existe nessa instituição!');
  //   }

  //   return true;
  // }
}
