// Seeded PRNG for deterministic data generation
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(42);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const pickN = (arr, n) => {
  const shuffled = [...arr].sort(() => rand() - 0.5);
  return shuffled.slice(0, n);
};
const randBetween = (min, max) => Math.floor(rand() * (max - min + 1)) + min;
const varyPrice = (base) => {
  const v = base + Math.round((rand() - 0.5) * base * 0.3);
  return Math.round(v / 5) * 5 || 5;
};

// ── Categories ──────────────────────────────────────────────

export const CATEGORIES = [
  { id: 'beauty_salon', name: 'Beauty Salon', icon: '✨', gradient: ['#ec4899', '#f472b6'], mapColor: '#ec4899' },
  { id: 'barber', name: 'Barber Shop', icon: '✂️', gradient: ['#1e3a5f', '#475569'], mapColor: '#1e3a5f' },
  { id: 'hair_salon', name: 'Hair Salon', icon: '💇', gradient: ['#8b5cf6', '#a78bfa'], mapColor: '#8b5cf6' },
  { id: 'spa', name: 'Spa & Wellness', icon: '🧖', gradient: ['#0d9488', '#2dd4bf'], mapColor: '#0d9488' },
  { id: 'nail_studio', name: 'Nail Studio', icon: '💅', gradient: ['#d946ef', '#e879f9'], mapColor: '#d946ef' },
  { id: 'dental', name: 'Dental Clinic', icon: '🦷', gradient: ['#0284c7', '#38bdf8'], mapColor: '#0284c7' },
  { id: 'tattoo', name: 'Tattoo Studio', icon: '🎨', gradient: ['#ea580c', '#fb923c'], mapColor: '#ea580c' },
  { id: 'physio', name: 'Physiotherapy', icon: '💪', gradient: ['#16a34a', '#4ade80'], mapColor: '#16a34a' },
  { id: 'massage', name: 'Massage Therapy', icon: '💆', gradient: ['#7c3aed', '#a78bfa'], mapColor: '#7c3aed' },
  { id: 'pet_grooming', name: 'Pet Grooming', icon: '🐾', gradient: ['#ca8a04', '#facc15'], mapColor: '#ca8a04' },
];

export function getCategoryById(id) {
  return CATEGORIES.find((c) => c.id === id);
}

// ── Service templates ───────────────────────────────────────

