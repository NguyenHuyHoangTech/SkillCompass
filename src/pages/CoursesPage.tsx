import React, { useState } from 'react';
import { Search, Star, Clock, Filter, PlayCircle } from 'lucide-react';
import { mockCoursesData, type Course } from '../data/mockCoursesData';

export const CoursesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Frontend', 'Backend', 'UI/UX', 'AI', 'Architecture'];

  const filteredCourses = mockCoursesData.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeCategory === 'All') return matchesSearch;
    return matchesSearch && course.tags.some(tag => tag.includes(activeCategory) || activeCategory.includes(tag));
  });

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden w-full">
      {/* Hero Banner Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
              Accelerate your career with world-class courses
            </h1>
            <p className="text-blue-100 text-lg mb-8 max-w-xl">
              Learn from industry experts, build real-world projects, and earn certificates to stand out in the tech industry.
            </p>
            <div className="relative max-w-lg hidden md:block">
              <input 
                type="text" 
                placeholder="What do you want to learn today?" 
                className="w-full pl-4 pr-12 py-4 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-400 shadow-xl text-lg font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors flex items-center justify-center">
                <Search size={24} />
              </button>
            </div>
          </div>
          
          <div className="hidden md:flex flex-col gap-4 items-end">
            <div className="flex -space-x-4">
              <img className="w-12 h-12 rounded-full border-4 border-blue-800 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Learner" />
              <img className="w-12 h-12 rounded-full border-4 border-blue-800 object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="Learner" />
              <img className="w-12 h-12 rounded-full border-4 border-blue-800 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Learner" />
              <div className="w-12 h-12 rounded-full border-4 border-blue-800 bg-white flex items-center justify-center text-blue-800 font-bold text-xs">+2M</div>
            </div>
            <p className="text-blue-200 text-sm font-medium">Join millions of learners globally</p>
          </div>
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 relative">
        <div className="max-w-7xl mx-auto">
          
          {/* Mobile Search (Visible only on small screens) */}
          <div className="relative mb-6 md:hidden">
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="w-full pl-4 pr-10 py-3 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-3.5 text-slate-400" size={20} />
          </div>

          {/* Filters and Title */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-bold text-slate-800">
              {searchQuery ? `Search results for "${searchQuery}"` : 'Recommended for You'}
            </h2>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar -mx-2 px-2 md:mx-0 md:px-0 md:pb-0 hide-scrollbar">
              <span className="text-slate-500 font-medium mr-2 flex items-center gap-1 shrink-0"><Filter size={16}/> Filter by:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    activeCategory === cat 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Course Grid */}
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course: Course) => (
                <div 
                  key={course.id} 
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col h-full hover:-translate-y-1"
                >
                  {/* Card Image Cover */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img 
                      src={course.imageUrl} 
                      alt={course.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                       <button className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-white hover:text-blue-700 transition-colors">
                          <PlayCircle size={18} /> Preview
                       </button>
                    </div>
                    {/* Tags overlay */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                      {course.tags.slice(0,1).map(tag => (
                        <span key={tag} className="bg-white/90 backdrop-blur text-blue-700 text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{course.provider}</span>
                    </div>
                    
                    <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h3>
                    
                    <p className="text-slate-500 text-sm mb-4 line-clamp-1 flex-1">
                      {course.instructor}
                    </p>
                    
                    {/* Ratings */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-amber-500 font-bold text-sm">{course.rating.toFixed(1)}</span>
                      <div className="flex items-center text-amber-400">
                         <Star size={14} fill="currentColor" />
                         <Star size={14} fill="currentColor" />
                         <Star size={14} fill="currentColor" />
                         <Star size={14} fill="currentColor" />
                         <Star size={14} fill="currentColor" className={course.rating >= 4.8 ? '' : 'text-slate-300'} />
                      </div>
                      <span className="text-slate-400 text-xs">({course.reviewsCount.toLocaleString()})</span>
                    </div>
                    
                    <div className="border-t border-slate-100 pt-4 flex items-center justify-between mt-auto">
                       <div className="flex flex-col">
                          <span className="text-xs text-slate-500 flex items-center gap-1"><Clock size={12}/> {course.duration}</span>
                          <span className="text-xs font-medium text-slate-600 mt-1">{course.level}</span>
                       </div>
                       <div className="text-right flex flex-col items-end">
                         <span className="text-sm font-bold text-emerald-600">{course.price === 'Free' || course.price.includes('Free') ? 'Free' : course.price}</span>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
               <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                 <Search size={40} className="text-slate-300" />
               </div>
               <h3 className="text-xl font-bold text-slate-700 mb-2">No courses found</h3>
               <p className="text-slate-500 max-w-md">We couldn't find any courses matching "{searchQuery}" in the {activeCategory} category.</p>
               <button 
                 onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                 className="mt-6 px-6 py-2 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition-colors"
               >
                 Clear all filters
               </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
