import { Product } from "./types";

export const products: Product[] = [
  {
    id: "blush-bloom",
    name: "Blush Bloom",
    description: "Soft pink roses with eucalyptus and babys breath.",
    price: 59,
    stock: 12,
    image: "/bouquet1.jpg",
    categories: ["Occasion:Anniversary", "FlowerType:Roses", "Price:Under$70"],
  },
  {
    id: "dune-beige",
    name: "Dune Beige",
    description: "Neutral tones with lilies and wildflowers for any celebration.",
    price: 49,
    stock: 8,
    image: "/bouquet2.jpg",
    categories: ["Occasion:Birthday", "FlowerType:Lilies", "Price:Under$70"],
  },
  {
    id: "pretty-roses",
    name: "Pretty Roses",
    description: "A bouquet of classic red and pink roses for romance.",
    price: 85,
    stock: 3,
    image: "/bouquet3.jpg",
    categories: ["Occasion:Valentine", "FlowerType:Roses", "Price:$70-$100"],
  },
  {
    id: "wild-whisper",
    name: "Wild Whisper",
    description: "Bright sunflowers and daisies bring cheerful energy.",
    price: 39,
    stock: 15,
    image: "/bouquet4.jpg",
    categories: ["Occasion:Friendship", "FlowerType:Sunflower", "Price:Under$70"],
  },
];
