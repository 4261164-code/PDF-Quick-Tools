import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Trash2, FileText, Image as ImageIcon, GripVertical, FileDigit } from 'lucide-react';
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
    
    // Set a transparent drag image or customize if needed
    const dragGhost = document.createElement('div');
    dragGhost.style.display = 'none';
    document.body.appendChild(dragGhost);
    e.dataTransfer.setDragImage(dragGhost, 0, 0);
    setTimeout(() => document.body.removeChild(dragGhost), 0);
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
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <FileDigit className="w-4 h-4 text-brand-primary" />
          <h4 className="text-[13px] font-bold uppercase tracking-widest text-text-primary/70">
            Queue <span className="text-brand-primary tabular-nums">[{files.length}]</span>
          </h4>
        </div>
        <span className="text-[11px] font-medium text-text-secondary/50 uppercase tracking-wider">
          Drag to sequence
        </span>
      </div>

      <div className="space-y-3">
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
              className={`group relative flex items-center justify-between gap-4 p-4 bg-surface-main border rounded-xl transition-all duration-300 ${
                isDraggingThis
                  ? 'opacity-30 border-dashed border-brand-primary/50 bg-brand-primary/[0.02] scale-[0.98]'
                  : isDragTarget
                  ? 'border-brand-primary bg-brand-primary/[0.03] translate-y-1 shadow-lg'
                  : 'border-border-subtle hover:border-brand-primary/30 hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className={`cursor-grab active:cursor-grabbing p-1.5 rounded-lg transition-colors ${
                    isDraggingThis ? 'text-brand-primary' : 'text-text-secondary/30 group-hover:text-brand-primary/60 hover:bg-surface-bg'
                  }`}
                  title="Drag to reorder"
                >
                  <GripVertical className="w-5 h-5 stroke-[1.5]" />
                </div>

                <div className="relative w-12 h-12 rounded-xl bg-surface-bg flex items-center justify-center text-text-primary shrink-0 border border-border-subtle group-hover:border-brand-primary/20 transition-colors">
                  {isImage ? (
                    <ImageIcon className="w-5 h-5 stroke-[1.5]" />
                  ) : (
                    <FileText className="w-5 h-5 stroke-[1.5]" />
                  )}
                  <div className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center text-[10px] font-bold text-white border-2 border-white tabular-nums shadow-sm">
                    {index + 1}
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-bold text-text-primary truncate" title={item.name}>
                    {item.name}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] font-mono font-medium text-text-secondary/60 mt-1 uppercase">
                    <span className="tabular-nums tracking-tighter">{formatBytes(item.size)}</span>
                    {typeof item.pageCount === 'number' && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-border-subtle"></span>
                        <span className="tabular-nums tracking-tighter">
                          {item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 bg-surface-bg/50 p-1 rounded-xl border border-border-subtle/50 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                  className="w-10 h-10 inline-flex items-center justify-center text-text-secondary/60 hover:text-brand-primary hover:bg-white disabled:opacity-20 disabled:hover:bg-transparent rounded-lg transition-all active:scale-90"
                  title="Move Up"
                  aria-label={`Move ${item.name} up`}
                >
                  <ArrowUp className="w-4 h-4 stroke-[2]" />
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === files.length - 1}
                  className="w-10 h-10 inline-flex items-center justify-center text-text-secondary/60 hover:text-brand-primary hover:bg-white disabled:opacity-20 disabled:hover:bg-transparent rounded-lg transition-all active:scale-90"
                  title="Move Down"
                  aria-label={`Move ${item.name} down`}
                >
                  <ArrowDown className="w-4 h-4 stroke-[2]" />
                </button>
                <div className="w-px h-6 bg-border-subtle/50 mx-1" />
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="w-10 h-10 inline-flex items-center justify-center text-text-secondary/40 hover:text-brand-primary hover:bg-white rounded-lg transition-all active:scale-90"
                  title="Remove file"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 className="w-4 h-4 stroke-[2]" />
                </button>
              </div>
              
              {/* Mobile always visible controls if on mobile, otherwise hover */}
              <div className="sm:hidden flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="w-10 h-10 flex items-center justify-center text-brand-primary/60 active:scale-95"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