const SERVICE_TEMPLATES = {
  beauty_salon: [
    { name: 'Full Makeup Application', duration: 60, basePrice: 55, desc: 'Complete makeup look for any occasion' },
    { name: 'Bridal Makeup', duration: 90, basePrice: 120, desc: 'Luxurious bridal makeup with trial included' },
    { name: 'Classic Facial', duration: 45, basePrice: 45, desc: 'Deep cleanse and hydrating facial treatment' },
    { name: 'Eyebrow Shaping & Tint', duration: 25, basePrice: 18, desc: 'Precision brow shaping with optional tint' },
    { name: 'Lash Extensions (Full Set)', duration: 75, basePrice: 65, desc: 'Individual lash extensions for a natural look' },
    { name: 'Lash Lift & Tint', duration: 45, basePrice: 40, desc: 'Semi-permanent lash curl with tint' },
    { name: 'Skin Consultation', duration: 30, basePrice: 25, desc: 'Personalised skin analysis and routine advice' },
    { name: 'Chemical Peel', duration: 40, basePrice: 55, desc: 'Professional-grade peel for skin renewal' },
  ],
  barber: [
    { name: 'Classic Haircut', duration: 30, basePrice: 22, desc: 'Traditional cut with scissors and clippers' },
    { name: 'Skin Fade', duration: 35, basePrice: 25, desc: 'Precision skin fade with seamless blend' },
    { name: 'Beard Trim & Shape', duration: 20, basePrice: 15, desc: 'Professional beard sculpting and trimming' },
    { name: 'Hot Towel Shave', duration: 30, basePrice: 28, desc: 'Traditional wet shave with hot towel treatment' },
    { name: 'Haircut & Beard Combo', duration: 45, basePrice: 35, desc: 'Full haircut plus beard trim package' },
    { name: 'Kids Haircut', duration: 20, basePrice: 14, desc: 'Haircut for children under 12' },
    { name: 'Head Shave', duration: 25, basePrice: 18, desc: 'Clean head shave with hot towel finish' },
    { name: 'Hair Design / Pattern', duration: 40, basePrice: 30, desc: 'Custom hair art and pattern shaving' },
  ],
  hair_salon: [
    { name: 'Cut & Blow Dry', duration: 60, basePrice: 48, desc: 'Precision cut with professional blow dry' },
    { name: 'Full Colour', duration: 90, basePrice: 85, desc: 'Root-to-tip colour application' },
    { name: 'Highlights (Half Head)', duration: 75, basePrice: 75, desc: 'Foil highlights for natural dimension' },
    { name: 'Highlights (Full Head)', duration: 105, basePrice: 110, desc: 'Full head of foil highlights' },
    { name: 'Balayage', duration: 120, basePrice: 130, desc: 'Hand-painted colour for a sun-kissed effect' },
    { name: 'Blow Dry & Style', duration: 35, basePrice: 30, desc: 'Professional blow dry and styling' },
    { name: 'Keratin Treatment', duration: 120, basePrice: 150, desc: 'Smoothing treatment for frizz-free hair' },
    { name: 'Olaplex Treatment', duration: 30, basePrice: 35, desc: 'Bond-building repair treatment' },
  ],
  spa: [
    { name: 'Swedish Massage (60min)', duration: 60, basePrice: 65, desc: 'Full body relaxation massage' },
    { name: 'Hot Stone Therapy', duration: 75, basePrice: 80, desc: 'Heated basalt stones for deep relaxation' },
    { name: 'Aromatherapy Massage', duration: 60, basePrice: 70, desc: 'Essential oil massage for mind and body' },
    { name: 'Luxury Facial', duration: 60, basePrice: 75, desc: 'Premium facial with targeted serums' },
    { name: 'Body Wrap', duration: 60, basePrice: 60, desc: 'Detoxifying full body wrap treatment' },
    { name: 'Half Day Spa Package', duration: 180, basePrice: 150, desc: 'Massage, facial, and use of spa facilities' },
    { name: 'Couples Massage', duration: 60, basePrice: 120, desc: 'Side-by-side massage for two' },
    { name: 'Indian Head Massage', duration: 30, basePrice: 35, desc: 'Traditional head, neck and shoulder massage' },
  ],
  nail_studio: [
    { name: 'Gel Manicure', duration: 45, basePrice: 30, desc: 'Long-lasting gel polish with nail shaping' },
    { name: 'Classic Manicure', duration: 30, basePrice: 22, desc: 'File, buff, cuticle care and polish' },
    { name: 'Gel Pedicure', duration: 50, basePrice: 35, desc: 'Gel polish pedicure with foot soak' },
    { name: 'Classic Pedicure', duration: 40, basePrice: 28, desc: 'Full pedicure with polish application' },
    { name: 'Nail Art (per nail)', duration: 10, basePrice: 5, desc: 'Custom hand-painted nail art designs' },
    { name: 'Acrylic Full Set', duration: 60, basePrice: 40, desc: 'Full set of acrylic nail extensions' },
    { name: 'Acrylic Infills', duration: 45, basePrice: 30, desc: 'Maintenance fill for acrylic nails' },
    { name: 'BIAB Manicure', duration: 50, basePrice: 38, desc: 'Builder gel for natural nail strengthening' },
  ],
  dental: [
    { name: 'Check-up & Clean', duration: 30, basePrice: 65, desc: 'Comprehensive dental examination and hygiene' },
    { name: 'Scale & Polish', duration: 30, basePrice: 55, desc: 'Professional teeth cleaning and polishing' },
    { name: 'Teeth Whitening', duration: 60, basePrice: 250, desc: 'In-chair professional whitening treatment' },
    { name: 'White Filling', duration: 30, basePrice: 95, desc: 'Tooth-coloured composite filling' },
    { name: 'Root Canal Treatment', duration: 60, basePrice: 350, desc: 'Endodontic treatment to save damaged teeth' },
    { name: 'Dental Crown', duration: 60, basePrice: 450, desc: 'Custom porcelain crown restoration' },
    { name: 'Invisalign Consultation', duration: 30, basePrice: 0, desc: 'Free consultation for clear aligner treatment' },
    { name: 'Emergency Appointment', duration: 20, basePrice: 85, desc: 'Same-day emergency dental care' },
  ],
  tattoo: [
    { name: 'Small Tattoo (up to 2")', duration: 60, basePrice: 60, desc: 'Small custom or flash tattoo design' },
    { name: 'Medium Tattoo (2-4")', duration: 120, basePrice: 150, desc: 'Medium-sized custom tattoo work' },
    { name: 'Large Tattoo (4-6")', duration: 180, basePrice: 280, desc: 'Larger custom piece with detail' },
    { name: 'Half Sleeve (per session)', duration: 240, basePrice: 400, desc: 'Multi-session half sleeve work' },
    { name: 'Cover Up Consultation', duration: 30, basePrice: 0, desc: 'Free assessment for cover-up possibilities' },
    { name: 'Tattoo Touch Up', duration: 30, basePrice: 40, desc: 'Touch up and refresh existing tattoos' },
    { name: 'Piercing (Ear Lobe)', duration: 15, basePrice: 25, desc: 'Standard ear lobe piercing with stud' },
    { name: 'Piercing (Cartilage)', duration: 15, basePrice: 30, desc: 'Helix, tragus or other cartilage piercing' },
  ],
  physio: [
    { name: 'Initial Assessment', duration: 60, basePrice: 65, desc: 'Comprehensive first appointment and diagnosis' },
    { name: 'Follow-up Session', duration: 30, basePrice: 45, desc: 'Ongoing treatment and progress review' },
    { name: 'Sports Injury Rehab', duration: 45, basePrice: 55, desc: 'Targeted rehabilitation for sports injuries' },
    { name: 'Back & Neck Treatment', duration: 45, basePrice: 55, desc: 'Specialist treatment for spinal issues' },
    { name: 'Post-Surgery Rehab', duration: 45, basePrice: 55, desc: 'Guided recovery after surgical procedures' },
    { name: 'Dry Needling / Acupuncture', duration: 30, basePrice: 45, desc: 'Trigger point therapy and pain management' },
    { name: 'Shockwave Therapy', duration: 20, basePrice: 50, desc: 'Advanced treatment for chronic conditions' },
    { name: 'Biomechanical Assessment', duration: 45, basePrice: 60, desc: 'Movement analysis and gait assessment' },
  ],
  massage: [
    { name: 'Deep Tissue Massage (60min)', duration: 60, basePrice: 60, desc: 'Firm pressure massage for tension release' },
    { name: 'Deep Tissue Massage (90min)', duration: 90, basePrice: 85, desc: 'Extended deep tissue session' },
    { name: 'Sports Massage', duration: 45, basePrice: 50, desc: 'Pre/post event muscle conditioning' },
    { name: 'Pregnancy Massage', duration: 60, basePrice: 60, desc: 'Gentle massage safe for expectant mothers' },
    { name: 'Reflexology', duration: 45, basePrice: 45, desc: 'Pressure point therapy on feet and hands' },
    { name: 'Thai Massage', duration: 60, basePrice: 65, desc: 'Traditional Thai stretching and pressure work' },
    { name: 'Back, Neck & Shoulders', duration: 30, basePrice: 35, desc: 'Focused upper body tension relief' },
    { name: 'Lymphatic Drainage', duration: 60, basePrice: 65, desc: 'Gentle massage to support lymph flow' },
  ],
  pet_grooming: [
    { name: 'Full Groom (Small Dog)', duration: 60, basePrice: 35, desc: 'Bath, dry, clip, nails, ears and finish' },
    { name: 'Full Groom (Medium Dog)', duration: 75, basePrice: 45, desc: 'Complete grooming for medium breeds' },
    { name: 'Full Groom (Large Dog)', duration: 90, basePrice: 55, desc: 'Full service for large breed dogs' },
    { name: 'Bath & Tidy', duration: 40, basePrice: 25, desc: 'Wash, dry and light trimming' },
    { name: 'Puppy First Groom', duration: 30, basePrice: 20, desc: 'Gentle introduction to grooming for puppies' },
    { name: 'Nail Clipping', duration: 15, basePrice: 10, desc: 'Quick nail trim for dogs or cats' },
    { name: 'De-shedding Treatment', duration: 45, basePrice: 30, desc: 'Specialist treatment to reduce shedding' },
    { name: 'Cat Grooming', duration: 45, basePrice: 40, desc: 'Full grooming service for feline friends' },
  ],
};

