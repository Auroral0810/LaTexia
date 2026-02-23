import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const chapter = await prisma.learnChapter.findFirst({
    where: { slug: 'ch3' }
  });

  if (!chapter) {
    console.log('Chapter ch3 not found');
    return;
  }

  const sections = await prisma.learnChapter.findMany({
    where: { parentId: chapter.id },
    orderBy: { sortOrder: 'asc' },
    select: { title: true, slug: true, sortOrder: true }
  });

  console.log('Chapter 3 Sections:');
  sections.forEach((s, i) => {
    console.log(`${i + 1}. [${s.sortOrder}] ${s.title} (${s.slug})`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
