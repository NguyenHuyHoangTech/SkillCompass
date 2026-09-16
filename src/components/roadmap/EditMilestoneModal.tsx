import React, { useState, useEffect } from 'react';

interface EditMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestoneToEdit?: { id: string, title: string, description: string, categoriesCount?: number, startDate?: string, endDate?: string };
  onSave: (data: { id?: string, title: string, description: string, categoriesCount?: number, startDate?: string, endDate?: string }) => void;
}

export const EditMilestoneModal: React.FC<EditMilestoneModalProps> = ({
  isOpen,
  onClose,
  milestoneToEdit,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoriesCount, setCategoriesCount] = useState(2);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (milestoneToEdit) {
        setTitle(milestoneToEdit.title);
        setDescription(milestoneToEdit.description);
        setCategoriesCount(milestoneToEdit.categoriesCount || 2);
        setStartDate(milestoneToEdit.startDate || '');
        setEndDate(milestoneToEdit.endDate || '');
      } else {
        setTitle('');
        setDescription('');
        setCategoriesCount(2);
        setStartDate('');
        setEndDate('');
      }
    }
  }, [isOpen, milestoneToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSave({
      id: milestoneToEdit?.id,
      title,
      description,
      categoriesCount,
      startDate,
      endDate,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {milestoneToEdit ? 'Chỉnh sửa chặng' : 'Thêm chặng mới'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Tên chặng</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Foundations, Core Tech..."
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                autoFocus
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Mục tiêu (Mô tả)</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả mục tiêu đạt được..."
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[100px] resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Ngày bắt đầu</label>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Ngày kết thúc</label>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2 font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              disabled={!title.trim()}
              className="px-5 py-2 font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
