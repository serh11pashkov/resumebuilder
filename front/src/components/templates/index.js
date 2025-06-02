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

// Array of templates (for selection interfaces)
export const TEMPLATE_LIST = [
  {
    id: "classic",
    name: "Класичний",
    component: ClassicTemplate,
    description: "Традиційний формат резюме з професійним виглядом",
    previewImage: "/templates/classic.png",
  },
  {
    id: "modern",
    name: "Сучасний",
    component: ModernTemplate,
    description: "Сучасний дизайн з бічною панеллю для навичок",
    previewImage: "/templates/modern.png",
  },
  {
    id: "minimalist",
    name: "Мінімалістичний",
    component: MinimalistTemplate,
    description: "Чистий, мінімалістичний дизайн з акцентом на зміст",
    previewImage: "/templates/minimalist.png",
  },
  {
    id: "professional",
    name: "Професійний",
    component: ProfessionalTemplate,
    description:
      "Елегантний шаблон бізнес-спрямованості з відшліфованими розділами",
    previewImage: "/templates/professional.png",
  },
  {
    id: "creative",
    name: "Креативний",
    component: CreativeTemplate,
    description:
      "Яскравий, сучасний дизайн з індивідуальним стилем та смужками навичок",
    previewImage: "/templates/creative.png",
  },
];

// Object mapping for direct template access by name
export const TEMPLATES = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimalist: MinimalistTemplate,
  professional: ProfessionalTemplate,
  creative: CreativeTemplate,
  Basic: ClassicTemplate, // Default/fallback template
};
