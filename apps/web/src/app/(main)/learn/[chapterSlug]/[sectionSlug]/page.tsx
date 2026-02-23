import React from 'react';
import { notFound } from 'next/navigation';
import { getChapterTree, getChapterBySlug } from '@/lib/learn';
import SectionContent from '@/components/learn/SectionContent';

export default async function SectionPage({ params }: { params: Promise<{ chapterSlug: string; sectionSlug: string }> }) {
  const { chapterSlug, sectionSlug } = await params;

  // 1. 获取当前小节内容
  const section = await getChapterBySlug(sectionSlug).catch(() => null);
  if (!section) {
    notFound();
  }

  // 去掉内容中的第一行 # 标题（页面头部已单独显示）
  let content = section.content;
  content = content.replace(/^#\s+.+\n+/, '');

  // 2. 获取目录树（用于侧边栏和导航）
  const tree = await getChapterTree();
  const chapter = tree.find(c => c.slug === chapterSlug);
  if (!chapter) {
    notFound();
  }

  const sectionIndex = chapter.sections.findIndex(s => s.slug === sectionSlug);
  if (sectionIndex === -1) {
    notFound();
  }

  // 3. 导航逻辑
  const hasPrevSection = sectionIndex > 0;
  const hasNextSection = sectionIndex < chapter.sections.length - 1;
  const currentChapterIndex = tree.findIndex(c => c.slug === chapterSlug);
  const prevChapter = tree[currentChapterIndex - 1];
  const nextChapter = tree[currentChapterIndex + 1];

  // 上一节
  let prevNavUrl: string | null = null;
  let prevNavLabel: string | null = null;
  let prevSectionTitle: string | undefined;
  if (hasPrevSection) {
    const prevSec = chapter.sections[sectionIndex - 1];
    prevNavUrl = `/learn/${chapterSlug}/${prevSec.slug}`;
    prevNavLabel = '上一节';
    prevSectionTitle = prevSec.title;
  } else if (prevChapter && prevChapter.sections.length > 0) {
    const lastSec = prevChapter.sections[prevChapter.sections.length - 1];
    prevNavUrl = `/learn/${prevChapter.slug}/${lastSec.slug}`;
    prevNavLabel = `上一章：${prevChapter.title}`;
    prevSectionTitle = lastSec.title;
  }

  // 下一节
  let nextUrl: string | null = null;
  let nextLabel: string | null = null;
  let nextSectionTitle: string | undefined;
  if (hasNextSection) {
    const nextSec = chapter.sections[sectionIndex + 1];
    nextUrl = `/learn/${chapterSlug}/${nextSec.slug}`;
    nextLabel = '下一节';
    nextSectionTitle = nextSec.title;
  } else if (nextChapter && nextChapter.sections.length > 0) {
    const firstSec = nextChapter.sections[0];
    nextUrl = `/learn/${nextChapter.slug}/${firstSec.slug}`;
    nextLabel = `下一章：${nextChapter.title}`;
    nextSectionTitle = firstSec.title;
  }

  return (
    <SectionContent
      chapterTitle={chapter.title}
      chapterSlug={chapterSlug}
      sections={chapter.sections.map(s => ({ title: s.title, slug: s.slug }))}
      sectionTitle={section.title}
      sectionContent={content}
      sectionIndex={sectionIndex}
      sectionNumber={sectionIndex + 1}
      prevNavUrl={prevNavUrl}
      prevNavLabel={prevNavLabel}
      nextUrl={nextUrl}
      nextLabel={nextLabel}
      prevSectionTitle={prevSectionTitle}
      nextSectionTitle={nextSectionTitle}
    />
  );
}
