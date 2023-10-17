import { InsertResult, Repository } from 'typeorm';
import { User } from '../../src/modules/users/user/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Student } from '../../src/modules/users/students/entities/student.entity';
import { TestingModule } from '@nestjs/testing';

type CreateUser = {
  email: string;
  name: string;
  password: string;
};

export async function createAdmin(
  admin: CreateUser,
  module: TestingModule,
): Promise<User> {
  const adminRepository: Repository<User> = module.get(
    getRepositoryToken(User),
  );
  await adminRepository.upsert(admin, ['email']);
  return await adminRepository.findOne({ where: { email: admin.email } });
}

export async function createStudent(
  student: CreateUser,
  module: TestingModule,
): Promise<Student> {
  const studentRepository: Repository<Student> = module.get(
    getRepositoryToken(Student),
  );
  await studentRepository.upsert(student, ['email']);
  return await studentRepository.findOne({ where: { email: student.email } });
}
