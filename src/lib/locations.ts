// src/lib/locations.ts
// Predefined service areas for HandyPro — Phnom Penh & Kandal Province

export const PHNOM_PENH_DISTRICTS = [
  'Khan Daun Penh',
  'Khan 7 Makara',
  'Khan Tuol Kouk',
  'Khan Boeng Keng Kang',
  'Khan Chamkar Mon',
  'Khan Por Sen Chey',
  'Khan Sen Sok',
  'Khan Russey Keo',
  'Khan Prek Pnov',
  'Khan Chroy Changvar',
  'Khan Pur Senchey',
  'Khan Meanchey',
  'Khan Dangkao',
  'Khan Kamboul',
]

export const KANDAL_DISTRICTS = [
  'Takhmao',
  'Koh Thom',
  'Leuk Daek',
  'Lvea Em',
  'Mukh Kampul',
  'Kien Svay',
  'Ponhea Leu',
  'Khsach Kandal',
  'S\'ang',
  'Ang Snuol',
]

export const ALL_LOCATIONS: { group: string; areas: string[] }[] = [
  { group: 'Phnom Penh', areas: PHNOM_PENH_DISTRICTS },
  { group: 'Kandal Province', areas: KANDAL_DISTRICTS },
]

// Flat list for simple selects
export const LOCATION_LIST = [
  ...PHNOM_PENH_DISTRICTS,
  ...KANDAL_DISTRICTS,
]