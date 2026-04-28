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
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-8 md:px-12 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-black/5 pointer-events-none">
      <Link 
        to="/" 
        className="pointer-events-auto font-serif text-2xl md:text-3xl tracking-[0.2em] uppercase hover:opacity-70 transition-opacity text-neutral-900"
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
              location.pathname === link.path ? "text-neutral-900 font-bold" : "text-neutral-500 hover:text-neutral-900"
            )}
          >
            {link.name}
            {location.pathname === link.path && (
              <motion.span 
                layoutId="nav-underline"
                className="absolute -bottom-1 left-0 w-full h-px bg-neutral-900"
              />
            )}
          </Link>
        ))}
      </div>

      <button 
        className="md:hidden pointer-events-auto p-2"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={24} className="text-neutral-900" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-neutral-50/95 backdrop-blur-xl text-neutral-900 z-[60] p-12 pointer-events-auto flex flex-col justify-between"
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
                    className="font-serif text-5xl hover:italic transition-all"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-6 border-t border-neutral-200 pt-8">
              {settings?.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer">
                  <Instagram size={20} className="hover:text-yellow-600 transition-colors cursor-pointer" />
                </a>
              )}
              {settings?.pinterestUrl && (
                <a href={settings.pinterestUrl} target="_blank" rel="noopener noreferrer">
                  <Link2 size={20} className="hover:text-yellow-600 transition-colors cursor-pointer" />
                </a>
              )}
              {settings?.contactEmail && (
                <a href={`mailto:${settings.contactEmail}`}>
                  <Mail size={20} className="hover:text-yellow-600 transition-colors cursor-pointer" />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export function Footer() {
  const { settings } = useSettings();
  const brandName = settings?.brandName || STATIC_BRAND_NAME;
  const footerDesc = settings?.footerDescription || STATIC_FOOTER_DESC;

  return (
    <footer className="px-6 py-24 md:px-12 border-t border-neutral-200 bg-neutral-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-md">
          <h2 className="font-serif text-3xl mb-4 text-neutral-900">{brandName}</h2>
          <p className="text-neutral-500 text-sm leading-relaxed font-light">
            {footerDesc}
          </p>
        </div>
        
        <div className="flex gap-12">
          <div className="flex flex-col gap-2">
            <span className="text-[9px] uppercase tracking-widest text-neutral-400 mb-2">Navigation</span>
            <Link to="/portfolio" className="text-xs text-neutral-600 hover:text-neutral-900 transition-colors">Galerie</Link>
            <Link to="/journal" className="text-xs text-neutral-600 hover:text-neutral-900 transition-colors">Journal</Link>
            <Link to="/commission" className="text-xs text-neutral-600 hover:text-neutral-900 transition-colors">Commande</Link>
            <Link to="/about" className="text-xs text-neutral-600 hover:text-neutral-900 transition-colors">L'Artiste</Link>
            <Link to="/admin" className="text-xs text-yellow-600 hover:text-neutral-900 transition-colors mt-2 border-t border-neutral-200 pt-2">Espace Admin</Link>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[9px] uppercase tracking-widest text-neutral-400 mb-2">Réseaux</span>
            {settings?.instagramUrl && (
              <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-neutral-600 hover:text-neutral-900 transition-colors lowercase italic">instagram</a>
            )}
            {settings?.pinterestUrl && (
              <a href={settings.pinterestUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-neutral-600 hover:text-neutral-900 transition-colors lowercase italic">pinterest</a>
            )}
            {settings?.otherContactUrl && (
              <a href={settings.otherContactUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-neutral-600 hover:text-neutral-900 transition-colors lowercase italic">Contact</a>
            )}
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-24 pt-8 flex justify-between items-center text-[9px] tracking-[0.3em] text-neutral-400 uppercase border-t border-neutral-200">
        <span>Signature — {brandName}</span>
        <span>© {new Date().getFullYear()} — TOUS DROITS RÉSERVÉS</span>
      </div>
    </footer>
  );
}
