export const colors = {
  white: '#FFFFFF',
  turquoise: '#8CBEBF',
  coral: '#E5765C',
  teal: '#344C4B',
  spring: '#DFE0C3',
  cream: '#F5F5F0',
  marine: '#5A8282',
} as const

export type ColorName = keyof typeof colors
