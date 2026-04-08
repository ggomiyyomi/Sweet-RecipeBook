import { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { categoriesApi } from '../api/categories';
import { useCategoryStore } from '../store/useCategoryStore';
import type { Category } from '../types';

export function CategoryPage() {
  const { categories, setCategories, addCategory, updateCategory, removeCategory, setLoading } = useCategoryStore();
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    setLoading(true);
    categoriesApi.getAll()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    const created = await categoriesApi.create({
      name: newName.trim(),
      sortOrder: categories.length,
    });
    addCategory(created);
    setNewName('');
  };

  const handleDelete = async (id: number) => {
    await categoriesApi.remove(id);
    removeCategory(id);
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.categoryId);
    setEditName(cat.name);
  };

  const handleEditSave = async (id: number) => {
    if (!editName.trim()) return;
    const updated = await categoriesApi.update(id, { name: editName.trim() });
    updateCategory(id, updated);
    setEditingId(null);
  };

  return (
    <AppLayout>
      <div className="animate-fade-in-up">
        <div className="mb-8">
          <p className="text-sm text-brown-400 mb-1">레시피 분류</p>
          <h1 className="text-3xl font-bold text-brown-800">INDEX</h1>
          <p className="text-sm text-brown-400 mt-1">
            나만의 기준으로 레시피를 분류해보세요
          </p>
        </div>

        {/* 새 카테고리 추가 */}
        <GlassCard variant="strong" padding="md" className="mb-6">
          <p className="text-sm font-medium text-brown-700 mb-3">새 카테고리 추가</p>
          <div className="flex gap-3">
            <Input
              placeholder="예: 엄마 레시피, 베이킹, 다이어트식…"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="flex-1"
            />
            <Button onClick={handleAdd} disabled={!newName.trim()}>
              추가
            </Button>
          </div>
        </GlassCard>

        {/* 카테고리 목록 */}
        <div className="flex flex-col gap-3">
          {categories.map((cat, i) => (
            <GlassCard
              key={cat.categoryId}
              variant="default"
              padding="sm"
              className={`animate-fade-in-up delay-${Math.min(i * 50 + 100, 300)}`}
            >
              <div className="flex items-center gap-3">
                {/* 드래그 핸들 */}
                <div className="text-brown-300 cursor-grab select-none px-1">⠿</div>

                {/* 이름 */}
                <div className="flex-1">
                  {editingId === cat.categoryId ? (
                    <input
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleEditSave(cat.categoryId);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      className="w-full bg-transparent text-sm font-medium text-brown-800 outline-none border-b border-primary-300 pb-0.5"
                    />
                  ) : (
                    <span className="text-sm font-medium text-brown-800">{cat.name}</span>
                  )}
                </div>

                {/* 버튼 */}
                <div className="flex items-center gap-1">
                  {editingId === cat.categoryId ? (
                    <>
                      <Button size="sm" onClick={() => handleEditSave(cat.categoryId)}>
                        저장
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                        취소
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(cat)}>
                        수정
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(cat.categoryId)}
                        className="text-red-400 hover:text-red-500"
                      >
                        삭제
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}

          {categories.length === 0 && (
            <GlassCard variant="subtle" padding="lg" className="text-center">
              <p className="text-4xl mb-3">🏷️</p>
              <p className="text-sm text-brown-400">아직 카테고리가 없어요</p>
              <p className="text-xs text-brown-300 mt-1">위에서 새 카테고리를 추가해보세요</p>
            </GlassCard>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
