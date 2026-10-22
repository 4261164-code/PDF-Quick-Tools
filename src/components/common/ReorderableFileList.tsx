import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Trash2, FileText, Image as ImageIcon, GripVertical } from 'lucide-react';
import type { FileItem } from '../../types';
import { formatBytes } from '../../utils/fileValidation';

interface ReorderableFileListProps {
  files: FileItem[];
  onReorder: (files: FileItem[]) => void;
  onRemove: (id: string) => void;
  isImage?: boolean;
}

export const ReorderableFileList: React.FC<ReorderableFileListProps> = ({
  files,
  onReorder,
  onRemove,
  isImage = false,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= files.length) return;

    const newFiles = [...files];
    const [moved] = newFiles.splice(index, 1);
    newFiles.splice(targetIndex, 0, moved);
    onReorder(newFiles);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `${index}`);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newFiles = [...files];
    const [movedItem] = newFiles.splice(draggedIndex, 1);
    newFiles.splice(targetIndex, 0, movedItem);

    setDraggedIndex(null);
    setDragOverIndex(null);
    onReorder(newFiles);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  if (files.length === 0) return null;

  return (
    <div className="space-y-2 w-full">
      <div className="flex items-center justify-between text-xs text-slate-500 pb-1 px-1">
        <span>Staged Documents ({files.length})</span>
        <span className="text-[11px] text-slate-400">Drag items or use arrow keys to reorder</span>
      </div>

      <div className="space-y-2">
        {files.map((item, index) => {
          const isDraggingThis = draggedIndex === index;
          const isDragTarget = dragOverIndex === index && !isDraggingThis;

          return (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center justify-between gap-3 p-3 bg-white border rounded-lg shadow-2xs transition-all cursor-grab active:cursor-grabbing ${
                isDraggingThis
                  ? 'opacity-40 border-red-400 scale-[0.99]'
                  : isDragTarget
                  ? 'border-red-600 bg-red-50/30 ring-2 ring-red-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="text-slate-400 hover:text-slate-600 p-1 cursor-grab"
                  title="Drag to reorder"
                >
                  <GripVertical className="w-4 h-4" />
                </div>

                <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                  {isImage ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate" title={item.name}>
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="tabular-nums">{formatBytes(item.size)}</span>
                    {typeof item.pageCount === 'number' && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">
                          {item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'}
                        </span>
                      </>
                    )}
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-400 font-mono text-[11px]">#{index + 1}</span>
                  </div>
                </div>
              </div>

              {/* Accessible Reorder buttons & Remove */}
              <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-20 disabled:hover:bg-transparent rounded transition-colors"
                  title="Move Up in sequence"
                  aria-label={`Move ${item.name} up`}
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === files.length - 1}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-20 disabled:hover:bg-transparent rounded transition-colors"
                  title="Move Down in sequence"
                  aria-label={`Move ${item.name} down`}
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-slate-200 mx-1" />
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Remove from merge list"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
