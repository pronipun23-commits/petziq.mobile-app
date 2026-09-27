export type Pet = {
  id: string;
  name: string;
  type: 'Dog' | 'Cat' | 'Bird' | 'Rabbit' | 'Reptile';
  breed: string;
  age: string;
  avatar: string;
  accent: string;
  health: string;
  notes: string;
};

export type Plant = {
  id: string;
  name: string;
  type: string;
  health: string;
  lastWatered: string;
  accent: string;
  image: string;
};

export const pets: Pet[] = [
  {
    id: 'pet-1',
    name: 'Milo',
    type: 'Dog',
    breed: 'Mini Aussie',
    age: '2 years',
    avatar: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80',
    accent: '#2ec7a2',
    health: 'Excellent',
    notes: 'Loves walks and plays with his blue ball.',
  },
  {
    id: 'pet-2',
    name: 'Luna',
    type: 'Cat',
    breed: 'Siamese',
    age: '4 years',
    avatar: 'https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=800&q=80',
    accent: '#7dd3fc',
    health: 'Stable',
    notes: 'Needs a quiet space after 8pm.',
  },
];

export const plants: Plant[] = [
  {
    id: 'plant-1',
    name: 'Monstera',
    type: 'Indoor tropical',
    health: 'Thriving',
    lastWatered: '2 days ago',
    accent: '#34d399',
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'plant-2',
    name: 'Aloe Vera',
    type: 'Succulent',
    health: 'Healthy',
    lastWatered: '5 days ago',
    accent: '#a3e635',
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80',
  },
];

export const quickActions = [
  { id: 'care', title: 'Care plan', subtitle: 'Daily routines' },
  { id: 'scan', title: 'Scan QR', subtitle: 'Pet profile' },
  { id: 'reminders', title: 'Reminders', subtitle: 'Water + meds' },
  { id: 'ai', title: 'Petziq AI', subtitle: 'Smart answers' },
];

export const smartTags = [
  { id: 'tag-001', name: 'Milo Tag', status: 'Connected', pet: 'Milo' },
  { id: 'tag-002', name: 'Luna Tag', status: 'Needs sync', pet: 'Luna' },
];
