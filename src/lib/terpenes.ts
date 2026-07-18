export type AnxietyImpact = 'helps' | 'may-worsen' | 'mixed';

export interface TerpeneInfo {
  name: string;
  aroma: string;
  foundIn: string;
  effects: string;
  anxiety: AnxietyImpact;
  anxietyNote: string;
}

export const TERPENES: TerpeneInfo[] = [
  {
    name: 'Myrcene',
    aroma: 'Earthy, musky, herbal',
    foundIn: 'Mango, hops, thyme, lemongrass',
    effects: 'Sedating, relaxing, promotes sleep, muscle relaxant',
    anxiety: 'helps',
    anxietyNote:
      'Deeply relaxing and sedative. Eases physical tension and calms the mind, which is why myrcene-heavy strains feel "couch-locked" and soothing.',
  },
  {
    name: 'Linalool',
    aroma: 'Floral, lavender',
    foundIn: 'Lavender, mint, cinnamon',
    effects: 'Calming, sedative, anti-anxiety, mood-balancing',
    anxiety: 'helps',
    anxietyNote:
      'One of the most calming terpenes. The same compound that makes lavender relaxing — studied for reducing anxiety and stress and improving sleep.',
  },
  {
    name: 'Limonene',
    aroma: 'Bright citrus',
    foundIn: 'Citrus rinds, juniper, peppermint',
    effects: 'Mood-elevating, stress relief, uplifting',
    anxiety: 'helps',
    anxietyNote:
      'Lifts mood and relieves stress; shows anxiolytic and antidepressant effects in research. Note: at high doses its uplifting energy can feel stimulating for some.',
  },
  {
    name: 'Caryophyllene',
    aroma: 'Peppery, spicy, woody',
    foundIn: 'Black pepper, cloves, cinnamon',
    effects: 'Stress relief, anti-inflammatory, calming',
    anxiety: 'helps',
    anxietyNote:
      'Unique among terpenes — it binds CB2 cannabinoid receptors directly. Studied for reducing anxiety and stress without sedation.',
  },
  {
    name: 'Bisabolol',
    aroma: 'Sweet, floral, chamomile',
    foundIn: 'Chamomile, candeia tree',
    effects: 'Soothing, calming, skin-healing, anti-inflammatory',
    anxiety: 'helps',
    anxietyNote:
      'Chamomile-derived and gently soothing — associated with calm and relaxation.',
  },
  {
    name: 'Nerolidol',
    aroma: 'Woody, citrus, floral',
    foundIn: 'Jasmine, tea tree, lemongrass',
    effects: 'Sedative, relaxing, promotes rest',
    anxiety: 'helps',
    anxietyNote: 'Sedative and relaxing; helps quiet the mind and promote calm.',
  },
  {
    name: 'Terpineol',
    aroma: 'Floral, lilac, pine',
    foundIn: 'Lilac, pine, lime blossoms',
    effects: 'Relaxing, sedative, soothing',
    anxiety: 'helps',
    anxietyNote: 'Relaxing and mildly sedative — often present in calming strains.',
  },
  {
    name: 'Pinene',
    aroma: 'Sharp pine, fresh forest',
    foundIn: 'Pine needles, rosemary, basil',
    effects: 'Alertness, focus, memory, bronchodilator',
    anxiety: 'may-worsen',
    anxietyNote:
      'Stimulating and alertness-boosting. Because it heightens arousal and energy, it can amplify anxiety in sensitive people or at high doses — though in small amounts it may actually counter THC-induced paranoia and support clear focus.',
  },
  {
    name: 'Terpinolene',
    aroma: 'Herbal, floral, piney',
    foundIn: 'Apples, cumin, lilac, nutmeg',
    effects: 'Uplifting, energizing (common in sativas)',
    anxiety: 'may-worsen',
    anxietyNote:
      'Tends to be uplifting and energizing. That stimulating, "racy" quality can heighten anxiety for some users, especially with high-THC sativas.',
  },
  {
    name: 'Ocimene',
    aroma: 'Sweet, herbal, woody',
    foundIn: 'Mint, parsley, basil, orchids',
    effects: 'Uplifting, energizing, decongestant',
    anxiety: 'may-worsen',
    anxietyNote:
      'An energizing, uplifting profile that can feel stimulating — potentially anxiety-provoking for those prone to it.',
  },
  {
    name: 'Valencene',
    aroma: 'Sweet citrus, orange',
    foundIn: 'Valencia oranges, grapefruit',
    effects: 'Uplifting, alertness, mood-brightening',
    anxiety: 'may-worsen',
    anxietyNote:
      'A bright, energizing citrus terpene. Its stimulating lift can be too activating for anxiety-prone users.',
  },
  {
    name: 'Humulene',
    aroma: 'Hoppy, earthy, woody',
    foundIn: 'Hops, coriander, cloves',
    effects: 'Grounding, appetite-suppressant, anti-inflammatory',
    anxiety: 'mixed',
    anxietyNote:
      'Generally grounding and earthy. Limited direct anxiety research — effects are subtle and depend on the overall blend.',
  },
  {
    name: 'Geraniol',
    aroma: 'Sweet, rose, floral',
    foundIn: 'Roses, geraniums, lemongrass',
    effects: 'Calming, neuroprotective, antioxidant',
    anxiety: 'mixed',
    anxietyNote:
      'A pleasant floral terpene with a calming reputation, though anxiety-specific evidence is limited.',
  },
];

export const anxietyMeta: Record<
  AnxietyImpact,
  { label: string; badge: string }
> = {
  helps: {
    label: 'May help anxiety',
    badge: 'bg-brand/15 text-brand border-brand/40',
  },
  'may-worsen': {
    label: 'May worsen anxiety',
    badge: 'bg-earth-red/15 text-earth-red border-earth-red/40',
  },
  mixed: {
    label: 'Mixed / limited data',
    badge: 'bg-surface2 text-muted border-line',
  },
};