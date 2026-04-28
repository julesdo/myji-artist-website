import { BrowserRouter as Router, Routes, Route, Link, useParams, useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import React from 'react';
import { Navigation, Footer } from '@/src/components/Layout';
import ScrollToTop from '@/src/components/ScrollToTop';
import { cn, slugify } from '@/src/lib/utils';
import { CanvasMockup } from '@/src/components/CanvasMockup';
import { useTheme, getContrastColor, FontOption } from './context/ThemeContext';
import { 
  ArrowRight, ArrowLeft, ChevronDown, Plus, Trash2, AlertCircle, 
  Upload, Image, FileText, Settings, Check, Mail, Palette, 
  MousePointer2, Lock, LogOut, Key, Tag 
} from 'lucide-react';
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@mantine/core/styles.css";
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { SettingsProvider, useSettings } from '@/src/context/SettingsContext';
import { AuthProvider, useAuth } from '@/src/context/AuthContext';
import { CategorySelector } from '@/src/components/CategorySelector';
import { SeriesSelector } from '@/src/components/SeriesSelector';

// Error Boundary Component for Convex
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex flex-col items-center justify-center bg-brand-cream text-white p-6 text-center">
          <AlertCircle size={48} className="text-brand-gold mb-6" />
          <h2 className="font-serif text-3xl mb-4 italic">Connexion au catalogue en cours...</h2>
          <p className="text-brand-charcoal/40 max-w-md text-sm leading-relaxed mb-8 font-light">
            L'accès à la galerie nécessite une synchronisation avec Convex. 
            Vérifiez que vos fonctions sont déployées ou contactez l'administrateur.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 border border-brand-charcoal/10 text-[10px] uppercase tracking-widest hover:bg-brand-charcoal hover:text-brand-cream transition-all"
          >
            Réessayer la connexion
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Hero() {
  const { settings } = useSettings();
  const initialSettings = (window as any).__INITIAL_DATA__?.settings || {};
  const artworks = useQuery(api.artworks.get);
  const initialArtworks = (window as any).__INITIAL_DATA__?.artworks || [];
  
  const currentArtworks = artworks || initialArtworks;
  const featuredArtworks = currentArtworks?.filter((a: any) => a.featured) || [];
  
  const heroImage = settings?.heroImage || initialSettings.heroImage || featuredArtworks[0]?.imageUrl || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1200";
  const heroTitle = settings?.heroTitle || initialSettings.heroTitle || "MYJI Portfolio.";
  const heroSubtitle = settings?.heroSubtitle || initialSettings.heroSubtitle || "Une quête de la verticalité et du geste, où chaque silhouette raconte le mouvement d'une vie qui avance.";
  
  const focusArtwork = featuredArtworks[0];

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative h-screen flex flex-col md:flex-row items-center px-6 md:px-12 pt-20 overflow-hidden">
      <motion.div 
        style={{ y, opacity }}
        className="w-full md:w-1/2 flex flex-col justify-center z-10"
      >
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <span className="h-[1px] w-12 bg-brand-charcoal/30"></span>
          <span className="text-[10px] uppercase tracking-[0.4em] text-brand-charcoal/50">{settings?.heroTopLabel || "L'Exposition Virtuelle"}</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-serif text-6xl md:text-[7vw] tracking-tight leading-[0.9] mb-8"
        >
          <div dangerouslySetInnerHTML={{ __html: heroTitle }} />
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm md:text-base text-brand-charcoal/60 leading-relaxed max-w-sm mb-12 font-light"
        >
          {heroSubtitle}
        </motion.p>

        {focusArtwork && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="p-8 bg-brand-charcoal/[0.03] border border-brand-charcoal/5 rounded-sm max-w-sm backdrop-blur-sm"
          >
            <div className="text-[9px] uppercase tracking-widest text-brand-charcoal/40 mb-4">Focus Actuel</div>
            <h3 className="text-xl font-serif italic mb-4 font-light leading-snug">{focusArtwork.title}</h3>
            <Link to="/portfolio" className="text-[9px] uppercase border-b border-brand-charcoal/20 pb-1 hover:text-brand-gold transition-colors tracking-widest">Voir la collection</Link>
          </motion.div>
        )}
      </motion.div>

      <div className="w-full md:w-1/2 flex items-center justify-center py-20">
        <motion.div
           initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
           animate={{ opacity: 1, scale: 1, rotateY: 0 }}
           transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
           className="w-full max-w-md perspective-1000"
        >
           <CanvasMockup 
              imageUrl={heroImage} 
              title={settings?.heroTitle?.replace(/<[^>]*>?/gm, '') || ""}
              className="scale-90 md:scale-100" 
           />
        </motion.div>
      </div>

      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none" />
    </section>
  );
}