// ── Staff pools ─────────────────────────────────────────────

const FIRST_NAMES = [
  'Olivia', 'Amelia', 'Isla', 'Ava', 'Mia', 'Grace', 'Emily', 'Lily',
  'Ella', 'Chloe', 'Sophie', 'Daisy', 'Ruby', 'Florence', 'Freya',
  'Eva', 'Lucy', 'Poppy', 'Rosie', 'Zara', 'Emma', 'Hannah', 'Jessica',
  'Fiona', 'Eilidh', 'Catriona', 'Iona', 'Skye', 'Lauren', 'Amy',
  'James', 'Oliver', 'Jack', 'Harry', 'George', 'William', 'Thomas',
  'Charlie', 'Oscar', 'Henry', 'Archie', 'Leo', 'Noah', 'Freddie',
  'Arthur', 'Logan', 'Daniel', 'Ethan', 'Max', 'Callum', 'Finlay',
  'Hamish', 'Angus', 'Rory', 'Murray', 'Fraser', 'Liam', 'Ben',
];

const LAST_NAMES = [
  'Smith', 'Brown', 'Wilson', 'Taylor', 'Campbell', 'Stewart', 'Anderson',
  'MacDonald', 'Robertson', 'Thomson', 'Murray', 'Fraser', 'Ross', 'Graham',
  'Hamilton', 'Scott', 'Reid', 'Clark', 'Watson', 'Young', 'Mitchell',
  'Walker', 'Morrison', 'Paterson', 'Douglas', 'Henderson', 'Burns',
  'MacLeod', 'Kerr', 'Gibson', 'Grant', 'Sinclair', 'Duncan', 'Ferguson',
];

const STAFF_ROLES = {
  beauty_salon: ['Senior Beauty Therapist', 'Beauty Therapist', 'Makeup Artist', 'Skin Specialist', 'Lash Technician'],
  barber: ['Master Barber', 'Senior Barber', 'Barber', 'Junior Barber'],
  hair_salon: ['Creative Director', 'Senior Stylist', 'Stylist', 'Colourist', 'Junior Stylist'],
  spa: ['Senior Spa Therapist', 'Spa Therapist', 'Massage Therapist', 'Wellness Consultant'],
  nail_studio: ['Senior Nail Technician', 'Nail Technician', 'Nail Artist', 'Junior Nail Tech'],
  dental: ['Principal Dentist', 'Associate Dentist', 'Dental Hygienist', 'Orthodontist'],
  tattoo: ['Senior Tattoo Artist', 'Tattoo Artist', 'Apprentice Artist', 'Piercing Specialist'],
  physio: ['Senior Physiotherapist', 'Physiotherapist', 'Sports Therapist', 'Rehabilitation Specialist'],
  massage: ['Senior Massage Therapist', 'Massage Therapist', 'Sports Massage Specialist', 'Holistic Therapist'],
  pet_grooming: ['Head Groomer', 'Senior Groomer', 'Dog Groomer', 'Cat Specialist'],
};

