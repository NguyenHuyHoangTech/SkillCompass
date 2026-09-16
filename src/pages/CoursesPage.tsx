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

  const [isBannerExpanded, setIsBannerExpanded] = useState(false);

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden w-full">
      {/* Compact Dynamic Hero Banner Section */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 text-white shrink-0 border-b border-blue-800/50 dark:border-slate-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left Title & Subtitle */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/30 dark:bg-cyan-500/20 border border-blue-400/30 dark:border-cyan-500/30 flex items-center justify-center text-blue-400 dark:text-cyan-400 shrink-0">
                <PlayCircle size={22} />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white leading-tight flex items-center gap-2">
                  Accelerate Your Career
                  <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    🎓 2M+ Learners
                  </span>
                </h1>
                <p className="text-xs text-blue-200 dark:text-slate-400 line-clamp-1">
                  Learn from industry experts & build real-world projects
                </p>
              </div>
            </div>

            {/* Right Integrated Search & Expand Toggle */}
            <div className="flex items-center gap-2.5">
              <div className="relative w-48 sm:w-64 md:w-80">
                <input 
                  type="text" 
                  placeholder="Search courses..." 
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-cyan-500 shadow-sm font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" size={15} />
              </div>

              <button
                onClick={() => setIsBannerExpanded(!isBannerExpanded)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10 text-xs font-semibold flex items-center gap-1 shrink-0"
                title={isBannerExpanded ? 'Collapse Header' : 'Expand Header Details'}
              >
                <span className="hidden md:inline">{isBannerExpanded ? 'Less' : 'More'}</span>
                {isBannerExpanded ? '▲' : '▼'}
              </button>
            </div>
          </div>

          {/* Expandable Extra Details */}
          {isBannerExpanded && (
            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fadeIn">
              <p className="text-sm text-blue-100 dark:text-slate-300 max-w-2xl leading-relaxed">
                Earn certificates, master modern tech stacks (React, Node.js, AI Engineering, Micro-frontends), and prepare for technical interviews with guided project paths.
              </p>

              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  <img className="w-9 h-9 rounded-full border-2 border-blue-900 dark:border-slate-800 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Learner" />
                  <img className="w-9 h-9 rounded-full border-2 border-blue-900 dark:border-slate-800 object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="Learner" />
                  <img className="w-9 h-9 rounded-full border-2 border-blue-900 dark:border-slate-800 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Learner" />
                  <div className="w-9 h-9 rounded-full border-2 border-blue-900 dark:border-slate-800 bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold text-[10px]">+2M</div>
                </div>
                <span className="text-xs text-blue-200 dark:text-slate-400 font-medium">Joined globally</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 md:p-8 relative bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          
          {/* Mobile Search (Visible only on small screens) */}
          <div className="relative mb-6 md:hidden">
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="w-full pl-4 pr-10 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-3.5 text-slate-400 dark:text-slate-500" size={20} />
          </div>

          {/* Filters and Title */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {searchQuery ? `Search results for "${searchQuery}"` : 'Recommended for You'}
            </h2>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar -mx-2 px-2 md:mx-0 md:px-0 md:pb-0 hide-scrollbar">
              <span className="text-slate-500 dark:text-slate-400 font-medium mr-2 flex items-center gap-1 shrink-0"><Filter size={16}/> Filter by:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    activeCategory === cat 
                      ? 'bg-blue-600 dark:bg-cyan-600 text-white shadow-md' 
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
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
                  className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col h-full hover:-translate-y-1"
                >
                  {/* Card Image Cover */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img 
                      src={course.imageUrl} 
                      alt={course.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                       <button className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-white dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-cyan-400 transition-colors">
                          <PlayCircle size={18} /> Preview
                       </button>
                    </div>
                    {/* Tags overlay */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                      {course.tags.slice(0,1).map(tag => (
                        <span key={tag} className="bg-white/90 dark:bg-slate-900/90 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur text-blue-700 dark:text-cyan-400 text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{course.provider}</span>
                    </div>
                    
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                      {course.title}
                    </h3>
                    
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-1 flex-1">
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
                         <Star size={14} fill="currentColor" className={course.rating >= 4.8 ? '' : 'text-slate-300 dark:text-slate-700'} />
                      </div>
                      <span className="text-slate-400 dark:text-slate-500 text-xs">({course.reviewsCount.toLocaleString()})</span>
                    </div>
                    
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-between mt-auto">
                       <div className="flex flex-col">
                          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1"><Clock size={12}/> {course.duration}</span>
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-1">{course.level}</span>
                       </div>
                       <div className="text-right flex flex-col items-end">
                         <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{course.price === 'Free' || course.price.includes('Free') ? 'Free' : course.price}</span>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
               <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                 <Search size={40} className="text-slate-300 dark:text-slate-600" />
               </div>
               <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">No courses found</h3>
               <p className="text-slate-500 dark:text-slate-400 max-w-md">We couldn't find any courses matching "{searchQuery}" in the {activeCategory} category.</p>
               <button 
                 onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                 className="mt-6 px-6 py-2 bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-cyan-400 font-semibold rounded-lg hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors border border-blue-200 dark:border-slate-700"
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
