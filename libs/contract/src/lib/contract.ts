import { z } from 'zod';

export const YellowBookEntrySchema = z.object({
  id: z.string().uuid().optional(),
  businessName: z.string().min(1, 'Business name is required'),
  category: z.string().min(1, 'Category is required'),
  phoneNumber: z.string().regex(/^\+?[\d\s\-()]+$/, 'Invalid phone number'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().length(2, 'State must be 2 characters'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid zip code'),
  description: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type YellowBookEntry = z.infer<typeof YellowBookEntrySchema>;

export const CreateYellowBookEntrySchema = YellowBookEntrySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateYellowBookEntry = z.infer<typeof CreateYellowBookEntrySchema>;