const REVIEW_COMMENTS = [
  'Absolutely fantastic experience! Will definitely be coming back.',
  'Really professional service from start to finish. Highly recommend.',
  'Lovely atmosphere and friendly staff. Very happy with the result.',
  'Great value for money. The quality was excellent.',
  'Amazing attention to detail. Felt very well looked after.',
  'Best experience I\'ve had in Edinburgh. Top notch!',
  'Very skilled team. I\'m so pleased with how everything turned out.',
  'Warm and welcoming from the moment I walked in. Beautiful space too.',
  'Exceeded my expectations completely. Already booked my next appointment.',
  'Professional, friendly, and talented. What more could you ask for?',
  'A hidden gem! The service was impeccable and the results were stunning.',
  'I was a bit nervous but the team made me feel so comfortable.',
  'Couldn\'t be happier. The staff really know what they\'re doing.',
  'Such a relaxing experience. I left feeling incredible.',
  'I\'ve tried many places in Edinburgh and this is by far the best.',
  'Top quality service at a reasonable price. Very impressed.',
  'The booking process was easy and the service lived up to expectations.',
  'My go-to place now. Consistent quality every single time.',
  'Friendly team who clearly love what they do. Great results.',
  'I recommended this to all my friends and they loved it too.',
  'Good service overall though the wait was slightly longer than expected.',
  'Decent experience. The staff were nice but felt a bit rushed.',
  'Pretty good but I think the prices have gone up recently.',
  'Nice enough but I preferred the previous stylist I had here.',
  'Solid experience. Nothing spectacular but perfectly competent.',
];

const REVIEWER_NAMES = [
  'Sarah M.', 'David K.', 'Emma T.', 'Michael R.', 'Laura W.',
  'Chris B.', 'Katie S.', 'Andrew H.', 'Rachel D.', 'Mark F.',
  'Jennifer L.', 'Stuart C.', 'Claire A.', 'Tom P.', 'Nicola G.',
  'Steven J.', 'Heather M.', 'Paul W.', 'Alison B.', 'Graeme T.',
  'Kirsty R.', 'John S.', 'Morag H.', 'Iain D.', 'Carolyn F.',
  'Derek L.', 'Fiona C.', 'Brian A.', 'Shona P.', 'Gordon K.',
];

// ── Opening hours templates ─────────────────────────────────

const HOURS_STANDARD = {
  Mon: '09:00 - 18:00', Tue: '09:00 - 18:00', Wed: '09:00 - 18:00',
  Thu: '09:00 - 20:00', Fri: '09:00 - 18:00', Sat: '09:00 - 17:00', Sun: 'Closed',
};
const HOURS_EXTENDED = {
  Mon: '08:00 - 20:00', Tue: '08:00 - 20:00', Wed: '08:00 - 20:00',
  Thu: '08:00 - 21:00', Fri: '08:00 - 20:00', Sat: '09:00 - 18:00', Sun: '10:00 - 16:00',
};
const HOURS_LATE = {
  Mon: '10:00 - 19:00', Tue: '10:00 - 19:00', Wed: '10:00 - 19:00',
  Thu: '10:00 - 21:00', Fri: '10:00 - 19:00', Sat: '09:00 - 18:00', Sun: 'Closed',
};
const HOURS_WEEKENDS = {
  Mon: '09:00 - 17:30', Tue: '09:00 - 17:30', Wed: '09:00 - 17:30',
  Thu: '09:00 - 19:00', Fri: '09:00 - 17:30', Sat: '09:00 - 17:00', Sun: '11:00 - 16:00',
};

const HOURS_OPTIONS = [HOURS_STANDARD, HOURS_EXTENDED, HOURS_LATE, HOURS_WEEKENDS];

// ── Place definitions ───────────────────────────────────────

