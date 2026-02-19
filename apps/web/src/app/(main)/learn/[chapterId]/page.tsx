
import { chaptersData } from '@/data/chapters';
import { notFound, redirect } from 'next/navigation';

export default async function ChapterPage({ params }: { params: Promise<{ chapterId: string }> }) {
  const { chapterId: idStr } = await params;
  const chapterId = Number(idStr);
  const chapter = chaptersData[chapterId];

  // If chapter not found, let it 404
  if (!chapter) {
    notFound();
  }

  // Redirect to the first section (index 1) which corresponds to /learn/[chapterId]/1
  redirect(`/learn/${chapterId}/1`);
}
