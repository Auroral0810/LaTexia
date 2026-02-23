import { getChapterTree } from '@/lib/learn';
import { notFound, redirect } from 'next/navigation';

export default async function ChapterPage({ params }: { params: Promise<{ chapterSlug: string }> }) {
  const { chapterSlug } = await params;
  
  // Fetch tree to find the chapter and its first section
  const tree = await getChapterTree();
  const chapter = tree.find(c => c.slug === chapterSlug);

  if (!chapter || chapter.sections.length === 0) {
    notFound();
  }

  // Redirect to the first section's slug
  redirect(`/learn/${chapterSlug}/${chapter.sections[0].slug}`);
}