const PLACE_DEFS = [
  // Beauty Salons
  {
    name: 'Glow & Co Beauty Studio', category: 'beauty_salon',
    address: '42 George Street', area: 'New Town', city: 'Edinburgh', postcode: 'EH2 2LE',
    lat: 55.9537, lng: -3.2010, priceRange: '££',
    description: 'A contemporary beauty studio in the heart of Edinburgh\'s New Town, offering premium treatments in a luxurious setting. Our expert therapists deliver bespoke beauty experiences tailored to your needs.',
  },
  {
    name: 'The Beauty Room', category: 'beauty_salon',
    address: '18 Bruntsfield Place', area: 'Bruntsfield', city: 'Edinburgh', postcode: 'EH10 4HN',
    lat: 55.9385, lng: -3.2045, priceRange: '£',
    description: 'A welcoming neighbourhood beauty salon in charming Bruntsfield. We pride ourselves on affordable luxury, making professional beauty treatments accessible to everyone.',
  },
  {
    name: 'Radiance Beauty Bar', category: 'beauty_salon',
    address: '7 Raeburn Place', area: 'Stockbridge', city: 'Edinburgh', postcode: 'EH4 1HU',
    lat: 55.9592, lng: -3.2105, priceRange: '££',
    description: 'Stockbridge\'s premier beauty destination. From stunning lash work to rejuvenating facials, our talented team helps you look and feel your absolute best.',
  },
  {
    name: 'Polished Beauty Lounge', category: 'beauty_salon',
    address: '124 Morningside Road', area: 'Morningside', city: 'Edinburgh', postcode: 'EH10 4BX',
    lat: 55.9268, lng: -3.2098, priceRange: '££',
    description: 'An elegant beauty lounge nestled in Morningside, blending modern techniques with classic beauty traditions. A favourite with locals for special occasion prep.',
  },
  {
    name: 'Bloom Beauty Collective', category: 'beauty_salon',
    address: '55 The Shore', area: 'Leith', city: 'Edinburgh', postcode: 'EH6 6QW',
    lat: 55.9740, lng: -3.1710, priceRange: '£',
    description: 'A vibrant collective of independent beauty professionals working from a stunning waterside location in Leith. Fresh, creative, and always on trend.',
  },

  // Barber Shops
  {
    name: 'The Gentleman\'s Quarter', category: 'barber',
    address: '15 Cockburn Street', area: 'Old Town', city: 'Edinburgh', postcode: 'EH1 1BP',
    lat: 55.9502, lng: -3.1882, priceRange: '££',
    description: 'A traditional barbershop with a modern twist, tucked away on one of Edinburgh\'s most iconic streets. Whisky on the shelf, precision in every cut.',
  },
  {
    name: 'Sharp & Fade', category: 'barber',
    address: '34 Dalry Road', area: 'Haymarket', city: 'Edinburgh', postcode: 'EH11 2AU',
    lat: 55.9438, lng: -3.2228, priceRange: '£',
    description: 'The go-to spot for flawless fades and sharp lineups. A relaxed, no-nonsense barbershop where quality speaks for itself.',
  },
  {
    name: 'Rogue Barber Co', category: 'barber',
    address: '201 Leith Walk', area: 'Leith', city: 'Edinburgh', postcode: 'EH6 8NX',
    lat: 55.9640, lng: -3.1752, priceRange: '£',
    description: 'An independent barbershop on Leith Walk with serious swagger. Known for creative cuts, friendly banter, and a killer playlist.',
  },
  {
    name: 'The Cutting Room', category: 'barber',
    address: '8 Home Street', area: 'Tollcross', city: 'Edinburgh', postcode: 'EH3 9LZ',
    lat: 55.9432, lng: -3.2005, priceRange: '££',
    description: 'A stylish Tollcross barbershop combining classic barbering skills with contemporary styling. Walk-ins welcome, but booking is recommended.',
  },

  // Hair Salons
  {
    name: 'Mane Street Hair', category: 'hair_salon',
    address: '78 George Street', area: 'New Town', city: 'Edinburgh', postcode: 'EH2 3BU',
    lat: 55.9541, lng: -3.2035, priceRange: '£££',
    description: 'An award-winning salon on George Street known for transformative colour work and precision cutting. Home to some of Edinburgh\'s most sought-after stylists.',
  },
  {
    name: 'Tress Hair Studio', category: 'hair_salon',
    address: '45 Marchmont Road', area: 'Marchmont', city: 'Edinburgh', postcode: 'EH9 1HT',
    lat: 55.9358, lng: -3.1922, priceRange: '££',
    description: 'A friendly neighbourhood salon in Marchmont with a loyal following. Specialising in balayage, lived-in colour, and effortless styling.',
  },
  {
    name: 'Halo Hair Design', category: 'hair_salon',
    address: '92 Portobello High Street', area: 'Portobello', city: 'Edinburgh', postcode: 'EH15 1AN',
    lat: 55.9528, lng: -3.1148, priceRange: '££',
    description: 'A bright, seaside salon in Portobello bringing top-tier hair artistry to the east of the city. Creative colour specialists with a passion for sustainable beauty.',
  },
  {
    name: 'The Hair Lab', category: 'hair_salon',
    address: '3 St Stephen Street', area: 'Stockbridge', city: 'Edinburgh', postcode: 'EH3 5AB',
    lat: 55.9578, lng: -3.2068, priceRange: '££',
    description: 'An innovative Stockbridge salon where hair science meets artistry. Using the latest techniques and premium products for outstanding results.',
  },

  // Spas
  {
    name: 'Serenity Spa Edinburgh', category: 'spa',
    address: '25 Queen Street', area: 'New Town', city: 'Edinburgh', postcode: 'EH2 1JX',
    lat: 55.9560, lng: -3.1960, priceRange: '£££',
    description: 'Edinburgh\'s most luxurious urban spa experience. Set in a beautiful Georgian townhouse, offering world-class treatments in an oasis of calm.',
  },
  {
    name: 'Calm Waters Day Spa', category: 'spa',
    address: '4 Belford Road', area: 'Dean Village', city: 'Edinburgh', postcode: 'EH4 3BL',
    lat: 55.9518, lng: -3.2182, priceRange: '£££',
    description: 'A tranquil escape beside the Water of Leith in historic Dean Village. Our signature treatments draw on Scottish botanicals and ancient wellness traditions.',
  },
  {
    name: 'The Zen Room', category: 'spa',
    address: '29 Viewforth', area: 'Bruntsfield', city: 'Edinburgh', postcode: 'EH10 4JD',
    lat: 55.9375, lng: -3.2020, priceRange: '££',
    description: 'A modern wellness space in Bruntsfield focused on holistic wellbeing. From hot stone therapy to aromatherapy, find your balance here.',
  },

  // Nail Studios
  {
    name: 'Nailed It Studio', category: 'nail_studio',
    address: '31 Rose Street', area: 'New Town', city: 'Edinburgh', postcode: 'EH2 2NH',
    lat: 55.9530, lng: -3.1995, priceRange: '££',
    description: 'Edinburgh\'s favourite nail bar, right in the centre of town. Known for intricate nail art, flawless gel work, and a fun, lively atmosphere.',
  },
  {
    name: 'The Nail Artistry', category: 'nail_studio',
    address: '67 Constitution Street', area: 'Leith', city: 'Edinburgh', postcode: 'EH6 7AF',
    lat: 55.9725, lng: -3.1685, priceRange: '£',
    description: 'Creative nail artistry in the heart of Leith. From minimalist chic to full-on glam, our technicians bring your nail vision to life.',
  },
  {
    name: 'Lacquer & Co', category: 'nail_studio',
    address: '156 Morningside Road', area: 'Morningside', city: 'Edinburgh', postcode: 'EH10 4BX',
    lat: 55.9255, lng: -3.2112, priceRange: '££',
    description: 'A chic nail studio in Morningside offering premium manicures, pedicures, and bespoke nail art. The perfect spot for a pampering session.',
  },

  // Dental
  {
    name: 'Edinburgh Dental Care', category: 'dental',
    address: '50 Frederick Street', area: 'New Town', city: 'Edinburgh', postcode: 'EH2 1EX',
    lat: 55.9545, lng: -3.1975, priceRange: '£££',
    description: 'A modern, patient-focused dental practice in the heart of Edinburgh. Advanced technology, gentle care, and a commitment to beautiful, healthy smiles.',
  },
  {
    name: 'Smile Clinic Edinburgh', category: 'dental',
    address: '22 Earl Grey Street', area: 'Tollcross', city: 'Edinburgh', postcode: 'EH3 9BN',
    lat: 55.9440, lng: -3.2042, priceRange: '££',
    description: 'Friendly, affordable dental care in Tollcross. From routine check-ups to cosmetic treatments, we help Edinburgh smile with confidence.',
  },
  {
    name: 'Castle Dental Practice', category: 'dental',
    address: '112 High Street', area: 'Old Town', city: 'Edinburgh', postcode: 'EH1 1SG',
    lat: 55.9505, lng: -3.1905, priceRange: '££',
    description: 'Established dental practice on the Royal Mile combining traditional values with modern dentistry. NHS and private patients welcome.',
  },

  // Tattoo Studios
  {
    name: 'Inkwell Tattoo Studio', category: 'tattoo',
    address: '9 Grassmarket', area: 'Old Town', city: 'Edinburgh', postcode: 'EH1 2HS',
    lat: 55.9478, lng: -3.1938, priceRange: '££',
    description: 'A respected tattoo studio in the atmospheric Grassmarket. Our artists specialise in a range of styles from fine line to traditional Japanese.',
  },
  {
    name: 'Black Rose Tattoo', category: 'tattoo',
    address: '183 Leith Walk', area: 'Leith Walk', city: 'Edinburgh', postcode: 'EH6 8NX',
    lat: 55.9625, lng: -3.1765, priceRange: '£',
    description: 'Bold, creative tattooing on Leith Walk. Known for neo-traditional work, blackwork, and a welcoming studio vibe. Walk-in flash days every Saturday.',
  },

  // Physiotherapy
  {
    name: 'Active Recovery Physio', category: 'physio',
    address: '14 Morrison Street', area: 'Haymarket', city: 'Edinburgh', postcode: 'EH3 8BJ',
    lat: 55.9468, lng: -3.2155, priceRange: '££',
    description: 'Expert physiotherapy in Haymarket helping you move better and live pain-free. Trusted by athletes and weekend warriors across Edinburgh.',
  },
  {
    name: 'Edinburgh Sports Physio', category: 'physio',
    address: '6 Corstorphine Road', area: 'Murrayfield', city: 'Edinburgh', postcode: 'EH12 6HN',
    lat: 55.9442, lng: -3.2585, priceRange: '££',
    description: 'Specialist sports physiotherapy near Murrayfield Stadium. From ACL rehab to marathon training support, we keep Edinburgh active.',
  },

  // Massage Therapy
  {
    name: 'Knots Away Massage', category: 'massage',
    address: '12 Comely Bank Road', area: 'Stockbridge', city: 'Edinburgh', postcode: 'EH4 1DT',
    lat: 55.9608, lng: -3.2190, priceRange: '££',
    description: 'Therapeutic massage in peaceful Comely Bank. Specialising in deep tissue and sports massage to melt away tension and restore your body.',
  },
  {
    name: 'Deep Relief Therapy', category: 'massage',
    address: '88 Marchmont Crescent', area: 'Marchmont', city: 'Edinburgh', postcode: 'EH9 1HG',
    lat: 55.9345, lng: -3.1935, priceRange: '£',
    description: 'Affordable, professional massage therapy in Marchmont. Whether it\'s stress relief or injury recovery, our experienced therapists have you covered.',
  },
  {
    name: 'The Massage Studio', category: 'massage',
    address: '21 Brandon Terrace', area: 'Canonmills', city: 'Edinburgh', postcode: 'EH3 5EA',
    lat: 55.9612, lng: -3.2008, priceRange: '££',
    description: 'A calm, minimalist studio in Canonmills dedicated entirely to the art of massage. Multiple modalities available from Thai to lymphatic drainage.',
  },

  // Pet Grooming
  {
    name: 'Paws & Claws Grooming', category: 'pet_grooming',
    address: '77 St John\'s Road', area: 'Corstorphine', city: 'Edinburgh', postcode: 'EH12 7QA',
    lat: 55.9418, lng: -3.2832, priceRange: '££',
    description: 'Professional pet grooming in Corstorphine, treating every pet like royalty. From breed-specific trims to pamper packages, your furry friend is in safe hands.',
  },
  {
    name: 'The Pampered Pooch', category: 'pet_grooming',
    address: '14 Bath Street', area: 'Portobello', city: 'Edinburgh', postcode: 'EH15 1EY',
    lat: 55.9535, lng: -3.1158, priceRange: '£',
    description: 'A friendly seaside dog grooming salon in Portobello. We take the time to make every dog feel comfortable and leave looking fabulous.',
  },

  // Glasgow
  {
    name: 'West End Beauty Bar', category: 'beauty_salon',
    address: '28 Byres Road', area: 'West End', city: 'Glasgow', postcode: 'G12 8AP',
    lat: 55.8724, lng: -4.2920, priceRange: '££',
    description: 'A trendy beauty bar in Glasgow\'s vibrant West End. Instagram-worthy results with a team that stays ahead of every beauty trend.',
  },
  {
    name: 'Glasgow Grooming Co', category: 'barber',
    address: '15 Mitchell Lane', area: 'City Centre', city: 'Glasgow', postcode: 'G1 3NU',
    lat: 55.8600, lng: -4.2540, priceRange: '££',
    description: 'A premium barbershop in Glasgow city centre. Slick interiors, expert barbers, and a complimentary beer with every cut.',
  },

  // Stirling
  {
    name: 'Castle View Spa', category: 'spa',
    address: '8 King Street', area: 'City Centre', city: 'Stirling', postcode: 'FK8 1AY',
    lat: 55.9480, lng: -3.9370, priceRange: '££',
    description: 'A boutique spa with stunning views towards Stirling Castle. Scottish-inspired treatments using locally sourced ingredients for a truly unique experience.',
  },

  // More Edinburgh places to bulk up the data
  {
    name: 'Brow Bar Edinburgh', category: 'beauty_salon',
    address: '5 Hanover Street', area: 'New Town', city: 'Edinburgh', postcode: 'EH2 2DL',
    lat: 55.9548, lng: -3.1940, priceRange: '£',
    description: 'Specialist brow and lash studio on Hanover Street. Threading, tinting, lamination and more, all done to perfection.',
  },
  {
    name: 'Sapphire Hair & Beauty', category: 'hair_salon',
    address: '61 Lothian Road', area: 'West End', city: 'Edinburgh', postcode: 'EH3 9AZ',
    lat: 55.9465, lng: -3.2068, priceRange: '££',
    description: 'A sleek salon on Lothian Road offering both hair and beauty services under one roof. Perfect for a complete transformation.',
  },
  {
    name: 'Old Town Tattoo Parlour', category: 'tattoo',
    address: '28 Victoria Street', area: 'Old Town', city: 'Edinburgh', postcode: 'EH1 2JW',
    lat: 55.9488, lng: -3.1935, priceRange: '££',
    description: 'Iconic tattoo parlour on colourful Victoria Street. Three decades of experience and a portfolio that speaks for itself.',
  },
  {
    name: 'Inverleith Wellness Centre', category: 'physio',
    address: '33 Inverleith Row', area: 'Inverleith', city: 'Edinburgh', postcode: 'EH3 5QH',
    lat: 55.9648, lng: -3.2095, priceRange: '£££',
    description: 'A multidisciplinary wellness centre near the Botanic Gardens. Physiotherapy, osteopathy, and rehabilitation in a beautiful setting.',
  },
  {
    name: 'Corstorphine Dental Surgery', category: 'dental',
    address: '95 St John\'s Road', area: 'Corstorphine', city: 'Edinburgh', postcode: 'EH12 7QA',
    lat: 55.9420, lng: -3.2810, priceRange: '££',
    description: 'A family-friendly dental practice serving Corstorphine and the west of Edinburgh. Gentle, thorough, and always running on time.',
  },
];

