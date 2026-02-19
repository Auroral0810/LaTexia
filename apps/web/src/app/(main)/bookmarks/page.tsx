'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import {
  Star,
  FolderPlus,
  Folder,
  Pencil,
  Trash2,
  BookOpen,
  ChevronRight,
  Loader2,
  Search,
  X,
  Check,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// 难度配色
function getDifficultyConfig(diff: string) {
  switch (diff) {
    case 'easy': return { label: '简单', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' };
    case 'medium': return { label: '中等', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' };
    case 'hard': return { label: '困难', color: 'bg-orange-500/10 text-orange-600 border-orange-500/20' };
    case 'hell': return { label: '地狱', color: 'bg-red-500/10 text-red-600 border-red-500/20' };
    default: return { label: diff, color: 'bg-muted text-muted-foreground border-border' };
  }
}

interface BookmarkItem {
  bookmarkId: string;
  bookmarkedAt: string;
  folderId: string | null;
  problemId: string;
  title: string;
  type: string;
  difficulty: string;
  categoryId: number | null;
  categoryName: string | null;
  attemptCount: number | null;
  correctCount: number | null;
}

interface FolderItem {
  id: string;
  name: string;
  isDefault: boolean;
  createdAt: string;
  count: number;
}

export default function BookmarksPage() {
  const { isAuthenticated, user } = useAuthStore();
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [bookmarkItems, setBookmarkItems] = useState<BookmarkItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [defaultCount, setDefaultCount] = useState(0);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null); // null = 全部
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 12;

  // 创建收藏夹状态
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editFolderName, setEditFolderName] = useState('');

  // 获取收藏夹列表
  const fetchFolders = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/api/bookmarks/folders`, {
        headers: { 'X-User-Id': user.id },
      });
      const data = await res.json();
      if (data.success) {
        setFolders(data.data.folders);
        setTotalCount(data.data.totalCount);
        setDefaultCount(data.data.defaultCount);
      }
    } catch (e) {}
  }, [user]);

  // 获取收藏列表
  const fetchBookmarks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
      if (selectedFolder === 'default') params.set('folderId', 'default');
      else if (selectedFolder) params.set('folderId', selectedFolder);
      
      const res = await fetch(`${API_URL}/api/bookmarks?${params}`, {
        headers: { 'X-User-Id': user.id },
      });
      const data = await res.json();
      if (data.success) {
        setBookmarkItems(data.data.items);
        setTotal(data.data.total);
      }
    } catch (e) {}
    setLoading(false);
  }, [user, page, selectedFolder]);

  useEffect(() => { fetchFolders(); }, [fetchFolders]);
  useEffect(() => { fetchBookmarks(); }, [fetchBookmarks]);

  // 创建收藏夹
  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || !user) return;
    try {
      const res = await fetch(`${API_URL}/api/bookmarks/folders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': user.id },
        body: JSON.stringify({ name: newFolderName.trim() }),
      });
      if (res.ok) {
        setNewFolderName('');
        setShowNewFolder(false);
        fetchFolders();
      }
    } catch (e) {}
  };

  // 重命名收藏夹
  const handleUpdateFolder = async (folderId: string) => {
    if (!editFolderName.trim() || !user) return;
    try {
      await fetch(`${API_URL}/api/bookmarks/folders/${folderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': user.id },
        body: JSON.stringify({ name: editFolderName.trim() }),
      });
      setEditingFolder(null);
      fetchFolders();
    } catch (e) {}
  };

  // 删除收藏夹
  const handleDeleteFolder = async (folderId: string) => {
    if (!user || !confirm('确定删除此收藏夹？其中的收藏将移至未分类。')) return;
    try {
      await fetch(`${API_URL}/api/bookmarks/folders/${folderId}`, {
        method: 'DELETE',
        headers: { 'X-User-Id': user.id },
      });
      if (selectedFolder === folderId) setSelectedFolder(null);
      fetchFolders();
      fetchBookmarks();
    } catch (e) {}
  };

  // 取消收藏
  const handleRemoveBookmark = async (problemId: string) => {
    if (!user) return;
    try {
      await fetch(`${API_URL}/api/bookmarks/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': user.id },
        body: JSON.stringify({ problemId }),
      });
      fetchBookmarks();
      fetchFolders();
    } catch (e) {}
  };

  // 未登录
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Star className="w-16 h-16 text-muted-foreground/30" />
        <h2 className="text-xl font-semibold text-muted-foreground">请先登录</h2>
        <p className="text-sm text-muted-foreground">登录后即可使用收藏功能</p>
        <Link
          href="/login"
          className="mt-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          去登录
        </Link>
      </div>
    );
  }

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* 页面标题 */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-xl bg-amber-500/10">
          <Star className="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">我的收藏</h1>
          <p className="text-sm text-muted-foreground mt-0.5">共收藏 {totalCount} 道题目</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* 左侧：收藏夹列表 */}
        <div className="w-56 shrink-0">
          <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
            <div className="p-3 border-b border-border/40">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">收藏夹</h3>
            </div>
            <div className="p-2 space-y-0.5">
              {/* 全部 */}
              <button
                onClick={() => { setSelectedFolder(null); setPage(1); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedFolder === null
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground hover:bg-muted/50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  全部收藏
                </span>
                <span className="text-xs text-muted-foreground">{totalCount}</span>
              </button>

              {/* 未分类 */}
              <button
                onClick={() => { setSelectedFolder('default'); setPage(1); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedFolder === 'default'
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground hover:bg-muted/50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Folder className="w-4 h-4" />
                  未分类
                </span>
                <span className="text-xs text-muted-foreground">{defaultCount}</span>
              </button>

              {/* 用户收藏夹 */}
              {folders.map(folder => (
                <div key={folder.id} className="group relative">
                  {editingFolder === folder.id ? (
                    <div className="flex items-center gap-1 px-2 py-1">
                      <input
                        autoFocus
                        value={editFolderName}
                        onChange={e => setEditFolderName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleUpdateFolder(folder.id)}
                        className="flex-1 px-2 py-1 text-sm rounded border border-border bg-background outline-none focus:ring-1 focus:ring-primary"
                      />
                      <button onClick={() => handleUpdateFolder(folder.id)} className="p-1 text-emerald-500 hover:bg-emerald-500/10 rounded">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setEditingFolder(null)} className="p-1 text-muted-foreground hover:bg-muted rounded">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setSelectedFolder(folder.id); setPage(1); }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedFolder === folder.id
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <Folder className="w-4 h-4 shrink-0" />
                        <span className="truncate">{folder.name}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">{folder.count}</span>
                        <span className="hidden group-hover:flex items-center gap-0.5">
                          <button
                            onClick={e => { e.stopPropagation(); setEditingFolder(folder.id); setEditFolderName(folder.name); }}
                            className="p-0.5 text-muted-foreground hover:text-primary rounded"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); handleDeleteFolder(folder.id); }}
                            className="p-0.5 text-muted-foreground hover:text-red-500 rounded"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </span>
                      </span>
                    </button>
                  )}
                </div>
              ))}

              {/* 新建收藏夹 */}
              {showNewFolder ? (
                <div className="flex items-center gap-1 px-2 py-1">
                  <input
                    autoFocus
                    value={newFolderName}
                    onChange={e => setNewFolderName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleCreateFolder()}
                    placeholder="收藏夹名称"
                    className="flex-1 px-2 py-1 text-sm rounded border border-border bg-background outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button onClick={handleCreateFolder} className="p-1 text-emerald-500 hover:bg-emerald-500/10 rounded">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => { setShowNewFolder(false); setNewFolderName(''); }} className="p-1 text-muted-foreground hover:bg-muted rounded">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowNewFolder(true)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors"
                >
                  <FolderPlus className="w-4 h-4" />
                  新建收藏夹
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 右侧：收藏的题目列表 */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : bookmarkItems.length === 0 ? (
            /* 空状态 */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                <BookOpen className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <h3 className="text-lg font-semibold text-muted-foreground">暂无收藏</h3>
              <p className="text-sm text-muted-foreground/60 mt-1 max-w-sm">
                在练习页面中点击题目旁的星标按钮即可收藏题目
              </p>
              <Link
                href="/practice"
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <BookOpen className="w-4 h-4" />
                去做题
              </Link>
            </div>
          ) : (
            <>
              {/* 题目网格 */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {bookmarkItems.map(item => {
                  const diffConfig = getDifficultyConfig(item.difficulty);
                  const passRate = item.attemptCount
                    ? Math.round(((item.correctCount || 0) / item.attemptCount) * 100)
                    : 0;

                  return (
                    <div
                      key={item.bookmarkId}
                      className="group bg-card rounded-xl border border-border/50 shadow-sm hover:shadow-md hover:border-border transition-all overflow-hidden"
                    >
                      <Link href={`/practice/${item.problemId}`} className="block p-4">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                            {item.title}
                          </h3>
                          <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold border ${diffConfig.color}`}>
                            {diffConfig.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {item.categoryName && (
                            <span className="px-1.5 py-0.5 bg-muted/50 rounded text-[10px]">{item.categoryName}</span>
                          )}
                          <span>通过率 {passRate}%</span>
                        </div>
                      </Link>
                      <div className="px-4 py-2.5 border-t border-border/40 flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(item.bookmarkedAt).toLocaleDateString('zh-CN')} 收藏
                        </span>
                        <button
                          onClick={() => handleRemoveBookmark(item.problemId)}
                          className="text-amber-500 hover:text-red-500 transition-colors p-1 -mr-1"
                          title="取消收藏"
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 分页 */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 rounded-lg text-sm border border-border hover:bg-muted/50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  >
                    上一页
                  </button>
                  <span className="text-sm text-muted-foreground px-3">
                    {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 rounded-lg text-sm border border-border hover:bg-muted/50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  >
                    下一页
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
