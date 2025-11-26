export interface Organization {
  id: number;
  name: string;
  category: string;
  description: string;
  fullDescription: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  logo: string;
  featured: boolean;
  services: string[];
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  hours: string;
}
