import { prisma } from '../prisma';

export async function coursesBase() {
  const institution = await prisma.institution.findFirst({
    where: { name: 'Universidade Tecnológica Federal do Paraná' },
  });

  const area = await prisma.area.findFirst({
    where: { title: 'Ciência da Computação' },
  });

  const coursesAlreadyExists = await prisma.course.findMany({
    where: { institutionId: institution.id },
  });

  if (coursesAlreadyExists.length > 0) {
    console.log('Cursos da UTFPR já adicionados');
    return [];
  }

  console.log('Adicionando cursos da UTFPR como base');
  const courses = [
    {
      areaId: area.id,
      name: 'Tecnologia em Sistema para Internet',
      institutionId: institution.id,
    },
  ];

  return courses;
}
