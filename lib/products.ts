export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  size: string;
  category: string;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  ingredients: string[];
  howToUse: string[];
  benefits: string[];
  badges: string[];
  inStock: boolean;
  featured: boolean;
  isNew?: boolean;
}

export const products: Product[] = [
  {
    id: "fluno-hand-wash-250ml",
    slug: "fluno-hand-wash-250ml",
    name: "Fluno Hand Wash",
    tagline: "Gentle daily cleansing for soft, healthy hands",
    price: 80,
    size: "250ml",
    category: "Hand Care",
    rating: 4.5,
    reviewCount: 47,
    images: [
      "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=600&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80",
    ],
    description:
      "Our signature hand wash combines gentle surfactants with skin-conditioning agents to clean without stripping. pH-balanced and free from harsh sulphates.",
    ingredients: [
      "Aqua",
      "Cocamidopropyl Betaine",
      "Sodium Lauryl Sulfoacetate",
      "Glycerin",
      "Aloe Barbadensis Leaf Extract",
      "Panthenol",
      "Citric Acid",
      "Sodium Benzoate",
      "Parfum",
    ],
    howToUse: [
      "Wet hands with water",
      "Pump 1–2 times onto palms",
      "Lather for 20 seconds covering all surfaces",
      "Rinse thoroughly with clean water",
    ],
    benefits: [
      "pH-balanced formula",
      "Sulphate-free surfactants",
      "Moisturises while cleansing",
      "Kind to everyday skin",
    ],
    badges: ["Sulphate-Free", "pH Balanced", "Cruelty-Free"],
    inStock: true,
    featured: true,
  },
  {
    id: "fluno-spf50-sunscreen",
    slug: "fluno-spf50-sunscreen",
    name: "Fluno Sunscreen SPF 50+ PA++++",
    tagline: "Broad-spectrum UVA/UVB protection, lightweight finish",
    price: 499,
    size: "50g",
    category: "Sun Care",
    rating: 4.8,
    reviewCount: 12,
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80",
    ],
    description:
      "Our flagship SPF 50+ PA++++ sunscreen uses broad-spectrum UV filters for dependable everyday protection. Lightweight, no white cast, water-resistant.",
    ingredients: [
      "Aqua",
      "Ethylhexyl Methoxycinnamate",
      "Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine",
      "Diethylamino Hydroxybenzoyl Hexyl Benzoate",
      "Butyl Methoxydibenzoylmethane",
      "Titanium Dioxide (nano)",
      "Niacinamide",
      "Tocopheryl Acetate",
      "Glycerin",
      "Phenoxyethanol",
    ],
    howToUse: [
      "Apply generously 15 minutes before sun exposure",
      "Use on face, neck, and all exposed areas",
      "Reapply every 2 hours or after swimming/sweating",
      "Use last step in AM skincare routine",
    ],
    benefits: [
      "SPF 50+ PA++++",
      "Broad-spectrum UV filters",
      "No white cast",
      "Water resistant",
      "Niacinamide brightening",
    ],
    badges: ["SPF 50+", "PA++++", "Broad Spectrum", "No White Cast"],
    inStock: true,
    featured: true,
    isNew: true,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}