// ── Generators ──────────────────────────────────────────────

function generateStaff(category, count) {
  const roles = STAFF_ROLES[category] || STAFF_ROLES.beauty_salon;
  const staff = [];
  const usedNames = new Set();
  for (let i = 0; i < count; i++) {
    let first, last;
    do {
      first = pick(FIRST_NAMES);
      last = pick(LAST_NAMES);
    } while (usedNames.has(`${first}${last}`));
    usedNames.add(`${first}${last}`);
    const role = roles[Math.min(i, roles.length - 1)];
    const hue = Math.floor(rand() * 360);
    staff.push({
      id: `staff_${first.toLowerCase()}_${last.toLowerCase()}`,
      name: `${first} ${last}`,
      role,
      avatar: `hsl(${hue}, 60%, 75%)`,
      avatarInitials: `${first[0]}${last[0]}`,
    });
  }
  return staff;
}

function generateReviews(count) {
  const reviews = [];
  const usedNames = new Set();
  for (let i = 0; i < count; i++) {
    let name;
    do { name = pick(REVIEWER_NAMES); } while (usedNames.has(name) && usedNames.size < REVIEWER_NAMES.length);
    usedNames.add(name);
    const isPositive = rand() > 0.2;
    const rating = isPositive ? (rand() > 0.3 ? 5 : 4) : (rand() > 0.5 ? 3 : 4);
    const commentPool = isPositive ? REVIEW_COMMENTS.slice(0, 20) : REVIEW_COMMENTS.slice(20);
    const daysAgo = randBetween(1, 365);
    const date = new Date(2026, 3, 5);
    date.setDate(date.getDate() - daysAgo);
    reviews.push({
      id: `rev_${i}_${Date.now()}`,
      author: name,
      rating,
      text: pick(commentPool),
      date: date.toISOString().split('T')[0],
    });
  }
  return reviews.sort((a, b) => b.date.localeCompare(a.date));
}

