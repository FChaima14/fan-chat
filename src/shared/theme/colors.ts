export const colors = {
  background: '#ffff',
  surface: '#FFFFFF',
  border: '#D4D4D8',
  textPrimary: '#000000',
  textSecondary: '#6B6B75',
  primary: '#5863DE',
  success: '#1F9254',
  warning: '#B98900',
  danger: '#D3352B',
} as const;

export type ColorToken = keyof typeof colors;
