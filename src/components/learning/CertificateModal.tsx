import React, { useEffect, useState } from 'react';
import { Award, Share2, Download, X } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  skillName: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  userName,
  skillName,
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      
      {/* CSS Confetti Implementation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(50)].map((_, i) => (
                <div key={i} className={`absolute w-3 h-3 rounded-sm ${['bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500', 'bg-purple-500'][i % 5]}`} 
                     style={{
                         left: `${Math.random() * 100}%`,
                         top: `-5%`,
                         animation: `fall ${Math.random() * 3 + 2}s linear forwards`,
                         animationDelay: `${Math.random() * 2}s`,
                         transform: `rotate(${Math.random() * 360}deg)`
                     }}
                ></div>
            ))}
            <style>{`
                @keyframes fall {
                    to { transform: translateY(110vh) rotate(720deg); }
                }
            `}</style>
        </div>
      )}

      <div 
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-500 delay-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-200 hover:bg-slate-300 p-2 rounded-full transition-colors z-[60]"
        >
            <X size={20} />
        </button>

        <div className="overflow-y-auto flex-1 custom-scrollbar p-2 md:p-4">
            <div className="p-8 md:p-16 text-center border-[12px] md:border-[16px] border-double border-amber-200 rounded-xl relative bg-[#faf9f6]">
                {/* Background seal */}
                <Award className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 text-amber-500/5" />
                
                <div className="relative z-10">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-inner border border-amber-200">
                        <Award className="text-amber-500 w-8 h-8 md:w-10 md:h-10" />
                    </div>
                    
                    <h1 className="text-2xl md:text-5xl font-serif text-slate-800 tracking-tight mb-2 uppercase" style={{ letterSpacing: '0.1em' }}>
                        Certificate of Completion
                    </h1>
                    <p className="text-slate-500 font-serif italic mb-6 md:mb-10 tracking-widest uppercase text-xs md:text-sm">Certificate of Completion</p>
                    
                    <p className="text-slate-600 mb-2 font-medium">Awarded to</p>
                    <h2 className="text-3xl md:text-5xl font-serif text-blue-900 mb-6 md:mb-8 pb-4 border-b-2 border-amber-200 inline-block px-8 md:px-12 capitalize">
                        {userName || 'Outstanding Learner'}
                    </h2>
                    
                    <p className="text-slate-600 mb-2 font-medium">Has successfully completed the skill course</p>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 md:mb-12">
                        {skillName}
                    </h3>
                    
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-end mt-8 md:mt-16 px-4 md:px-20 border-t border-slate-200 pt-8 gap-6 md:gap-0">
                        <div className="text-center order-2 md:order-1">
                            <p className="font-bold text-slate-800 text-base md:text-lg border-b border-slate-400 pb-1 px-4 mb-2">Skill Compass</p>
                            <p className="text-xs md:text-sm text-slate-500 uppercase tracking-widest">Platform</p>
                        </div>
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-amber-500/20 border-4 border-amber-500 flex items-center justify-center md:rotate-12 relative md:-top-8 shadow-lg shadow-amber-500/20 order-1 md:order-2">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-dashed border-amber-600 flex items-center justify-center text-amber-700 font-bold text-[10px] md:text-xs text-center uppercase tracking-tighter">
                                Official<br/>Certified
                            </div>
                        </div>
                        <div className="text-center order-3">
                            <p className="font-bold text-slate-800 text-base md:text-lg border-b border-slate-400 pb-1 px-4 mb-2">
                                {new Date().toLocaleDateString('vi-VN')}
                            </p>
                            <p className="text-xs md:text-sm text-slate-500 uppercase tracking-widest">Issue Date</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-slate-50 p-4 md:p-6 flex flex-col md:flex-row justify-center gap-3 md:gap-4 border-t border-slate-200 shrink-0">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors shadow-sm">
                <Download size={18} />
                Download PDF
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-medium transition-colors shadow-sm">
                <Share2 size={18} />
                Share on LinkedIn
            </button>
        </div>
      </div>
    </div>
  );
};