function generateServices(category) {
  const templates = SERVICE_TEMPLATES[category] || SERVICE_TEMPLATES.beauty_salon;
  const count = randBetween(5, templates.length);
  const selected = pickN(templates, count);
  return selected.map((t, i) => ({
    id: `svc_${category}_${i}`,
    name: t.name,
    duration: t.duration,
    price: varyPrice(t.basePrice),
    description: t.desc,
  }));
}

function generatePlace(def, index) {
  const cat = getCategoryById(def.category);
  const staffCount = randBetween(3, 6);
  const reviewCount = randBetween(15, 180);
  const rating = (3.5 + rand() * 1.5).toFixed(1);
  const hours = pick(HOURS_OPTIONS);
  const hue1 = cat.gradient[0];
  const hue2 = cat.gradient[1];

  return {
    id: `place_${index}`,
    ...def,
    rating: parseFloat(rating),
    reviewCount,
    phone: `0${randBetween(131, 141)} ${randBetween(200, 999)} ${randBetween(1000, 9999)}`,
    openingHours: hours,
    gradient: `linear-gradient(135deg, ${hue1}, ${hue2})`,
    categoryInfo: cat,
    services: generateServices(def.category),
    staff: generateStaff(def.category, staffCount),
    reviews: generateReviews(Math.min(reviewCount, 12)),
  };
}

