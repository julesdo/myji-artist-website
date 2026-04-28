export interface Artwork {
  id: string;
  title: string;
  series: string;
  year: string;
  medium: string;
  dimensions: string;
  description: string;
  imageUrl: string;
  featured?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
}

export const ARTWORKS: Artwork[] = [
  {
    id: "h-01",
    title: "L'Éveil du Pas",
    series: "Les hommes qui marchent",
    year: "2024",
    medium: "Huile sur toile",
    dimensions: "100x120cm",
    description: "Une exploration du mouvement primordial. La silhouette se détache d'un fond texturé, capturant l'instant précis où le mouvement devient intention. Cette œuvre marque le début d'une recherche sur la fluidité de la stature humaine.",
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1200",
    featured: true
  },
  {
    id: "h-02",
    title: "La Traversée Solitaire",
    series: "Les hommes qui marchent",
    year: "2023",
    medium: "Acrylique et techniques mixtes",
    dimensions: "80x100cm",
    description: "Le contraste entre la solitude de l'individu et l'immensité de l'espace qu'il arpente. Les couches successives de matière créent une profondeur qui semble absorber le spectateur dans la marche du sujet.",
    imageUrl: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=1200",
    featured: true
  },
  {
    id: "h-03",
    title: "Rythme de Passage",
    series: "Les hommes qui marchent",
    year: "2024",
    medium: "Huile sur toile",
    dimensions: "120x150cm",
    description: "Une œuvre monumentale où le rythme des pas crée une vibration chromatique. On y devine l'influence de la musique minimaliste dans la répétition des formes et des ombres.",
    imageUrl: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1200",
    featured: true
  },
  {
    id: "v-01",
    title: "Reflets d'Azur",
    series: "Paysages Intérieurs",
    year: "2023",
    medium: "Huile sur toile",
    dimensions: "90x90cm",
    description: "Une série plus calme, axée sur la lumière et la sérénité. Ici, l'horizon s'efface au profit d'une sensation pure de couleur et de texture.",
    imageUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1200"
  },
  {
    id: "v-02",
    title: "Brume Matinale",
    series: "Paysages Intérieurs",
    year: "2024",
    medium: "Technique mixte",
    dimensions: "100x100cm",
    description: "Une évocation de la lumière filtrée par le brouillard. La toile devient un espace de méditation.",
    imageUrl: "https://images.unsplash.com/photo-1541450202165-237a18909b44?q=80&w=1200"
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "p-01",
    title: "La Genèse des Hommes qui Marchent",
    date: "14 Mars 2024",
    excerpt: "Comment une simple silhouette dans la rue a inspiré une série de plus de vingt toiles.",
    content: "Tout a commencé un matin d'hiver, en observant les passants sur le pont Neuf. Il y avait une force silencieuse dans cette marche collective, une détermination brute..."
  },
  {
    id: "p-02",
    title: "L'art de préparer sa toile",
    date: "2 Avril 2024",
    excerpt: "Pourquoi le support est aussi important que le pigment lui-même.",
    content: "Le choix du grain, l'enduction, la première couche chargée d'émotion. Voici mes rituels d'atelier."
  }
];
