import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ManualSkillData {
  categoryName: string;
  title: string;
  description: string;
  subtopics: string[];
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
  const [subtopics, setSubtopics] = useState(['', '', '']);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim() || !categoryName.trim()) return;
    onSave({ categoryName, title, description, subtopics });
    // Reset
    setTitle('');
    setDescription('');
    setSubtopics(['', '', '']);
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
              <h3 className="text-xl font-bold text-slate-800">Add a New Skill</h3>
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
                Skill Name <span className="text-red-500">*</span>
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
                Category <span className="text-red-500">*</span>
              </label>
              {!isCustomCategory ? (
                <div className="flex gap-2">
                  <select
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all appearance-none"
                  >
                    <option value="" disabled>Select a category...</option>
                    {existingCategories.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <button 
                    onClick={() => { setIsCustomCategory(true); setCategoryName(''); }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-bold transition-colors whitespace-nowrap"
                  >
                    Create New
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Enter a new category name..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                  <button 
                    onClick={() => { setIsCustomCategory(false); setCategoryName(existingCategories[0] || ''); }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-bold transition-colors whitespace-nowrap"
                  >
                    Choose Again
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Short Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this skill is used for..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all min-h-[80px]"
              ></textarea>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-slate-700">
                  Subtopics to Start Learning
                </label>
                <button
                  type="button"
                  onClick={() => setSubtopics([...subtopics, ''])}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-plus"></i> Add Subtopic
                </button>
              </div>
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {subtopics.map((st, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={st}
                      onChange={(e) => {
                        const newSubtopics = [...subtopics];
                        newSubtopics[index] = e.target.value;
                        setSubtopics(newSubtopics);
                      }}
                      placeholder={`Enter subtopic ${index + 1}...`}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                    {subtopics.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newSubtopics = subtopics.filter((_, i) => i !== index);
                          setSubtopics(newSubtopics);
                        }}
                        className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-colors"
                        title="Delete this item"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex gap-3 text-indigo-700 text-sm">
                <i className="fa-solid fa-circle-info mt-0.5"></i>
                <p>The new skill will start at 0% progress with the subtopics you entered.</p>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim() || !categoryName.trim()}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-200"
            >
              <i className="fa-solid fa-check mr-2"></i> Create Skill
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
