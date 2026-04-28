import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useSettings } from '@/src/context/SettingsContext';

interface CanvasMockupProps {
  imageUrl: string;
  title: string;
  className?: string;
  showLabel?: boolean;
}

export function CanvasMockup({ imageUrl, title, className, showLabel = true }: CanvasMockupProps) {
  const { settings } = useSettings();
  const brandName = settings?.brandName || "Marie-Claire";

  return (
    <div className={cn("relative group", className)}>
      {/* Wall Shadow / Glow */}
      <div className="absolute -inset-10 bg-white/[0.02] blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      {/* Frame / Canvas Container */}
      <motion.div 
        whileHover={{ y: -10, scale: 1.01 }}
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        className="relative z-10 bg-[#1A1A1A] p-6 md:p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border-t border-l border-white/10 overflow-hidden"
      >
        {/* Subtle Inner Frame - Black Border */}
        <div className="relative overflow-hidden border-[12px] border-black shadow-inner aspect-[3/4]">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          
          {/* Overlay texture simulation */}
          <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 bg-[url('https://www.transparenttextures.com/patterns/canvas-orange.png')]" />
          
          {/* Lighting effect */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-black/40 via-transparent to-white/5" />
          
          {/* Artist Signature Simulation */}
          <div className="absolute bottom-4 right-4 text-[7px] tracking-[0.2em] text-white/30 italic font-serif">
            {brandName}
          </div>
        </div>
      </motion.div>
      
      {/* Label under it */}
      {showLabel && (
        <div className="mt-8 flex justify-between items-end px-2">
          <div>
            <h3 className="font-serif text-lg text-white group-hover:text-brand-gold transition-colors">{title}</h3>
            <p className="text-[9px] italic text-white/40 mt-1 uppercase tracking-widest font-light">Huile sur toile, Technique mixte</p>
          </div>
          <div className="w-8 h-[1px] bg-white/20 group-hover:w-12 transition-all group-hover:bg-brand-gold" />
        </div>
      )}
    </div>
  );
}
