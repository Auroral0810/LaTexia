
import React from 'react';
import { notFound } from 'next/navigation';
import { chaptersData } from '@/data/chapters';
import SectionContent from '@/components/learn/SectionContent';

export default async function SectionPage({ params }: { params: Promise<{ chapterId: string; sectionId: string }> }) {
  const { chapterId: cId, sectionId: sId } = await params;
  const chapterId = Number(cId);
  const sectionId = Number(sId); // 1-indexed URL
  const sectionIndex = sectionId - 1; // 0-indexed array

  const chapter = chaptersData[chapterId];
  if (!chapter) {
    notFound();
  }

  const section = chapter.sections[sectionIndex];
  if (!section) {
    notFound();
  }

  // Navigation Logic
  const hasPrevSection = sectionIndex > 0;
  const hasNextSection = sectionIndex < chapter.sections.length - 1;
  
  const prevChapter = chaptersData[chapterId - 1];
  const nextChapter = chaptersData[chapterId + 1];

  // URL for navigation
  const prevUrl = hasPrevSection 
    ? `/learn/${chapterId}/${sectionId - 1}`
    : prevChapter ? `/learn/${prevChapter.id}/${prevChapter.sections.length}` : null; 

  
  let nextUrl: string | null = null;
  let nextLabel: string | null = null;

  if (hasNextSection) {
    nextUrl = `/learn/${chapterId}/${sectionId + 1}`;
    nextLabel = '下一节';
  } else if (nextChapter) {
    // Start of next chapter
    nextUrl = `/learn/${nextChapter.id}/1`;
    nextLabel = '下一章';
  }

  let prevNavUrl: string | null = null;
  let prevNavLabel: string | null = null;
  
  if (hasPrevSection) {
    prevNavUrl = `/learn/${chapterId}/${sectionId - 1}`;
    prevNavLabel = '上一节';
  }

  return (
    <SectionContent 
        chapter={chapter}
        section={section}
        chapterId={chapterId}
        sectionId={sectionId}
        sectionIndex={sectionIndex}
        prevNavUrl={prevNavUrl}
        prevNavLabel={prevNavLabel}
        nextUrl={nextUrl}
        nextLabel={nextLabel}
        hasNextSection={hasNextSection}
        nextChapterTitle={nextChapter?.title}
        prevSectionTitle={hasPrevSection ? chapter.sections[sectionIndex - 1]?.title : undefined}
    />
  );
}
