import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { User } from '../../../modules/users/user/user.entity';
import bcryptService from '../../../utils/bcriptUtils';

export class AdminSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    const usersRepository = dataSource.getRepository(User);

    console.log('Gerando usuário administrador...');
    try {
      await usersRepository.upsert(
        {
          name: 'Administrador',
          email: 'admin@example.com',
          password: bcryptService.hashSync('123123'),
        },
        ['email'],
      );
    } catch (error) {
      console.log(error);
    }
  }
}