// ── Export ───────────────────────────────────────────────────

export const places = PLACE_DEFS.map((def, i) => generatePlace(def, i));

export function getPlaceById(id) {
  return places.find((p) => p.id === id);
}

export function getPlacesByCategory(categoryId) {
  return places.filter((p) => p.category === categoryId);
}

export function searchPlaces(query) {
  const q = query.toLowerCase();
  return places.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.area.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.category.replace('_', ' ').includes(q) ||
      p.categoryInfo.name.toLowerCase().includes(q)
  );
}

export function getPopularPlaces(count = 8) {
  return [...places].sort((a, b) => b.rating - a.rating).slice(0, count);
}

export function getNearbyPlaces(lat, lng, count = 10) {
  return [...places]
    .map((p) => ({
      ...p,
      distance: Math.sqrt((p.lat - lat) ** 2 + (p.lng - lng) ** 2),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count);
}

export function generateTimeSlots(date, openingHours) {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const d = new Date(date);
  const dayName = dayNames[d.getDay()];
  const hours = openingHours[dayName];
  if (!hours || hours === 'Closed') return [];

  const [open, close] = hours.split(' - ');
  const [openH, openM] = open.split(':').map(Number);
  const [closeH, closeM] = close.split(':').map(Number);

  const slots = [];
  let h = openH, m = openM;
  while (h < closeH || (h === closeH && m < closeM)) {
    const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    // Use a deterministic "taken" pattern based on date + time
    const hash = (d.getDate() * 60 + h * 60 + m) % 7;
    slots.push({ time, available: hash !== 0 && hash !== 3 });
    m += 30;
    if (m >= 60) { h++; m = 0; }
  }
  return slots;
}