function HomePage() {
  const artworks = useQuery(api.artworks.get);
  const { settings } = useSettings();
  
  if (!artworks) return <div className="h-screen flex items-center justify-center font-serif italic opacity-30">Chargement...</div>;

  const featuredArtworks = artworks.filter((a: any) => a.featured);
  const statement = settings?.homeStatement || "\"Peindre c'est marcher une seconde fois, <br /><span className='italic'>mais cette fois sur le fil de la couleur.</span>\"";

  return (
    <div className="overflow-x-hidden bg-brand-cream text-brand-charcoal">
      <Hero />
      
      {/* Featured Works Grid */}
      <section className="px-6 py-40 md:px-12 max-w-7xl mx-auto border-t border-brand-charcoal/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-40">
          {featuredArtworks.slice(0, 2).map((artwork: any, i: number) => (
            <motion.div
              key={artwork._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            >
              <Link to={`/artwork/${artwork.slug || artwork._id}`}>
                <CanvasMockup 
                  imageUrl={artwork.imageUrl} 
                  title={artwork.title} 
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Large Statement */}
      <section className="py-40 px-6 border-y border-brand-charcoal/5 bg-brand-charcoal/[0.02]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="font-serif text-4xl md:text-6xl leading-tight opacity-90 font-light"
            dangerouslySetInnerHTML={{ __html: statement }}
          />
        </div>
      </section>
    </div>
  );
}

function PortfolioPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get('series') || 'all';
  
  const initialData = (window as any).__INITIAL_DATA__;
  const artworksQuery = useQuery(api.artworks.get);
  const seriesQuery = useQuery(api.series.get);
  
  const artworks = artworksQuery || initialData?.artworks;
  const seriesData = seriesQuery || initialData?.series;
  
  if (!artworks || !seriesData) return <div className="h-screen flex items-center justify-center font-serif italic opacity-30">Chargement...</div>;

  const filteredArtworks = filter === 'all' 
    ? artworks 
    : artworks.filter((a: any) => a.series === filter);

  const activeSeriesInfo = seriesData.find(s => s.title === filter);

  return (
    <div className="pt-40 px-6 md:px-12 pb-32 max-w-7xl mx-auto">
      <div className="mb-24 text-center">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-serif text-6xl md:text-8xl tracking-tighter mb-12"
        >
          {filter === 'all' ? 'Collections.' : `${filter}.`}
        </motion.h1>
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 border-b border-brand-charcoal/5 pb-8 mb-16">
           {['Toutes', ...seriesData.map(s => s.title)].map((s: string, i: number) => {
             const actualValue = s === 'Toutes' ? 'all' : s;
             return (
               <button
                  key={s}
                  onClick={() => setSearchParams({ series: actualValue })}
                  className={cn(
                    "text-[10px] uppercase tracking-[0.3em] transition-all cursor-pointer",
                    filter === actualValue 
                      ? "text-brand-gold font-bold scale-110" 
                      : "text-brand-charcoal/40 hover:text-brand-charcoal"
                  )}
               >
                 {s}
               </button>
             );
           })}
        </div>

        {/* Series Detail (if filtered) */}
        <AnimatePresence mode="wait">
          {filter !== 'all' && activeSeriesInfo && (
            <motion.div 
              key={filter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto mb-24 grid grid-cols-1 md:grid-cols-2 gap-12 text-left items-center bg-brand-charcoal/[0.02] border border-brand-charcoal/5 p-8 md:p-12"
            >
              <div className="aspect-square bg-brand-charcoal/40 overflow-hidden border border-brand-charcoal/10">
                <img src={activeSeriesInfo.imageUrl} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
              </div>
              <div>
                <span className="text-[10px] text-brand-gold uppercase tracking-[0.4em] mb-4 block">{activeSeriesInfo.year}</span>
                <h2 className="font-serif text-3xl mb-4 italic leading-tight">{activeSeriesInfo.title}</h2>
                <p className="text-brand-charcoal/60 text-sm leading-relaxed font-light italic">
                  {activeSeriesInfo.description}
                </p>
              </div>
            </motion.div>
          )}

          {/* Grid of Series (if index) */}
          {filter === 'all' && (
            <motion.div 
              key="index"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {seriesData.map((s, i) => (
                <div 
                  key={s._id}
                  onClick={() => setSearchParams({ series: s.title })}
                  className="group cursor-pointer relative aspect-[4/5] overflow-hidden border border-brand-charcoal/5 bg-brand-charcoal/40"
                >
                  <img 
                    src={s.imageUrl} 
                    className="w-full h-full object-cover opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" 
                  />
                  <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col items-start translate-y-4 group-hover:translate-y-0 transition-transform">
                    <span className="text-[8px] text-brand-gold uppercase tracking-[0.4em] mb-2">{s.year}</span>
                    <h3 className="font-serif text-2xl italic mb-2">{s.title}</h3>
                    <p className="text-[10px] text-brand-charcoal/40 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Découvrir la collection</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-brand-charcoal/5 pt-24">
        <div className="flex justify-between items-center mb-12">
          <h2 className="font-serif text-3xl italic">{filter === 'all' ? 'Toutes les Œuvres' : 'Les Œuvres de la Série'}</h2>
          <span className="text-[10px] uppercase tracking-widest text-brand-charcoal/30">{filteredArtworks.length} pièces</span>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24"
        >
          <AnimatePresence mode="popLayout">
            {filteredArtworks.map((artwork: any, i: number) => (
              <motion.div
                key={artwork._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <Link to={`/artwork/${artwork.slug || artwork._id}`}>
                  <CanvasMockup 
                    imageUrl={artwork.imageUrl} 
                    title={artwork.title} 
                  />
                </Link>
                <div className="mt-6 flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-lg mb-1">{artwork.title}</h3>
                    <p className="text-[9px] text-brand-charcoal/30 uppercase tracking-widest">{artwork.medium}</p>
                  </div>
                  <span className="text-[9px] text-brand-charcoal/20 border border-brand-charcoal/10 px-2 py-1 uppercase">{artwork.year}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

function AcquisitionForm({ artwork, type = "acquisition", onClose }: { artwork?: any, type?: 'acquisition' | 'commission', onClose: () => void }) {
  const [formData, setFormData] = React.useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    message: '',
    dimensions: '',
    colorPalette: '',
    deadline: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const submitRequest = useMutation(api.acquisitions.submit);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitRequest({
        type,
        artworkId: artwork?._id,
        artworkTitle: artwork?.title,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
        message: formData.message,
        details: type === 'commission' ? {
          dimensions: formData.dimensions,
          colorPalette: formData.colorPalette,
          deadline: formData.deadline
        } : undefined
      });
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20 px-8 bg-brand-cream border border-brand-charcoal/10 shadow-2xl max-w-lg"
      >
        <div className="w-20 h-20 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-8">
           <Check className="text-brand-gold" size={32} />
        </div>
        <h3 className="font-serif text-3xl mb-4 italic text-brand-charcoal">Demande Envoyée.</h3>
        <p className="text-brand-charcoal/40 text-sm max-w-sm mx-auto leading-relaxed">
          Merci pour votre intérêt. {type === 'acquisition' ? "Marie-Claire" : "L'artiste"} reviendra vers vous très prochainement par email pour finaliser les détails.
        </p>
        <button 
          onClick={onClose}
          className="mt-12 px-8 py-4 bg-brand-gold text-brand-charcoal text-[10px] tracking-[0.3em] font-bold uppercase hover:bg-brand-charcoal hover:text-brand-cream transition-all"
        >
          FERMER
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl w-full bg-brand-cream border border-brand-charcoal/10 p-8 md:p-16 relative overflow-hidden shadow-2xl">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
      
      <button onClick={onClose} className="absolute top-8 right-8 text-brand-charcoal/20 hover:text-brand-charcoal transition-colors">
        <Plus className="rotate-45" size={24} />
      </button>

      <div className="mb-12">
        <span className="text-[10px] uppercase tracking-[0.4em] text-brand-gold mb-4 block font-bold">
          {type === 'acquisition' ? "Acquisition d'œuvre" : "Commande de toile"}
        </span>
        <h2 className="font-serif text-4xl italic text-brand-charcoal">
          {type === 'acquisition' ? `« ${artwork?.title} »` : "Votre projet sur mesure"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 relative z-10 text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-brand-charcoal/30">Votre Nom</label>
            <input 
              required
              className="w-full bg-transparent border-b border-brand-charcoal/10 py-4 focus:outline-none focus:border-brand-gold transition-all text-brand-charcoal"
              placeholder="Nom complet"
              value={formData.clientName}
              onChange={e => setFormData({...formData, clientName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-brand-charcoal/30">Email</label>
            <input 
              required
              type="email"
              className="w-full bg-transparent border-b border-brand-charcoal/10 py-4 focus:outline-none focus:border-brand-gold transition-all text-brand-charcoal"
              placeholder="votre@email.com"
              value={formData.clientEmail}
              onChange={e => setFormData({...formData, clientEmail: e.target.value})}
            />
          </div>
        </div>

        {type === 'commission' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-brand-charcoal/30">Dimensions souhaitées</label>
              <input 
                className="w-full bg-transparent border-b border-brand-charcoal/10 py-4 focus:outline-none focus:border-brand-gold transition-all text-brand-charcoal"
                placeholder="Ex: 80x100cm"
                value={formData.dimensions}
                onChange={e => setFormData({...formData, dimensions: e.target.value})}
              />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] uppercase tracking-widest text-brand-charcoal/30">Palette / Ambiance</label>
               <input 
                 className="w-full bg-transparent border-b border-brand-charcoal/10 py-4 focus:outline-none focus:border-brand-gold transition-all text-brand-charcoal"
                 placeholder="Ex: Tons ocres, sombres..."
                 value={formData.colorPalette}
                 onChange={e => setFormData({...formData, colorPalette: e.target.value})}
               />
            </div>
          </motion.div>
        )}

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-brand-charcoal/30">
            {type === 'acquisition' ? "Message / Questions" : "Description de votre projet"}
          </label>
          <textarea 
            required
            rows={4}
            className="w-full bg-transparent border-b border-brand-charcoal/10 py-4 focus:outline-none focus:border-brand-gold transition-all resize-none text-brand-charcoal"
            placeholder={type === 'acquisition' ? "Qu'est-ce qui vous a touché dans cette œuvre ?" : "Racontez l'histoire que vous souhaitez voir sur la toile..."}
            value={formData.message}
            onChange={e => setFormData({...formData, message: e.target.value})}
          />
        </div>

        <button 
          disabled={isSubmitting}
          type="submit"
          className="w-full py-6 bg-brand-gold text-white text-[10px] tracking-[0.4em] font-bold uppercase hover:bg-white hover:text-black transition-all group flex items-center justify-center gap-4"
        >
          {isSubmitting ? "ENVOI EN COURS..." : (
            <>
              ENVOYER LA DEMANDE
              <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

function CommissionPage() {
  return (
    <div className="pt-40 px-6 md:px-12 pb-32 min-h-screen bg-brand-cream">
      <div className="max-w-4xl mx-auto text-center mb-24">
         <span className="text-[10px] uppercase tracking-[0.5em] text-brand-gold mb-8 block font-bold">Projets sur mesure</span>
         <h1 className="font-serif text-6xl md:text-8xl mb-12 italic leading-tight text-brand-charcoal">La Main <br /> & L'Esprit.</h1>
         <p className="text-brand-charcoal/40 font-sans text-lg max-w-2xl mx-auto leading-relaxed">
           Chaque toile est une rencontre. Au-delà des œuvres existantes, je vous propose de créer ensemble une pièce unique, 
           en harmonie avec votre espace et votre propre sensibilité.
         </p>
      </div>

      <div className="flex justify-center">
        <AcquisitionForm type="commission" onClose={() => window.history.back()} />
      </div>
    </div>
  );
}

function ArtworkDetail() {
  const { slug } = useParams();
  const [isAcquiring, setIsAcquiring] = React.useState(false);
  const initialData = (window as any).__INITIAL_DATA__;
  const artworksQuery = useQuery(api.artworks.get);
  const seriesQuery = useQuery(api.series.get);
  
  const artworks = artworksQuery || initialData?.artworks;
  const seriesData = seriesQuery || initialData?.series;
  
  const artwork = artworks?.find((a: any) => (a.slug || a._id) === slug);
  const series = seriesData?.find((s: any) => s.title === artwork?.series);
  
  if (!artwork) return <div className="h-screen flex items-center justify-center font-serif italic text-brand-charcoal/20">Chargement de l'œuvre...</div>;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-40 px-6 md:px-12 pb-32 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-start">
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full md:sticky md:top-40 mb-12 md:mb-0"
        >
          <CanvasMockup imageUrl={artwork.imageUrl} title={artwork.title} showLabel={false} className="w-full shadow-2xl" />
          
          {artwork.gallery && artwork.gallery.length > 0 && (
            <div className="mt-12 grid grid-cols-4 gap-4">
               {artwork.gallery.map((img: string, i: number) => (
                 <div key={i} className="aspect-square bg-brand-charcoal/40 border border-brand-charcoal/5 overflow-hidden group">
                    <img src={img} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                 </div>
               ))}
            </div>
          )}
        </motion.div>
        
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col justify-center"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-bold mb-4 block">
            {series ? `${series.title} — ${series.year}` : artwork.series}
          </span>
          <h1 className="font-serif text-5xl md:text-7xl tracking-tighter mb-8 leading-[0.9] text-brand-charcoal italic">{artwork.title}</h1>
          
          <div className="space-y-6 text-brand-charcoal/70 mb-12 border-l border-brand-charcoal/10 pl-8 py-4">
             <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-[10px] font-sans uppercase tracking-[0.2em]">
                <span className="text-brand-charcoal/30">Année</span>
                <span className="text-brand-charcoal/90">{artwork.year}</span>
                <span className="text-brand-charcoal/30">Technique</span>
                <span className="text-brand-charcoal/90">{artwork.medium}</span>
                {artwork.dimensions && (
                  <>
                    <span className="text-brand-charcoal/30">Dimensions</span>
                    <span className="text-brand-charcoal/90">{artwork.dimensions}</span>
                  </>
                )}
             </div>
          </div>

          <p className="text-brand-charcoal/80 text-xl leading-relaxed mb-16 font-serif italic font-light">
            {artwork.description}
          </p>

          <button 
            onClick={() => setIsAcquiring(true)}
            className="bg-white text-black px-12 py-6 text-[10px] tracking-[0.4em] uppercase hover:bg-brand-gold hover:text-white transition-all self-start font-bold"
          >
            Demander une acquisition
          </button>

          {/* Series Context Card */}
          {series && (
            <div className="p-8 bg-white/[0.03] border border-white/5 rounded-sm mt-16 group">
               <span className="text-[8px] uppercase tracking-[0.4em] text-white/30 block mb-6">À propos de la collection</span>
               <div className="flex gap-6 items-start">
                  <div className="w-20 h-20 bg-black/40 shrink-0 border border-white/10 overflow-hidden">
                    <img src={series.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg mb-2 italic text-white">{series.title}</h4>
                    <p className="text-[11px] text-white/40 leading-relaxed line-clamp-3 italic">{series.description}</p>
                    <Link 
                      to={`/portfolio?series=${series.title}`}
                      className="inline-block mt-4 text-[9px] uppercase tracking-widest text-brand-gold hover:text-white transition-colors border-b border-brand-gold/20 pb-0.5"
                    >
                      Voir toute la série
                    </Link>
                  </div>
               </div>
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {isAcquiring && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
            onClick={(e) => e.target === e.currentTarget && setIsAcquiring(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <AcquisitionForm artwork={artwork} onClose={() => setIsAcquiring(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function JournalPage() {
  const { slug } = useParams();
  const initialData = (window as any).__INITIAL_DATA__;
  const postsQuery = useQuery(api.posts.get);
  const posts = postsQuery || initialData?.posts;
  
  if (!posts) return <div className="h-screen flex items-center justify-center font-serif italic text-brand-charcoal/20">Chargement du journal...</div>;

  if (slug) {
    const post = posts.find((p: any) => (p.slug || p._id) === slug);
    if (!post) return <div className="h-screen flex items-center justify-center font-serif italic text-brand-charcoal/20">Article non trouvé...</div>;

    return (
      <div className="pt-40 px-6 md:px-12 pb-32 max-w-4xl mx-auto">
        <Link to="/journal" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-brand-charcoal/30 hover:text-brand-gold transition-colors mb-16">
           <ArrowLeft size={14} /> RETOUR AU JOURNAL
        </Link>
        <article>
          <header className="mb-24 text-center">
            <span className="text-[10px] uppercase tracking-[0.4em] text-brand-gold font-bold block mb-8">{post.date}</span>
            <h1 className="font-serif text-5xl md:text-8xl tracking-tighter mb-12 leading-[0.9] text-brand-charcoal">{post.title}</h1>
            {post.imageUrl && (
              <div className="aspect-video bg-brand-charcoal/40 border border-brand-charcoal/5 overflow-hidden mb-24 max-w-2xl mx-auto shadow-2xl">
                <img src={post.imageUrl} className="w-full h-full object-cover" />
              </div>
            )}
          </header>
          
          <div className="prose prose-invert prose-lg max-w-none text-brand-charcoal/70 leading-relaxed font-sans" dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </div>
    );
  }

  return (
    <div className="pt-40 px-6 md:px-12 pb-32 max-w-4xl mx-auto">
      <h1 className="font-serif text-6xl md:text-8xl tracking-tighter mb-24 text-center text-brand-charcoal">Journal.</h1>
      
      <div className="space-y-32">
        {posts.map((post: any) => (
          <article key={post._id} className="border-b border-brand-charcoal/5 pb-16">
            <span className="text-[10px] uppercase tracking-widest text-brand-charcoal/40 block mb-6">{post.date}</span>
            <h2 className="font-serif text-4xl mb-8 group-hover:text-brand-gold transition-colors text-brand-charcoal">{post.title}</h2>
            <div className="prose prose-invert prose-sm max-w-none text-brand-charcoal/60 leading-relaxed font-sans line-clamp-3 mb-10" dangerouslySetInnerHTML={{ __html: post.excerpt || post.content.substring(0, 200) }} />
            <Link to={`/journal/${post.slug || post._id}`} className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] font-bold text-brand-gold cursor-pointer hover:translate-x-2 transition-transform">
               VOIR TOUT L'ARTICLE <ArrowRight size={14} />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

function ImageUpload({ 
  onUpload, 
  label = "Télécharger une image",
  multiple = false
}: { 
  onUpload: (urls: string[]) => void, 
  label?: string,
  multiple?: boolean
}) {
  const [isUploading, setIsUploading] = React.useState(false);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const getStorageUrl = useMutation(api.files.getStorageUrl);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    const urls: string[] = [];
    try {
      for (const file of files) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = await result.json();
        const url = await getStorageUrl({ storageId });
        if (url) urls.push(url);
      }
      onUpload(urls); 
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        disabled={isUploading}
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center justify-center gap-3 px-6 py-4 border border-dashed border-white/20 hover:border-brand-gold hover:bg-white/5 transition-all text-[10px] uppercase tracking-widest text-white/60"
      >
        {isUploading ? "Envoi en cours..." : <><Upload size={14} /> {label}</>}
      </button>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleUpload} 
        className="hidden" 
        accept="image/*" 
        multiple={multiple}
      />
    </div>
  );
}

function NotionEditor({ 
  value, 
  onChange, 
  placeholder 
}: { 
  value: string, 
  onChange: (v: string) => void,
  placeholder?: string
}) {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const getStorageUrl = useMutation(api.files.getStorageUrl);
  
  // Improved upload function that actually returns the URL
  const handleUpload = async (file: File) => {
    try {
      const uploadUrl = await generateUploadUrl();
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await response.json();
      
      const publicUrl = await getStorageUrl({ storageId });
      return publicUrl || "";
    } catch (error) {
      console.error("Upload failed", error);
      return "";
    }
  };

  const editor = useCreateBlockNote({
    initialContent: value ? undefined : undefined, // We'll set it differently to avoid issues with HTML vs Blocks
    uploadFile: handleUpload,
  });

  // Effect to load initial HTML value into BlockNote blocks
  React.useEffect(() => {
    const loadInitial = async () => {
      if (value && editor.document.length <= 1) { // Only load if empty or initial
        const blocks = await editor.tryParseHTMLToBlocks(value);
        editor.replaceBlocks(editor.document, blocks);
      }
    };
    loadInitial();
  }, [editor]);

  return (
    <div className="flex flex-col border border-white/10 rounded-sm overflow-hidden bg-black/20 text-white notion-editor-container">
      <div className="p-4 min-h-[400px]">
        <BlockNoteView 
          editor={editor} 
          theme="dark"
          onChange={() => {
            // Convert blocks back to HTML for storage
            const saveBlocks = async () => {
              const html = await (editor as any).blocksToHTML(editor.document);
              onChange(html);
            };
            saveBlocks();
          }}
        />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .notion-editor-container .bn-editor {
          background: transparent !important;
          padding: 0 !important;
        }
        .notion-editor-container .bn-container {
          background: transparent !important;
        }
        .notion-editor-container .bn-block-content {
          color: rgba(255, 255, 255, 0.8) !important;
        }
        .notion-editor-container .bn-inline-content {
          color: inherit !important;
        }
        .notion-editor-container [data-placeholder]::before {
          color: rgba(255, 255, 255, 0.2) !important;
        }
      `}} />
    </div>
  );
}

function SiteSettingsEditor() {
  const { settings, updateLocalSetting, hasChanges, saveChanges, isSaving } = useSettings();
  const [activeSubTab, setActiveSubTab] = React.useState('general');

  const handleUpdate = (key: string, value: any) => {
    updateLocalSetting(key, value);
  };

  if (!settings) return null;

  const tabs = [
    { id: 'general', label: 'Général' },
    { id: 'hero', label: 'Accueil' },
    { id: 'theme', label: 'Personnalisation' },
    { id: 'about', label: 'L\'Artiste' },
    { id: 'social', label: 'Réseaux Sociaux' },
  ];

  return (
    <div className="space-y-12">
      {/* Save bar */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-6 px-8 py-4 bg-brand-gold rounded-full shadow-2xl border border-white/20 backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white">Modifications non sauvegardées</span>
            </div>
            <button 
              onClick={saveChanges}
              disabled={isSaving}
              className="px-6 py-2 bg-white text-black text-[10px] uppercase tracking-widest font-bold rounded-full hover:bg-black hover:text-white transition-all disabled:opacity-50"
            >
              {isSaving ? "Enregistrement..." : "Enregistrer tout"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row gap-12 text-left">
        <div className="w-full md:w-48 flex flex-col gap-2">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={cn(
                "px-4 py-3 text-[10px] uppercase tracking-widest text-left transition-all",
                activeSubTab === tab.id ? "bg-white/10 text-white font-bold border-l-2 border-brand-gold" : "text-white/30 hover:text-white"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 space-y-12">
          {activeSubTab === 'general' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-white/30">Nom de la Marque / Artiste</label>
                  <input 
                    className="w-full bg-black/40 border border-white/10 p-4 text-sm focus:outline-none focus:border-brand-gold transition-all" 
                    value={settings.brandName || ""} 
                    onChange={e => handleUpdate('brandName', e.target.value)}
                    placeholder="MYJI"
                  />
              </div>
              <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-white/30">Description Bas de Page (Footer)</label>
                  <textarea 
                    className="w-full bg-black/40 border border-white/10 p-4 text-sm h-32 focus:outline-none focus:border-brand-gold transition-all resize-none" 
                    value={settings.footerDescription || ""} 
                    onChange={e => handleUpdate('footerDescription', e.target.value)}
                  />
              </div>
              <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-white/30">Email de Contact</label>
                  <input 
                    className="w-full bg-black/40 border border-white/10 p-4 text-sm focus:outline-none focus:border-brand-gold transition-all" 
                    value={settings.contactEmail || ""} 
                    onChange={e => handleUpdate('contactEmail', e.target.value)}
                  />
              </div>
            </div>
          )}

          {activeSubTab === 'hero' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-white/30">Titre Principal (HTML autorisé)</label>
                  <textarea 
                    className="w-full bg-black/40 border border-white/10 p-4 text-3xl font-serif h-32 focus:outline-none focus:border-brand-gold transition-all resize-none" 
                    value={settings.heroTitle || ""} 
                    onChange={e => handleUpdate('heroTitle', e.target.value)}
                    placeholder="Marie-Claire <br /> Portfolio."
                  />
              </div>
              <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-white/30">Sous-titre Accueil</label>
                  <textarea 
                    className="w-full bg-black/40 border border-white/10 p-4 text-sm h-24 focus:outline-none focus:border-brand-gold transition-all resize-none" 
                    value={settings.heroSubtitle || ""} 
                    onChange={e => handleUpdate('heroSubtitle', e.target.value)}
                  />
              </div>
              <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-white/30">Image de fond (URL)</label>
                  <div className="flex gap-4 items-center">
                    {settings.heroImage && <img src={settings.heroImage} className="w-16 h-16 object-cover rounded-sm" />}
                    <ImageUpload 
                        onUpload={(urls) => handleUpdate('heroImage', urls[0])} 
                        label={settings.heroImage ? "Changer l'image" : "Ajouter une image"} 
                    />
                  </div>
              </div>
              <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-white/30">Citation (Homepage Statement)</label>
                  <textarea 
                    className="w-full bg-black/40 border border-white/10 p-4 text-xl font-serif italic h-32 focus:outline-none focus:border-brand-gold transition-all resize-none" 
                    value={settings.homeStatement || ""} 
                    onChange={e => handleUpdate('homeStatement', e.target.value)}
                  />
              </div>
            </div>
          )}

          {activeSubTab === 'theme' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
              <ThemeManager />
            </div>
          )}

          {activeSubTab === 'about' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-white/30">Titre "À propos" (HTML autorisé)</label>
                  <input 
                    className="w-full bg-black/40 border border-white/10 p-4 text-sm focus:outline-none focus:border-brand-gold transition-all" 
                    value={settings.aboutTitle || ""} 
                    onChange={e => handleUpdate('aboutTitle', e.target.value)}
                  />
              </div>
              <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-white/30">Introduction (Accroche)</label>
                  <textarea 
                    className="w-full bg-black/40 border border-white/10 p-4 text-sm h-24 focus:outline-none focus:border-brand-gold transition-all resize-none italic" 
                    value={settings.aboutIntro || ""} 
                    onChange={e => handleUpdate('aboutIntro', e.target.value)}
                  />
              </div>
              <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-white/30">Texte détaillé (HTML/Riche)</label>
                  <NotionEditor 
                    value={settings.aboutContent || ""} 
                    onChange={val => handleUpdate('aboutContent', val)}
                  />
              </div>
              <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-white/30">Photo de l'Artiste (URL)</label>
                  <div className="flex gap-4 items-center">
                    {settings.aboutImage && <img src={settings.aboutImage} className="w-16 h-16 object-cover rounded-sm" />}
                    <ImageUpload 
                        onUpload={(urls) => handleUpdate('aboutImage', urls[0])} 
                        label={settings.aboutImage ? "Changer la photo" : "Ajouter une photo"} 
                    />
                  </div>
              </div>
            </div>
          )}

          {activeSubTab === 'social' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-white/30">Instagram (Lien complet)</label>
                  <input 
                    className="w-full bg-black/40 border border-white/10 p-4 text-sm focus:outline-none focus:border-brand-gold transition-all" 
                    value={settings.instagramUrl || ""} 
                    onChange={e => handleUpdate('instagramUrl', e.target.value)}
                    placeholder="https://instagram.com/votre_compte"
                  />
              </div>
              <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-white/30">Pinterest (Lien complet)</label>
                  <input 
                    className="w-full bg-black/40 border border-white/10 p-4 text-sm focus:outline-none focus:border-brand-gold transition-all" 
                    value={settings.pinterestUrl || ""} 
                    onChange={e => handleUpdate('pinterestUrl', e.target.value)}
                    placeholder="https://pinterest.com/votre_compte"
                  />
              </div>
              <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-white/30">Lien Contact Alternatf (Optional)</label>
                  <input 
                    className="w-full bg-black/40 border border-white/10 p-4 text-sm focus:outline-none focus:border-brand-gold transition-all" 
                    value={settings.otherContactUrl || ""} 
                    onChange={e => handleUpdate('otherContactUrl', e.target.value)}
                  />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CategoriesManager() {
  const token = localStorage.getItem('admin_token');
  const artworkCats = useQuery(api.categories.get, { type: "artwork" });
  const postCats = useQuery(api.categories.get, { type: "post" });
  const removeCategory = useMutation(api.categories.remove);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="space-y-8">
        <h3 className="text-xl font-serif italic border-l-2 border-brand-gold pl-6 text-white">Portfolio</h3>
        <div className="space-y-2">
          {artworkCats?.map(cat => (
            <div key={cat._id} className="flex justify-between items-center p-4 bg-white/5 border border-white/10 group rounded-sm">
              <span className="text-sm text-white/80">{cat.name}</span>
              <button 
                onClick={() => removeCategory({ id: cat._id, token: token || undefined })}
                className="p-2 text-white/10 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {artworkCats?.length === 0 && <p className="text-xs text-white/20 italic">Aucune catégorie Portfolio...</p>}
        </div>
      </div>
      <div className="space-y-8">
        <h3 className="text-xl font-serif italic border-l-2 border-brand-gold pl-6 text-white">Journal</h3>
        <div className="space-y-2">
          {postCats?.map(cat => (
            <div key={cat._id} className="flex justify-between items-center p-4 bg-white/5 border border-white/10 group rounded-sm">
              <span className="text-sm text-white/80">{cat.name}</span>
              <button 
                onClick={() => removeCategory({ id: cat._id, token: token || undefined })}
                className="p-2 text-white/10 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {postCats?.length === 0 && <p className="text-xs text-white/20 italic">Aucune catégorie Journal...</p>}
        </div>
      </div>
    </div>
  );
}

function SeriesManager({ formRef, onEdit }: { formRef: React.RefObject<HTMLDivElement>, onEdit: () => void }) {
  const token = localStorage.getItem('admin_token');
  const series = useQuery(api.series.get);
  const addSeries = useMutation(api.series.add);
  const updateSeries = useMutation(api.series.update);
  const removeSeries = useMutation(api.series.remove);

  const [editing, setEditing] = React.useState<any>(null);
  const [formData, setFormData] = React.useState({ title: '', description: '', imageUrl: '', year: '' });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await updateSeries({ id: editing._id, ...formData, token: token || undefined });
      setEditing(null);
    } else {
      await addSeries({ ...formData, token: token || undefined });
    }
    // Revalidate server-side cache
    try {
      await fetch('/api/revalidate', { method: 'POST' });
    } catch (e) {
      console.warn("Failed to revalidate server cache", e);
    }
    setFormData({ title: '', description: '', imageUrl: '', year: '' });
  };

  const startEdit = (s: any) => {
    setEditing(s);
    setFormData({ title: s.title, description: s.description || '', imageUrl: s.imageUrl || '', year: s.year || '' });
    onEdit();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12" ref={formRef}>
      <div className="space-y-8">
        <form onSubmit={handleSave} className="bg-white/5 border border-white/10 p-8 space-y-6">
          <h3 className="text-xl font-serif italic mb-6">
            {editing ? 'Modifier la Série' : 'Nouvelle Série'}
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/30">Titre</label>
                <input 
                  className="w-full bg-black/40 border border-white/10 p-4 text-sm focus:outline-none focus:border-brand-gold"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/30">Année / Période</label>
                <input 
                  className="w-full bg-black/40 border border-white/10 p-4 text-sm focus:outline-none focus:border-brand-gold"
                  value={formData.year}
                  onChange={e => setFormData({...formData, year: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/30">Image de couverture</label>
              <div className="aspect-video bg-black/40 border border-white/10 relative overflow-hidden flex items-center justify-center">
                {formData.imageUrl ? (
                  <>
                    <img src={formData.imageUrl} className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => setFormData({...formData, imageUrl: ''})}
                      className="absolute top-2 right-2 p-1 bg-black/50 text-white hover:text-red-500"
                    >
                      <Trash2 size={12} />
                    </button>
                  </>
                ) : (
                  <ImageUpload onUpload={u => setFormData({...formData, imageUrl: u[0]})} label="+" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/30">Description</label>
              <textarea 
                className="w-full bg-black/40 border border-white/10 p-4 text-sm h-32 resize-none focus:outline-none focus:border-brand-gold"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button className="flex-1 bg-brand-gold text-white py-4 uppercase tracking-[0.2em] text-[10px] font-bold">
              {editing ? 'Enregistrer' : 'Créer la série'}
            </button>
            {editing && (
              <button 
                type="button"
                onClick={() => { setEditing(null); setFormData({ title: '', description: '', imageUrl: '', year: '' }); }}
                className="px-6 border border-white/10 text-[10px] uppercase tracking-widest"
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] uppercase tracking-[0.4em] text-white/30 mb-8">Séries Existantes</h3>
        {series?.map(s => (
          <div key={s._id} className="group relative bg-white/5 border border-white/10 p-6 flex gap-6 hover:border-brand-gold/30 transition-all">
            <div className="w-20 h-20 bg-black/40 overflow-hidden shrink-0">
              <img src={s.imageUrl} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <span className="text-[8px] text-brand-gold uppercase tracking-widest mb-1 block">{s.year}</span>
              <h4 className="font-serif text-lg">{s.title}</h4>
              <p className="text-[10px] text-white/30 line-clamp-2 mt-1">{s.description}</p>
            </div>
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
              <button 
                onClick={() => startEdit(s)}
                className="p-2 text-white/30 hover:text-brand-gold"
              >
                <Settings size={14} />
              </button>
              <button 
                onClick={() => removeSeries({ id: s._id, token: token || undefined })}
                className="p-2 text-white/10 hover:text-red-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {series?.length === 0 && <p className="text-xs text-white/20 italic">Aucune série créée...</p>}
      </div>
    </div>
  );
}

function AcquisitionsManager() {
  const token = localStorage.getItem('admin_token');
  const acquisitions = useQuery(api.acquisitions.get);
  const updateStatus = useMutation(api.acquisitions.updateStatus);
  const removeAcquisition = useMutation(api.acquisitions.remove);
  
  const [selected, setSelected] = React.useState<any>(null);

  if (acquisitions === undefined) {
    return <div className="p-20 text-center font-serif italic text-white/20">Chargement des demandes...</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-brand-gold';
      case 'discussion': return 'text-blue-400';
      case 'approved': return 'text-green-400';
      case 'paid': return 'text-purple-400';
      case 'delivered': return 'text-white/20';
      case 'cancelled': return 'text-red-400';
      default: return 'text-white/40';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Nouveau';
      case 'discussion': return 'En discussion';
      case 'approved': return 'Approuvé';
      case 'paid': return 'Payé';
      case 'delivered': return 'Livré';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-1 space-y-4 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
        {acquisitions?.map(req => (
          <button 
            key={req._id}
            onClick={() => setSelected(req)}
            className={cn(
              "w-full text-left p-6 border transition-all relative overflow-hidden group",
              selected?._id === req._id ? "bg-white/10 border-brand-gold" : "bg-white/5 border-white/5 hover:border-white/20"
            )}
          >
            <div className="flex justify-between items-start mb-2">
               <span className={cn("text-[8px] uppercase tracking-widest font-bold", getStatusColor(req.status))}>
                 {getStatusLabel(req.status)}
               </span>
               <span className="text-[8px] text-white/20">{new Date(req.createdAt).toLocaleDateString()}</span>
            </div>
            <h4 className="font-serif text-lg text-white mb-1">{req.clientName}</h4>
            <p className="text-[10px] text-white/40 truncate">
               {req.type === 'acquisition' ? `Acquisition: ${req.artworkTitle}` : 'Commande Spéciale'}
            </p>
          </button>
        ))}
        {acquisitions?.length === 0 && <p className="text-xs text-white/20 italic p-8 border border-dashed border-white/5 text-center">Aucune demande pour le moment.</p>}
      </div>

      <div className="lg:col-span-2">
        {selected ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={selected._id}
            className="bg-white/5 border border-white/10 p-12 space-y-12"
          >
            <div className="flex justify-between items-start">
               <div>
                  <span className="text-[10px] uppercase tracking-[0.4em] text-brand-gold mb-4 block font-bold">Détails de la demande</span>
                  <h3 className="font-serif text-4xl italic text-white">{selected.clientName}</h3>
                  <div className="flex gap-6 mt-4 italic text-white/40 text-sm">
                     <a href={`mailto:${selected.clientEmail}`} className="hover:text-brand-gold transition-colors">{selected.clientEmail}</a>
                     {selected.clientPhone && <a href={`tel:${selected.clientPhone}`}>{selected.clientPhone}</a>}
                  </div>
               </div>
               <button 
                 onClick={() => removeAcquisition({ id: selected._id })}
                 className="p-3 text-white/10 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-full"
               >
                 <Trash2 size={18} />
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-y border-white/5 py-12">
               <div className="space-y-6">
                  <h5 className="text-[10px] uppercase tracking-widest text-white/20">Objet</h5>
                  <div className="p-6 bg-black/20 border border-white/5">
                     {selected.type === 'acquisition' ? (
                       <div className="flex gap-4 items-center">
                          <span className="font-serif text-xl italic text-white">« {selected.artworkTitle} »</span>
                          <span className="text-[9px] bg-brand-gold/10 text-brand-gold px-2 py-0.5 rounded-full uppercase tracking-widest">Toile</span>
                       </div>
                     ) : (
                       <div>
                          <span className="font-serif text-xl italic text-white">Commande de toile</span>
                          <div className="mt-4 grid grid-cols-2 gap-4 text-[9px] uppercase tracking-widest text-white/40 font-sans">
                             <div><span className="text-white/20 block mb-1">Dimensions</span> {selected.details?.dimensions || 'Non spécifié'}</div>
                             <div><span className="text-white/20 block mb-1">Palette</span> {selected.details?.colorPalette || 'Libre'}</div>
                          </div>
                       </div>
                     )}
                  </div>
               </div>
               <div className="space-y-6">
                  <h5 className="text-[10px] uppercase tracking-widest text-white/20">Message du client</h5>
                  <p className="text-sm text-white/60 leading-relaxed italic border-l border-brand-gold/40 pl-6">
                     "{selected.message}"
                  </p>
               </div>
            </div>

            <div className="space-y-8 bg-brand-gold/5 p-8 border border-brand-gold/10">
               <h5 className="text-[10px] uppercase tracking-widest text-brand-gold">Actions de suivi</h5>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                     <label className="text-[9px] uppercase tracking-widest text-white/40">Statut</label>
                     <select 
                       className="w-full bg-black/40 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-brand-gold"
                       value={selected.status}
                       onChange={e => updateStatus({ id: selected._id, status: e.target.value as any })}
                     >
                       <option value="pending">Nouveau</option>
                       <option value="discussion">En discussion</option>
                       <option value="approved">Approuvé</option>
                       <option value="paid">Payé / Terminé</option>
                       <option value="delivered">Livré</option>
                       <option value="cancelled">Annulé</option>
                     </select>
                  </div>
                  <div className="space-y-3">
                     <label className="text-[9px] uppercase tracking-widest text-white/40">Prix fixé (€)</label>
                     <input 
                       type="number"
                       className="w-full bg-black/40 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-brand-gold"
                       placeholder="Ex: 850"
                       value={selected.price || ""}
                       onChange={e => updateStatus({ id: selected._id, status: selected.status, price: Number(e.target.value) })}
                     />
                  </div>
                  <div className="space-y-3">
                     <label className="text-[9px] uppercase tracking-widest text-white/40">Lien de paiement (Stripe/PayPal)</label>
                     <input 
                       className="w-full bg-black/40 border border-white/10 p-3 text-xs text-brand-gold focus:outline-none focus:border-brand-gold"
                       placeholder="https://buy.stripe.com/..."
                       value={selected.paymentLink || ""}
                       onChange={e => updateStatus({ id: selected._id, status: selected.status, paymentLink: e.target.value })}
                     />
                  </div>
               </div>
               
               <div className="pt-6 border-t border-white/5 flex gap-4">
                  <button 
                    onClick={() => {
                      const subject = encodeURIComponent(`Suite à votre demande pour ${selected.artworkTitle || 'une commande spéciale'}`);
                      const body = encodeURIComponent(`Bonjour ${selected.clientName},\n\nMerci pour votre demande. ${selected.price ? `J'ai fixé le prix à ${selected.price}€. ` : ''}${selected.paymentLink ? `Voici le lien pour finaliser l'acquisition : ${selected.paymentLink}` : ''}\n\nCordialement,\nMarie-Claire`);
                      window.location.href = `mailto:${selected.clientEmail}?subject=${subject}&body=${body}`;
                    }}
                    className="flex-1 bg-white text-black py-4 uppercase tracking-[0.2em] text-[9px] font-bold hover:bg-brand-gold hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                     RÉPONDRE PAR EMAIL <Mail size={14} />
                  </button>
               </div>
            </div>
          </motion.div>
        ) : (
          <div className="h-full border border-dashed border-white/5 rounded-sm flex flex-col items-center justify-center p-20 text-center">
             <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <FileText size={24} className="text-white/10" />
             </div>
             <h4 className="font-serif text-xl italic text-white/20">Sélectionnez une demande</h4>
             <p className="text-white/10 text-xs mt-2">Cliquez sur un nom dans la liste de gauche pour voir les détails et agir.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminPage() {
  const { isAdmin, login, isLoading, logout, token } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loginError, setLoginError] = React.useState('');
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const activeTab = pathSegments[pathSegments.length - 1] === 'admin' ? 'demandes' : pathSegments[pathSegments.length - 1];
  
  const artworks = useQuery(api.artworks.get);
  const posts = useQuery(api.posts.get);
  
  const addArtwork = useMutation(api.artworks.add);
  const updateArtwork = useMutation(api.artworks.update);
  const deleteArtwork = useMutation(api.artworks.deleteArtwork);
  const addPost = useMutation(api.posts.add);
  const updatePost = useMutation(api.posts.update);
  const deletePost = useMutation(api.posts.deletePost);

  const [editingArtwork, setEditingArtwork] = React.useState<any | null>(null);
  const [editingPost, setEditingPost] = React.useState<any | null>(null);

  const artworkFormRef = React.useRef<HTMLDivElement>(null);
  const postFormRef = React.useRef<HTMLDivElement>(null);
  const seriesFormRef = React.useRef<HTMLDivElement>(null);

  const scrollToRef = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      const offset = 100;
      const elementPosition = ref.current.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  const handleEditArtwork = (a: any) => {
    setEditingArtwork(a);
    setTimeout(() => scrollToRef(artworkFormRef), 50);
  };

  const handleEditPost = (p: any) => {
    setEditingPost(p);
    setTimeout(() => scrollToRef(postFormRef), 50);
  };

  const [newArtwork, setNewArtwork] = React.useState({
    title: '', slug: '', series: '', year: new Date().getFullYear().toString(), 
    medium: '', dimensions: '', description: '', imageUrl: '', featured: false, gallery: [] as string[],
    category: ''
  });

  const [newPost, setNewPost] = React.useState({
    title: '', slug: '', date: new Date().toLocaleDateString('fr-FR'), excerpt: '', content: '', imageUrl: '',
    category: ''
  });

  const handleSaveArtwork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingArtwork) {
      const { _id, _creationTime, imageUrl, gallery, category, slug, ...rest } = editingArtwork;
      await updateArtwork({ 
        id: _id, 
        ...rest, 
        slug: editingArtwork.slug || slugify(editingArtwork.title),
        imageUrl: editingArtwork.imageUrl,
        gallery: editingArtwork.gallery,
        category: editingArtwork.category,
        token: token || undefined 
      });
      setEditingArtwork(null);
    } else {
      const data = { ...newArtwork, slug: newArtwork.slug || slugify(newArtwork.title) };
      await addArtwork({ ...data, token: token || undefined });
      setNewArtwork({ title: '', slug: '', series: '', year: '2024', medium: '', dimensions: '', description: '', imageUrl: '', featured: false, gallery: [], category: '' });
    }
    // Revalidate server cache
    try { await fetch('/api/revalidate', { method: 'POST' }); } catch (err) { console.warn(err); }
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPost) {
      const { _id, _creationTime, imageUrl, category, slug, ...rest } = editingPost;
      await updatePost({ 
        id: _id, 
        ...rest, 
        slug: editingPost.slug || slugify(editingPost.title),
        imageUrl: editingPost.imageUrl,
        category: editingPost.category,
        token: token || undefined 
      });
      setEditingPost(null);
    } else {
      const data = { ...newPost, slug: newPost.slug || slugify(newPost.title) };
      await addPost({ ...data, token: token || undefined });
      setNewPost({ title: '', slug: '', date: new Date().toLocaleDateString('fr-FR'), excerpt: '', content: '', imageUrl: '', category: '' });
    }
    // Revalidate server cache
    try { await fetch('/api/revalidate', { method: 'POST' }); } catch (err) { console.warn(err); }
  };

  const seedData = async () => {
    const defaultArtworks = [
      {
        title: "L'Éveil du Pas",
        slug: "eveil-du-pas",
        series: "Les hommes qui marchent",
        year: "2024",
        medium: "Huile sur toile",
        dimensions: "100x120cm",
        description: "Une exploration du mouvement primordial. La silhouette se détache d'un fond texturé, capturant l'instant précis où le mouvement devient intention.",
        imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1200",
        featured: true,
        gallery: []
      },
      {
        title: "La Traversée Solitaire",
        slug: "traversee-solitaire",
        series: "Les hommes qui marchent",
        year: "2023",
        medium: "Acrylique et techniques mixtes",
        dimensions: "80x100cm",
        description: "Le contraste entre la solitude de l'individu et l'immensité de l'espace qu'il arpente.",
        imageUrl: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=1200",
        featured: true,
        gallery: []
      }
    ];
    for (const art of defaultArtworks) {
      await addArtwork({ ...art, token: token || undefined });
    }
  };

  const seedPosts = async () => {
    const defaultPosts = [
      {
        title: "La quête de la verticalité",
        slug: "quete-verticalite",
        date: "12 Avril 2024",
        excerpt: "Pourquoi le marcheur est-il devenu mon sujet de prédilection ? Retour sur dix ans de recherche plastique.",
        content: "<h1>La Verticalité</h1><p>C'est dans le mouvement que je trouve la paix. Peindre un homme qui marche, c'est peindre l'humanité qui ne renonce jamais.</p><blockquote>'Le pas est le battement de cœur de la liberté.'</blockquote>",
        imageUrl: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1200"
      }
    ];

    for (const post of defaultPosts) {
      await addPost({ ...post, token: token || undefined });
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center font-serif italic text-white/30">Vérification de la session...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-brand-cream">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-black/40 border border-white/10 p-12 backdrop-blur-xl"
        >
          <div className="flex justify-center mb-8">
            <div className="p-4 rounded-full bg-brand-gold/10 text-brand-gold">
              <Lock size={32} />
            </div>
          </div>
          <h1 className="font-serif text-3xl text-center mb-2">Accès Sécurisé</h1>
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/30 text-center mb-12">Administration du Portfolio</p>
          
          <form onSubmit={async (e) => {
            e.preventDefault();
            setIsLoggingIn(true);
            setLoginError('');
            try {
              await login(email, password);
            } catch (err) {
              setLoginError("Identifiants incorrects ou accès refusé.");
            } finally {
              setIsLoggingIn(false);
            }
          }} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-white/40">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 p-4 text-sm focus:outline-none focus:border-brand-gold transition-all"
                placeholder="votre@email.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-white/40">Mot de Passe</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 p-4 text-sm focus:outline-none focus:border-brand-gold transition-all"
                placeholder="••••••••"
              />
            </div>
            
            {loginError && (
              <div className="text-red-400 text-xs flex items-center gap-2 animate-pulse">
                <AlertCircle size={14} />
                {loginError}
              </div>
            )}
            
            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-5 bg-white text-black font-bold text-[10px] uppercase tracking-[0.4em] hover:bg-brand-gold hover:text-white transition-all disabled:opacity-50"
            >
              {isLoggingIn ? "Connexion..." : "Se Connecter"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 min-h-screen bg-brand-cream overflow-hidden pb-40">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-white/5 pb-12">
          <div>
            <h1 className="font-serif text-5xl md:text-7xl mb-4 italic">Dashboard.</h1>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] mb-4">Gestionnaire de Contenu Artistique</p>
            <button 
              onClick={() => logout()}
              className="px-4 py-2 bg-white/5 border border-white/10 text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-white hover:text-black transition-all"
            >
              <LogOut size={12} /> Déconnexion
            </button>
          </div>
        </header>
          
          <nav className="flex gap-1 border border-white/10 p-1 rounded-sm bg-white/5">
            {[
              { id: 'demandes', label: 'Demandes' },
              { id: 'artworks', label: 'Portfolio' },
              { id: 'journal', label: 'Journal' },
              { id: 'categories', label: 'Catégories' },
              { id: 'series', label: 'Séries' },
              { id: 'settings', label: 'Réglages' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigate(`/admin/${tab.id}`)}
                className={cn(
                  "flex items-center gap-3 px-6 py-3 text-[10px] uppercase tracking-widest transition-all font-bold",
                  activeTab === tab.id 
                    ? "bg-brand-gold text-white" 
                    : "text-white/30 hover:text-white"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>

        <AnimatePresence mode="wait">
          {activeTab === 'demandes' && <AcquisitionsManager />}
          {activeTab === 'artworks' && (
            <motion.div 
              key="artworks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 xl:grid-cols-[1fr,400px] gap-12"
            >
              <div className="space-y-12" ref={artworkFormRef}>
                {editingArtwork ? (
                  <form onSubmit={handleSaveArtwork} className="bg-white/[0.02] border border-brand-gold/30 p-10 rounded-sm">
                    <div className="flex justify-between items-center mb-10">
                      <h2 className="text-2xl font-serif italic border-l-2 border-brand-gold pl-6">Modifier l'Œuvre</h2>
                      <button 
                        type="button" 
                        onClick={() => setEditingArtwork(null)}
                        className="text-[10px] uppercase tracking-widest text-white/30 hover:text-white"
                      >
                        Annuler
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                       <div className="space-y-4">
                          <label className="text-[10px] uppercase tracking-widest text-white/30">Informations Clés</label>
                          <input 
                            className="w-full bg-black/40 border border-white/5 p-4 text-sm focus:outline-none focus:border-brand-gold transition-all"
                            placeholder="Titre de l'œuvre" 
                            value={editingArtwork.title} 
                            onChange={e => {
                               const newTitle = e.target.value;
                               const currentSlug = editingArtwork.slug;
                               const autoSlug = slugify(editingArtwork.title);
                               setEditingArtwork({
                                 ...editingArtwork, 
                                 title: newTitle,
                                 slug: (!currentSlug || currentSlug === autoSlug) ? slugify(newTitle) : currentSlug
                               });
                            }} 
                          />
                          <div className="space-y-2">
                             <label className="text-[10px] uppercase tracking-widest text-white/30">Lien (Slug)</label>
                             <input 
                               className="w-full bg-black/40 border border-white/5 p-4 text-xs font-mono focus:outline-none focus:border-brand-gold transition-all text-brand-gold"
                               placeholder="URL-slug" 
                               value={editingArtwork.slug || ""} 
                               onChange={e => setEditingArtwork({...editingArtwork, slug: slugify(e.target.value)})} 
                             />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase tracking-widest text-white/30">Série</label>
                              <SeriesSelector 
                                value={editingArtwork.series || ""} 
                                onChange={(val) => setEditingArtwork({...editingArtwork, series: val})} 
                                token={token || undefined}
                              />
                            </div>
                            <input 
                              className="bg-black/40 border border-white/5 p-4 text-sm focus:outline-none focus:border-brand-gold transition-all"
                              placeholder="Année" 
                              value={editingArtwork.year} 
                              onChange={e => setEditingArtwork({...editingArtwork, year: e.target.value})} 
                            />
                          </div>
                          <input 
                            className="w-full bg-black/40 border border-white/5 p-4 text-sm focus:outline-none focus:border-brand-gold transition-all"
                            placeholder="Technique" 
                            value={editingArtwork.medium} 
                            onChange={e => setEditingArtwork({...editingArtwork, medium: e.target.value})} 
                          />
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/30">Catégorie</label>
                            <CategorySelector 
                              value={editingArtwork.category || ""} 
                              onChange={(val) => setEditingArtwork({...editingArtwork, category: val})} 
                              type="artwork" 
                              token={token || undefined}
                            />
                          </div>
                       </div>

                       <div className="space-y-4">
                          <label className="text-[10px] uppercase tracking-widest text-white/30">Visuel Principal</label>
                          <div className="relative group aspect-square bg-black/40 border border-white/5 flex items-center justify-center overflow-hidden">
                             {editingArtwork.imageUrl ? (
                               <>
                                 <img src={editingArtwork.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                 <button 
                                   type="button"
                                   onClick={() => setEditingArtwork({...editingArtwork, imageUrl: ''})}
                                   className="absolute top-4 right-4 p-2 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500"
                                 >
                                   <Trash2 size={14} />
                                 </button>
                               </>
                             ) : (
                               <ImageUpload 
                                 onUpload={(urls) => setEditingArtwork({...editingArtwork, imageUrl: urls[0]})} 
                                 label="Changer l'image"
                               />
                             )}
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4 mb-8">
                       <label className="text-[10px] uppercase tracking-widest text-white/30">Galerie Additionnelle</label>
                       <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                          {editingArtwork.gallery.map((imgUrl: string, idx: number) => (
                            <div key={idx} className="relative aspect-square bg-black/40 border border-white/5 rounded-sm overflow-hidden group">
                               <img src={imgUrl} className="w-full h-full object-cover" />
                               <button 
                                  type="button"
                                  onClick={() => setEditingArtwork({...editingArtwork, gallery: editingArtwork.gallery.filter((_ :any, i: number) => i !== idx)})}
                                  className="absolute inset-0 flex items-center justify-center bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-all"
                               >
                                  <Trash2 size={14} />
                               </button>
                            </div>
                          ))}
                          <div className="aspect-square">
                             <ImageUpload 
                                multiple 
                                onUpload={(urls) => setEditingArtwork({...editingArtwork, gallery: [...editingArtwork.gallery, ...urls]})} 
                                label="+" 
                             />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4 mb-8">
                       <label className="text-[10px] uppercase tracking-widest text-white/30">Description & Histoire</label>
                       <textarea 
                          className="w-full bg-black/40 border border-white/5 p-6 text-sm h-40 focus:outline-none focus:border-brand-gold transition-all resize-none leading-relaxed"
                          placeholder="Histoire..." 
                          value={editingArtwork.description} 
                          onChange={e => setEditingArtwork({...editingArtwork, description: e.target.value})} 
                       />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-white/40 cursor-pointer group">
                        <div className={cn(
                          "w-5 h-5 border border-white/20 flex items-center justify-center transition-all group-hover:border-brand-gold",
                          editingArtwork.featured ? "bg-brand-gold border-brand-gold" : ""
                        )}>
                          {editingArtwork.featured && <Check size={12} className="text-white" />}
                        </div>
                        <input 
                          type="checkbox" 
                          className="hidden"
                          checked={editingArtwork.featured} 
                          onChange={e => setEditingArtwork({...editingArtwork, featured: e.target.checked})} 
                        />
                        Mise en avant
                      </label>

                      <button className="bg-brand-gold text-white px-10 py-5 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-white hover:text-black transition-all">
                        Enregistrer les modifications
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleSaveArtwork} className="bg-white/[0.02] border border-white/5 p-10 rounded-sm">
                    <h2 className="text-2xl font-serif mb-10 italic border-l-2 border-brand-gold pl-6">Nouvelle Œuvre</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                       <div className="space-y-4">
                          <label className="text-[10px] uppercase tracking-widest text-white/30">Informations Clés</label>
                          <input 
                            className="w-full bg-black/40 border border-white/5 p-4 text-sm focus:outline-none focus:border-brand-gold transition-all"
                            placeholder="Titre de l'œuvre" 
                            value={newArtwork.title} 
                            onChange={e => {
                               const newTitle = e.target.value;
                               const currentSlug = newArtwork.slug;
                               const autoSlug = slugify(newArtwork.title);
                               setNewArtwork({
                                 ...newArtwork, 
                                 title: newTitle,
                                 slug: (!currentSlug || currentSlug === autoSlug) ? slugify(newTitle) : currentSlug
                               });
                            }} 
                          />
                          <div className="space-y-2">
                             <label className="text-[10px] uppercase tracking-widest text-white/30">Lien (Slug)</label>
                             <input 
                               className="w-full bg-black/40 border border-white/5 p-4 text-xs font-mono focus:outline-none focus:border-brand-gold transition-all text-brand-gold"
                               placeholder="URL-slug" 
                               value={newArtwork.slug || ""} 
                               onChange={e => setNewArtwork({...newArtwork, slug: slugify(e.target.value)})} 
                             />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase tracking-widest text-white/30">Série</label>
                              <SeriesSelector 
                                value={newArtwork.series || ""} 
                                onChange={(val) => setNewArtwork({...newArtwork, series: val})} 
                                token={token || undefined}
                              />
                            </div>
                            <input 
                              className="bg-black/40 border border-white/5 p-4 text-sm focus:outline-none focus:border-brand-gold transition-all"
                              placeholder="Année" 
                              value={newArtwork.year} 
                              onChange={e => setNewArtwork({...newArtwork, year: e.target.value})} 
                            />
                          </div>
                          <input 
                            className="w-full bg-black/40 border border-white/5 p-4 text-sm focus:outline-none focus:border-brand-gold transition-all"
                            placeholder="Technique (ex: Huile sur toile)" 
                            value={newArtwork.medium} 
                            onChange={e => setNewArtwork({...newArtwork, medium: e.target.value})} 
                          />
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/30">Catégorie</label>
                            <CategorySelector 
                              value={newArtwork.category || ""} 
                              onChange={(val) => setNewArtwork({...newArtwork, category: val})} 
                              type="artwork" 
                              token={token || undefined}
                            />
                          </div>
                       </div>

                       <div className="space-y-4">
                          <label className="text-[10px] uppercase tracking-widest text-white/30">Visuel Principal</label>
                          <div className="relative group aspect-square bg-black/40 border border-white/5 flex items-center justify-center overflow-hidden">
                             {newArtwork.imageUrl ? (
                               <>
                                 <img src={newArtwork.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                 <button 
                                   type="button"
                                   onClick={() => setNewArtwork({...newArtwork, imageUrl: ''})}
                                   className="absolute top-4 right-4 p-2 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500"
                                 >
                                   <Trash2 size={14} />
                                 </button>
                               </>
                             ) : (
                               <ImageUpload 
                                 onUpload={(urls) => setNewArtwork({...newArtwork, imageUrl: urls[0]})} 
                                 label="Ajouter l'image principale"
                               />
                             )}
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4 mb-8">
                       <label className="text-[10px] uppercase tracking-widest text-white/30">Galerie Additionnelle</label>
                       <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                          {newArtwork.gallery.map((imgUrl, idx) => (
                            <div key={idx} className="relative aspect-square bg-black/40 border border-white/5 rounded-sm overflow-hidden group">
                               <img src={imgUrl} className="w-full h-full object-cover" />
                               <button 
                                  type="button"
                                  onClick={() => setNewArtwork({...newArtwork, gallery: newArtwork.gallery.filter((_, i) => i !== idx)})}
                                  className="absolute inset-0 flex items-center justify-center bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-all"
                               >
                                  <Trash2 size={14} />
                               </button>
                            </div>
                          ))}
                          <div className="aspect-square">
                             <ImageUpload 
                                multiple 
                                onUpload={(urls) => setNewArtwork({...newArtwork, gallery: [...newArtwork.gallery, ...urls]})} 
                                label="+" 
                             />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4 mb-8">
                       <label className="text-[10px] uppercase tracking-widest text-white/30">Description & Histoire</label>
                       <textarea 
                          className="w-full bg-black/40 border border-white/5 p-6 text-sm h-40 focus:outline-none focus:border-brand-gold transition-all resize-none leading-relaxed"
                          placeholder="Racontez l'histoire de cette œuvre..." 
                          value={newArtwork.description} 
                          onChange={e => setNewArtwork({...newArtwork, description: e.target.value})} 
                       />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-white/40 cursor-pointer group">
                        <div className={cn(
                          "w-5 h-5 border border-white/20 flex items-center justify-center transition-all group-hover:border-brand-gold",
                          newArtwork.featured ? "bg-brand-gold border-brand-gold" : ""
                        )}>
                          {newArtwork.featured && <Check size={12} className="text-white" />}
                        </div>
                        <input 
                          type="checkbox" 
                          className="hidden"
                          checked={newArtwork.featured} 
                          onChange={e => setNewArtwork({...newArtwork, featured: e.target.checked})} 
                        />
                        Mettre en avant sur l'accueil
                      </label>

                      <button className="bg-brand-gold text-white px-10 py-5 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-white hover:text-black transition-all">
                        Publier l'œuvre
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {artworks?.map((a: any) => (
                    <motion.div 
                      layout
                      key={a._id} 
                      className="group flex gap-6 p-6 bg-white/[0.02] border border-white/5 hover:border-brand-gold/30 transition-all relative"
                    >
                      <div className="w-24 h-24 shrink-0 bg-black/40 overflow-hidden cursor-pointer" onClick={() => handleEditArtwork(a)}>
                        <img src={a.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center cursor-pointer" onClick={() => handleEditArtwork(a)}>
                        <h3 className="font-serif text-lg leading-tight mb-1">{a.title}</h3>
                        <div className="flex items-center gap-2">
                          <p className="text-[9px] text-white/30 uppercase tracking-[0.2em]">{a.series} — {a.year}</p>
                          {a.category && <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-[7px] uppercase tracking-widest text-white/40">{a.category}</span>}
                        </div>
                        {a.featured && <span className="text-[8px] text-brand-gold font-bold mt-2 tracking-widest">★ MISE EN AVANT</span>}
                      </div>
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => handleEditArtwork(a)}
                          className="p-2 text-white/30 hover:text-brand-gold transition-colors"
                          title="Modifier"
                        >
                          <Settings size={14} />
                        </button>
                        <button 
                          onClick={async () => {
                            await deleteArtwork({ id: a._id, token: token || undefined });
                            try { await fetch('/api/revalidate', { method: 'POST' }); } catch (err) { console.warn(err); }
                          }}
                          className="p-2 text-white/10 hover:text-red-500 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <aside className="space-y-8">
                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-sm">
                  <h3 className="text-sm font-serif italic mb-6">Statistiques</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end border-b border-white/5 pb-2">
                       <span className="text-[10px] text-white/30 uppercase tracking-widest">Total Œuvres</span>
                       <span className="text-2xl font-serif">{artworks?.length || 0}</span>
                    </div>
                    <div className="flex justify-between items-end border-b border-white/5 pb-2">
                       <span className="text-[10px] text-white/30 uppercase tracking-widest">Séries Actives</span>
                       <span className="text-2xl font-serif">{new Set(artworks?.map((a: any) => a.series)).size}</span>
                    </div>
                    <div className="flex justify-between items-end border-b border-white/5 pb-2">
                       <span className="text-[10px] text-white/30 uppercase tracking-widest">Catégories Portfolio</span>
                       <span className="text-2xl font-serif">{new Set(artworks?.map((a: any) => a.category).filter(Boolean)).size}</span>
                    </div>
                  </div>
                </div>
              </aside>
            </motion.div>
          )}

          {activeTab === 'journal' && (
            <motion.div 
              key="journal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto space-y-16"
              ref={postFormRef}
            >
              {editingPost ? (
                <form onSubmit={handleSavePost} className="bg-white/[0.02] border border-brand-gold/30 p-10 rounded-sm">
                  <div className="flex justify-between items-center mb-10">
                    <h2 className="text-2xl font-serif italic border-l-2 border-brand-gold pl-6">Modifier l'Article</h2>
                    <button 
                      type="button" 
                      onClick={() => setEditingPost(null)}
                      className="text-[10px] uppercase tracking-widest text-white/30 hover:text-white"
                    >
                      Annuler
                    </button>
                  </div>
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest text-white/30">Titre de l'article</label>
                        <input 
                          className="w-full bg-black/40 border border-white/10 p-4 text-3xl font-serif focus:outline-none focus:border-brand-gold transition-all italic"
                          placeholder="Titre..."
                          value={editingPost.title}
                          onChange={e => {
                             const newTitle = e.target.value;
                             const currentSlug = editingPost.slug;
                             const autoSlug = slugify(editingPost.title);
                             setEditingPost({
                               ...editingPost, 
                               title: newTitle,
                               slug: (!currentSlug || currentSlug === autoSlug) ? slugify(newTitle) : currentSlug
                             });
                          }}
                        />
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase tracking-widest text-white/30">Lien (Slug)</label>
                           <input 
                             className="w-full bg-black/40 border border-white/10 p-4 text-xs font-mono focus:outline-none focus:border-brand-gold transition-all text-brand-gold"
                             placeholder="url-de-larticle" 
                             value={editingPost.slug || ""} 
                             onChange={e => setEditingPost({...editingPost, slug: slugify(e.target.value)})} 
                           />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest text-white/30">Catégorie</label>
                        <CategorySelector 
                          value={editingPost.category || ""} 
                          onChange={(val) => setEditingPost({...editingPost, category: val})} 
                          type="post" 
                          token={token || undefined}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center border-y border-white/5 py-8">
                      <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-white/40">
                        Date
                        <input 
                          className="bg-black/40 border border-white/10 px-4 py-2 text-white focus:outline-none"
                          value={editingPost.date}
                          onChange={e => setEditingPost({...editingPost, date: e.target.value})}
                        />
                      </div>
                      {editingPost.imageUrl ? (
                        <div className="flex items-center gap-4">
                          <img src={editingPost.imageUrl} className="w-12 h-12 object-cover border border-white/10" referrerPolicy="no-referrer" />
                          <button 
                            type="button"
                            onClick={() => setEditingPost({...editingPost, imageUrl: ''})}
                            className="text-[9px] uppercase tracking-widest text-red-500 hover:underline"
                          >Changer Image</button>
                        </div>
                      ) : (
                        <ImageUpload label="Image de couverture" onUpload={(urls) => setEditingPost({...editingPost, imageUrl: urls[0]})} />
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 mt-8">
                    <label className="text-[10px] uppercase tracking-widest text-white/30">Extrait</label>
                    <textarea 
                      className="w-full bg-black/40 border border-white/10 p-6 text-sm h-24 focus:outline-none focus:border-brand-gold transition-all resize-none italic"
                      value={editingPost.excerpt} 
                      onChange={e => setEditingPost({...editingPost, excerpt: e.target.value})} 
                    />
                  </div>

                  <div className="space-y-4 mt-8">
                    <label className="text-[10px] uppercase tracking-widest text-white/30">Contenu</label>
                    <div className="p-1 border border-white/10 bg-black/20">
                      <NotionEditor 
                        value={editingPost.content} 
                        onChange={(val) => setEditingPost({...editingPost, content: val})} 
                      />
                    </div>
                  </div>

                  <button className="w-full mt-10 bg-white text-black py-6 uppercase tracking-[0.4em] text-[10px] font-bold hover:bg-brand-gold hover:text-white transition-all">
                    Mettre à jour l'article
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSavePost} className="bg-white/[0.02] border border-white/5 p-10 rounded-sm">
                  <h2 className="text-2xl font-serif mb-10 italic border-l-2 border-brand-gold pl-6">Nouvel Article</h2>
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest text-white/30">Titre de l'article</label>
                        <input 
                          className="w-full bg-black/40 border border-white/10 p-4 text-3xl font-serif focus:outline-none focus:border-brand-gold transition-all placeholder:text-white/10 italic"
                          placeholder="Le titre de votre pensée..."
                          value={newPost.title}
                          onChange={e => {
                             const newTitle = e.target.value;
                             const currentSlug = newPost.slug;
                             const autoSlug = slugify(newPost.title);
                             setNewPost({
                               ...newPost, 
                               title: newTitle,
                               slug: (!currentSlug || currentSlug === autoSlug) ? slugify(newTitle) : currentSlug
                             });
                          }}
                        />
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase tracking-widest text-white/30">Lien (Slug)</label>
                           <input 
                             className="w-full bg-black/40 border border-white/10 p-4 text-xs font-mono focus:outline-none focus:border-brand-gold transition-all text-brand-gold"
                             placeholder="url-de-larticle" 
                             value={newPost.slug || ""} 
                             onChange={e => setNewPost({...newPost, slug: slugify(e.target.value)})} 
                           />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest text-white/30">Catégorie</label>
                        <CategorySelector 
                          value={newPost.category || ""} 
                          onChange={(val) => setNewPost({...newPost, category: val})} 
                          type="post" 
                          token={token || undefined}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center border-y border-white/5 py-8">
                      <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-white/40">
                        Date de publication
                        <input 
                          className="bg-black/40 border border-white/10 px-4 py-2 text-white focus:outline-none"
                          value={newPost.date}
                          onChange={e => setNewPost({...newPost, date: e.target.value})}
                        />
                      </div>
                      {newPost.imageUrl ? (
                        <div className="flex items-center gap-4">
                          <img src={newPost.imageUrl} className="w-12 h-12 object-cover border border-white/10" referrerPolicy="no-referrer" />
                          <button 
                            type="button"
                            onClick={() => setNewPost({...newPost, imageUrl: ''})}
                            className="text-[9px] uppercase tracking-widest text-red-500 hover:underline"
                          >Supprimer</button>
                        </div>
                      ) : (
                        <ImageUpload label="Image de couverture" onUpload={(urls) => setNewPost({...newPost, imageUrl: urls[0]})} />
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 mt-8">
                    <label className="text-[10px] uppercase tracking-widest text-white/30">Extrait (Excerpt)</label>
                    <textarea 
                      className="w-full bg-black/40 border border-white/10 p-6 text-sm h-24 focus:outline-none focus:border-brand-gold transition-all resize-none italic"
                      placeholder="Un court résumé..." 
                      value={newPost.excerpt} 
                      onChange={e => setNewPost({...newPost, excerpt: e.target.value})} 
                    />
                  </div>

                  <div className="space-y-4 mt-8">
                    <label className="text-[10px] uppercase tracking-widest text-white/30">Contenu</label>
                    <div className="p-1 border border-white/10 bg-black/20">
                      <NotionEditor 
                        value={newPost.content} 
                        onChange={(val) => setNewPost({...newPost, content: val})} 
                      />
                    </div>
                  </div>

                  <button className="w-full mt-10 bg-white text-black py-6 uppercase tracking-[0.4em] text-[10px] font-bold hover:bg-brand-gold hover:text-white transition-all">
                    Publier l'article
                  </button>
                </form>
              )}

              <div className="space-y-8 pt-20 border-t border-white/10">
                <h3 className="font-serif text-3xl italic">Articles Récents</h3>
                {posts?.map((post: any) => (
                  <div key={post._id} className="group relative border-b border-white/5 pb-8 flex justify-between items-end">
                    <div className="cursor-pointer flex-1" onClick={() => handleEditPost(post)}>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[9px] uppercase tracking-widest text-white/30">{post.date}</span>
                        {post.category && <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-[7px] uppercase tracking-widest text-white/40">{post.category}</span>}
                      </div>
                      <h4 className="font-serif text-2xl group-hover:text-brand-gold transition-colors">{post.title}</h4>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => handleEditPost(post)}
                        className="p-3 text-white/30 hover:text-brand-gold transition-colors"
                        title="Modifier"
                      >
                        <Settings size={18} />
                      </button>
                      <button 
                        onClick={() => deletePost({ id: post._id, token: token || undefined })}
                        className="p-3 text-white/10 hover:text-red-500 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'categories' && (
            <motion.div 
              key="categories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto py-10"
            >
              <header className="text-center mb-16 border-b border-white/5 pb-10">
                <h2 className="font-serif text-4xl mb-2 italic">Gestion des Catégories</h2>
                <p className="text-white/40 max-w-md mx-auto text-[9px] uppercase tracking-[0.3em]">
                  Organisez vos œuvres et articles par thématiques
                </p>
              </header>

              <CategoriesManager />
            </motion.div>
          )}

          {activeTab === 'series' && (
            <motion.div 
              key="series"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto py-10"
            >
              <header className="text-center mb-16 border-b border-white/5 pb-10">
                <h2 className="font-serif text-4xl mb-2 italic">Gestion des Séries</h2>
                <p className="text-white/40 max-w-md mx-auto text-[9px] uppercase tracking-[0.3em]">
                  Créez des ensembles cohérents pour votre portfolio
                </p>
              </header>

              <SeriesManager formRef={seriesFormRef} onEdit={() => scrollToRef(seriesFormRef)} />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto py-10"
            >
              <header className="text-center mb-16 border-b border-white/5 pb-10">
                <h2 className="font-serif text-4xl mb-2 italic">Contenu du Site</h2>
                <p className="text-white/40 max-w-md mx-auto text-[9px] uppercase tracking-[0.3em]">
                  Configuration globale du portfolio
                </p>
              </header>

              <SiteSettingsEditor />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AboutPage() {
  const { settings } = useSettings();
  const initialSettings = (window as any).__INITIAL_DATA__?.settings || {};
  
  const aboutImage = settings?.aboutImage || initialSettings.aboutImage || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200";
  const aboutTitle = settings?.aboutTitle || initialSettings.aboutTitle || "L'Artiste <br /><span className=\"italic font-normal\">Derrière la toile.</span>";
  const aboutIntro = settings?.aboutIntro || initialSettings.aboutIntro || "Diplômée des Beaux-Arts, elle explore depuis plus de 20 ans la thématique de l'ombre portée et du mouvement.";
  const aboutContent = settings?.aboutContent || initialSettings.aboutContent || "<p>Son travail sur la série 'Les hommes qui marchent' a été exposé à Paris, Berlin et Tokyo. Elle utilise des pigments naturels qu'elle prépare elle-même, donnant à ses noirs une profondeur inégalée.</p><p>'Chaque matin, je commence par une marche. C'est là que je trouve la géométrie des corps, le rythme des épaules, l'inclinaison des têtes. Sur la toile, j'essaie de retrouver cette musique du pas.'</p>";

  return (
    <div className="pt-40 px-6 md:px-12 pb-32 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
        <div className="relative">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-brand-gold opacity-10 rounded-full blur-3xl" />
          <img 
            src={aboutImage} 
            alt="Artiste" 
            className="grayscale hover:grayscale-0 transition-all duration-1000 relative z-10 w-full aspect-[4/5] object-cover shadow-2xl"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div>
          <h1 className="font-serif text-6xl md:text-8xl tracking-tighter mb-8 leading-[0.9]" dangerouslySetInnerHTML={{ __html: aboutTitle }} />
          <p className="text-xl font-serif italic text-brand-charcoal/80 mb-8 leading-relaxed">
            {aboutIntro}
          </p>
          <div className="text-brand-charcoal/60 text-sm leading-relaxed space-y-6 font-light" dangerouslySetInnerHTML={{ __html: aboutContent }} />
          
          <div className="mt-12 flex gap-8">
            <div>
               <span className="text-[10px] uppercase tracking-widest text-brand-charcoal/20 block mb-4">Expositions Clés</span>
               <ul className="text-[10px] uppercase font-bold tracking-[0.2em] space-y-2 text-brand-charcoal/80">
                  <li>2024 — GALERIE VIVIENNE, PARIS</li>
                  <li>2023 — MUSEUM OF ART, BERLIN</li>
                  <li>2022 — ART BASEL, SUISSE</li>
               </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


function ThemeManager() {
  const { theme, updateTheme, resetTheme } = useTheme();

  const presets = [
    { name: 'Noir & Or', bg: '#0a0a0a', primary: '#d4af37', accent: '#ffffff' },
    { name: 'Pureté', bg: '#f9f9f9', primary: '#000000', accent: '#666666' },
    { name: 'Abysse', bg: '#050c18', primary: '#5a92d6', accent: '#ffffff' },
    { name: 'Argile', bg: '#1c1816', primary: '#b5835a', accent: '#f8f1e9' },
    { name: 'Canopée', bg: '#0d160e', primary: '#8da678', accent: '#fefae0' },
  ];

  const fonts: FontOption[] = ['Inter', 'Space Grotesk', 'Playfair Display', 'JetBrains Mono', 'Outfit'];

  return (
    <div className="space-y-12">
      {/* Presets Grid */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Palette size={16} className="text-brand-gold" />
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold">Thèmes Prédéfinis</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {presets.map(p => (
            <button
              key={p.name}
              onClick={() => updateTheme({ background: p.bg, primary: p.primary, accent: p.accent })}
              className="group p-4 bg-white/5 border border-white/10 hover:border-brand-gold transition-all text-left space-y-3"
            >
              <div className="flex gap-1">
                <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: p.bg }} />
                <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: p.primary }} />
                <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: p.accent }} />
              </div>
              <span className="block text-[8px] uppercase tracking-widest text-white/40 group-hover:text-white">{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Custom Colors */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <MousePointer2 size={16} className="text-brand-gold" />
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold">Couleurs</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center justify-between gap-4 p-4 bg-white/5 border border-white/10">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-white/40 block">Background</label>
                <span className="text-[8px] text-white/20 uppercase font-mono">{theme.background}</span>
              </div>
              <input 
                type="color" 
                value={theme.background} 
                onChange={e => updateTheme({ background: e.target.value })}
                className="w-12 h-12 bg-transparent cursor-pointer border-0"
              />
            </div>
            
            <div className="flex items-center justify-between gap-4 p-4 bg-white/5 border border-white/10">
               <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-white/40 block">Primaires / Or</label>
                <span className="text-[8px] text-white/20 uppercase font-mono">{theme.primary}</span>
              </div>
              <input 
                type="color" 
                value={theme.primary} 
                onChange={e => updateTheme({ primary: e.target.value })}
                className="w-12 h-12 bg-transparent cursor-pointer border-0"
              />
            </div>

            <div className="flex items-center justify-between gap-4 p-4 bg-white/5 border border-white/10">
               <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-white/40 block">Textes Secondaires</label>
                <span className="text-[8px] text-white/20 uppercase font-mono">{theme.accent}</span>
              </div>
              <input 
                type="color" 
                value={theme.accent} 
                onChange={e => updateTheme({ accent: e.target.value })}
                className="w-12 h-12 bg-transparent cursor-pointer border-0"
              />
            </div>
          </div>
        </div>

        {/* Fonts */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <FileText size={16} className="text-brand-gold" />
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold">Typographie</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {fonts.map(f => (
              <button
                key={f}
                onClick={() => updateTheme({ font: f })}
                className={cn(
                  "p-4 text-left border transition-all flex items-center justify-between",
                  theme.font === f ? "border-brand-gold bg-brand-gold/10 text-white" : "border-white/10 text-white/30 hover:border-white/30 hover:text-white"
                )}
                style={{ fontFamily: f }}
              >
                <div className="flex flex-col">
                  <span className="text-sm">{f}</span>
                  <span className="text-[8px] uppercase tracking-[0.2em]">L'art est un voyage vers l'âme.</span>
                </div>
                {theme.font === f && <Check size={14} className="text-brand-gold" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-12 border-t border-white/5 flex justify-between items-center">
        <p className="text-[10px] text-white/20 italic max-w-sm">
          Les modifications sont appliquées instantanément et persistées localement.
          Les contrastes sont ajustés automatiquement pour assurer la lisibilité.
        </p>
        <button 
          onClick={resetTheme}
          className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-all underline underline-offset-4"
        >
          Réinitialiser par défaut
        </button>
      </div>
    </div>
  );
}

function AppContent() {
  const { settings } = useSettings();
  
  React.useEffect(() => {
    if (settings?.brandName) {
      document.title = `${settings.brandName} — Portfolio`;
    }
  }, [settings?.brandName]);

  return (
    <div className="min-h-screen bg-brand-cream text-brand-charcoal font-sans selection:bg-brand-gold selection:text-white relative transition-colors duration-500">
      {/* Global Texture Overlay */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] z-[100]" />
      
      <Navigation />
      <ScrollToTop />
      
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
            <Route path="/portfolio" element={<PageTransition><PortfolioPage /></PageTransition>} />
            <Route path="/journal" element={<PageTransition><JournalPage /></PageTransition>} />
            <Route path="/commission" element={<PageTransition><CommissionPage /></PageTransition>} />
            <Route path="/journal/:slug" element={<PageTransition><JournalPage /></PageTransition>} />
            <Route path="/artwork/:slug" element={<PageTransition><ArtworkDetail /></PageTransition>} />
            <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
            <Route path="/admin" element={<PageTransition><AdminPage /></PageTransition>} />
            <Route path="/admin/:tab" element={<PageTransition><AdminPage /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <SettingsProvider>
            <AppContent />
          </SettingsProvider>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}
