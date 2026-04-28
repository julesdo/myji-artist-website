import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Mail, Link2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useSettings } from '@/src/context/SettingsContext';

const initialData = (window as any).__INITIAL_DATA__;
export const STATIC_BRAND_NAME = initialData?.settings?.brandName || "MYJI";
export const STATIC_FOOTER_DESC = initialData?.settings?.footerDescription || "Une exploration du mouvement perpétuel et de la solitude urbaine à travers des silhouettes évanescentes et des textures brutes.";

export function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const { settings } = useSettings();

  const brandName = settings?.brandName || STATIC_BRAND_NAME;

  const navLinks = [
    { name: 'Galerie', path: '/' },
    { name: 'Séries', path: '/portfolio' },
    { name: 'Journal', path: '/journal' },
    { name: 'Commande', path: '/commission' },
    { name: 'Artiste', path: '/about' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-8 md:px-12 flex justify-between items-center bg-brand-cream/80 backdrop-blur-md border-b border-brand-charcoal/5 pointer-events-none">
        <Link 
          to="/" 
          className="pointer-events-auto font-serif text-2xl md:text-3xl tracking-[0.2em] uppercase hover:opacity-70 transition-opacity text-brand-charcoal"
        >
          {brandName}
        </Link>

        <div className="hidden md:flex gap-12 pointer-events-auto">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "relative text-[10px] uppercase tracking-[0.3em] font-light transition-all group",
                location.pathname === link.path ? "text-brand-charcoal font-bold" : "text-brand-charcoal/40 hover:text-brand-charcoal"
              )}
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.span 
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 w-full h-px bg-brand-charcoal"
                />
              )}
            </Link>
          ))}
        </div>

        <button 
          className="md:hidden pointer-events-auto p-2 text-brand-charcoal"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={24} />
        </button>
      </nav>

      {/* On sort le menu de la nav pour éviter le bug du backdrop-blur */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-brand-charcoal/95 backdrop-blur-xl text-brand-cream z-[100] p-12 pointer-events-auto flex flex-col justify-between"
          >
            <div className="flex justify-end">
              <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
                <X size={32} />
              </button>
            </div>

            <div className="flex flex-col gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="font-serif text-5xl hover:text-brand-gold hover:italic transition-all"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-6 border-t border-brand-cream/10 pt-8">
              {settings?.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer">
                  <Instagram size={20} className="text-brand-cream/60 hover:text-brand-gold transition-colors cursor-pointer" />
                </a>
              )}
              {settings?.pinterestUrl && (
                <a href={settings.pinterestUrl} target="_blank" rel="noopener noreferrer">
                  <Link2 size={20} className="text-brand-cream/60 hover:text-brand-gold transition-colors cursor-pointer" />
                </a>
              )}
              {settings?.contactEmail && (
                <a href={`mailto:${settings.contactEmail}`}>
                  <Mail size={20} className="text-brand-cream/60 hover:text-brand-gold transition-colors cursor-pointer" />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Footer() {
  const { settings } = useSettings();
  const brandName = settings?.brandName || STATIC_BRAND_NAME;
  const footerDesc = settings?.footerDescription || STATIC_FOOTER_DESC;

  return (
    <footer className="px-6 py-24 md:px-12 border-t border-brand-charcoal/5 bg-brand-cream">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-md">
          <h2 className="font-serif text-3xl mb-4 text-brand-charcoal">{brandName}</h2>
          <p className="text-brand-charcoal/40 text-sm leading-relaxed font-light">
            {footerDesc}
          </p>
        </div>
        
        <div className="flex gap-12">
          <div className="flex flex-col gap-2">
            <span className="text-[9px] uppercase tracking-widest text-brand-charcoal/20 mb-2">Navigation</span>
            <Link to="/portfolio" className="text-xs text-brand-charcoal/60 hover:text-brand-charcoal transition-colors">Galerie</Link>
            <Link to="/journal" className="text-xs text-brand-charcoal/60 hover:text-brand-charcoal transition-colors">Journal</Link>
            <Link to="/commission" className="text-xs text-brand-charcoal/60 hover:text-brand-charcoal transition-colors">Commande</Link>
            <Link to="/about" className="text-xs text-brand-charcoal/60 hover:text-brand-charcoal transition-colors">L'Artiste</Link>
            <Link to="/admin" className="text-xs text-brand-gold hover:text-brand-charcoal transition-colors mt-2 border-t border-brand-charcoal/5 pt-2">Espace Admin</Link>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[9px] uppercase tracking-widest text-brand-charcoal/20 mb-2">Réseaux</span>
            {settings?.instagramUrl && (
              <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-charcoal/60 hover:text-brand-charcoal transition-colors lowercase italic">instagram</a>
            )}
            {settings?.pinterestUrl && (
              <a href={settings.pinterestUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-charcoal/60 hover:text-brand-charcoal transition-colors lowercase italic">pinterest</a>
            )}
            {settings?.otherContactUrl && (
              <a href={settings.otherContactUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-charcoal/60 hover:text-brand-charcoal transition-colors lowercase italic">Contact</a>
            )}
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-24 pt-8 flex justify-between items-center text-[9px] tracking-[0.3em] text-brand-charcoal/20 uppercase border-t border-brand-charcoal/5">
        <span>Signature — {brandName}</span>
        <span>© {new Date().getFullYear()} — TOUS DROITS RÉSERVÉS</span>
      </div>
    </footer>
  );
}
