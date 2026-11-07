import { UnprocessableEntityException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export interface SchoolTheme {
  /** Preset palette key from the web app, or "custom". */
  preset: string;
  /** Brand colour as #rrggbb; the web app derives the rest of the palette. */
  primary: string;
}

/**
 * Validates the theme sent from School Settings. Null resets the school to
 * the default Penlumen palette.
 */
export function parseTheme(value: unknown): SchoolTheme | typeof Prisma.DbNull {
  if (value === null || value === undefined || value === '')
    return Prisma.DbNull;
  const theme = value as Partial<SchoolTheme>;
  const preset =
    typeof theme.preset === 'string' ? theme.preset.trim().toLowerCase() : '';
  const primary =
    typeof theme.primary === 'string' ? theme.primary.trim().toLowerCase() : '';
  if (!/^[a-z0-9-]{1,30}$/.test(preset) || !/^#[0-9a-f]{6}$/.test(primary)) {
    throw new UnprocessableEntityException({
      status: 422,
      success: false,
      message: 'Theme needs a preset name and a colour like #003884',
    });
  }
  return { preset, primary };
}
