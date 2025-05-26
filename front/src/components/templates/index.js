import ClassicTemplate from "./ClassicTemplate";
import ModernTemplate from "./ModernTemplate";
import MinimalistTemplate from "./MinimalistTemplate";
import ProfessionalTemplate from "./ProfessionalTemplate";
import CreativeTemplate from "./CreativeTemplate";

export {
  ClassicTemplate,
  ModernTemplate,
  MinimalistTemplate,
  ProfessionalTemplate,
  CreativeTemplate,
};

export const TEMPLATES = [
  {
    id: "classic",
    name: "Classic",
    component: ClassicTemplate,
    description: "A traditional resume format with a professional look",
    previewImage: "/templates/classic.png",
  },
  {
    id: "modern",
    name: "Modern",
    component: ModernTemplate,
    description: "A contemporary design with a sidebar for skills",
    previewImage: "/templates/modern.png",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    component: MinimalistTemplate,
    description: "A clean, minimal design focusing on content",
    previewImage: "/templates/minimalist.png",
  },
  {
    id: "professional",
    name: "Professional",
    component: ProfessionalTemplate,
    description: "An elegant business-focused template with polished sections",
    previewImage: "/templates/professional.png",
  },
  {
    id: "creative",
    name: "Creative",
    component: CreativeTemplate,
    description: "A vibrant, modern design with custom styling and skill bars",
    previewImage: "/templates/creative.png",
  },
];
