import { prisma } from '../prisma';

console.log('Adicionando UTFPR como instituição base');
export async function createInstitutionBase() {
  const city = await prisma.city.findFirst({
    where: { name: 'Guarapuava' },
  });

  const institution = {
    name: 'Universidade Tecnológica Federal do Paraná',
    cityId: city.id,
  };

  return institution;
}
