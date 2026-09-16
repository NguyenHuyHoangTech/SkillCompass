import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ManualSkillData {
  categoryName: string;
  title: string;
  description: string;
}

interface AddSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ManualSkillData) => void;
  existingCategories: string[];
}

export const AddSkillModal: React.FC<AddSkillModalProps> = ({ isOpen, onClose, onSave, existingCategories }) => {
  const [categoryName, setCategoryName] = useState(existingCategories[0] || '');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim() || !categoryName.trim()) return;
    onSave({ categoryName, title, description });
    // Reset
    setTitle('');
    setDescription('');
    setIsCustomCategory(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[99] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col"
        >
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <i className="fa-solid fa-plus text-lg"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-800">Thêm kỹ năng mới</h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Tên kỹ năng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: System Design, GraphQL..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Danh mục <span className="text-red-500">*</span>
              </label>
              {!isCustomCategory ? (
                <div className="flex gap-2">
                  <select
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all appearance-none"
                  >
                    <option value="" disabled>Chọn danh mục...</option>
                    {existingCategories.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <button 
                    onClick={() => { setIsCustomCategory(true); setCategoryName(''); }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-bold transition-colors whitespace-nowrap"
                  >
                    Tạo mới
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Nhập tên danh mục mới..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                  <button 
                    onClick={() => { setIsCustomCategory(false); setCategoryName(existingCategories[0] || ''); }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-bold transition-colors whitespace-nowrap"
                  >
                    Chọn lại
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Mô tả ngắn
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả kỹ năng này dùng để làm gì..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all min-h-[80px]"
              ></textarea>
            </div>
            
            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex gap-3 text-indigo-700 text-sm">
                <i className="fa-solid fa-circle-info mt-0.5"></i>
                <p>Kỹ năng mới sẽ được tạo với 0% tiến độ và 3 mục nhỏ (subtopics) mặc định để bạn bắt đầu.</p>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim() || !categoryName.trim()}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-200"
            >
              <i className="fa-solid fa-check mr-2"></i> Tạo kỹ năng
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
