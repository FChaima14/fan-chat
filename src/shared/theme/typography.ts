export const typography = {
  body: { fontSize: 15, lineHeight: 20 },
  bodyBold: { fontSize: 15, lineHeight: 20, fontWeight: '600' as const },
  caption: { fontSize: 12, lineHeight: 16 },
  title: { fontSize: 24, lineHeight: 26, fontWeight: '700' as const },
} as const;

export type TypographyToken = keyof typeof typography;
