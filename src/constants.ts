import type { NodeTemplate } from './types';

export const NODE_TEMPLATES: NodeTemplate[] = [
  {
    type: 'sales',
    label: 'Sales Page',
    icon: '🛍️',
    description: 'Landing page to capture interest',
    color: 'bg-blue-500',
  },
  {
    type: 'order',
    label: 'Order Page',
    icon: '🛒',
    description: 'Main checkout page',
    color: 'bg-green-500',
  },
  {
    type: 'upsell',
    label: 'Upsell',
    icon: '⬆️',
    description: 'Additional offer after purchase',
    color: 'bg-purple-500',
  },
  {
    type: 'downsell',
    label: 'Downsell',
    icon: '⬇️',
    description: 'Alternative lower-priced offer',
    color: 'bg-orange-500',
  },
  {
    type: 'thankyou',
    label: 'Thank You',
    icon: '✅',
    description: 'Final confirmation page',
    color: 'bg-pink-500',
  },
];

export const STORAGE_KEY = 'funnel-builder-state';
