import chakraTheme, { Theme as ChakraTheme } from '@chakra-ui/theme';

interface MetaColors {
  background: string;
  text: string;
  dark: string;
  white60: string;
  white80: string;
  black10: string;
  black20: string;
  haze: string;
}

interface MetaTheme {
  colors: ChakraTheme['colors'] & MetaColors;
}

type Theme = ChakraTheme & MetaTheme;

export const theme: Theme = {
  ...chakraTheme,
  styles: {
    ...chakraTheme.styles,
    global: {
      ...chakraTheme.styles.global,
    },
  },
  radii: {
    ...chakraTheme.radii,
    none: '0',
    sm: '0.125rem',
    md: '0.25rem',
    lg: '0.5rem',
    full: '9999px',
  },
  sizes: {
    ...chakraTheme.sizes,
    container: {
      ...chakraTheme.sizes.container,
      xl: '85rem',
    },
  },
  colors: {
    ...chakraTheme.colors,
    cyan: {
      50: '#dffffe',
      100: '#b5fcf7',
      200: '#89faf9',
      300: '#5feff8',
      400: '#40e0f6',
      500: '#33bedd',
      600: '#248aac',
      700: '#155a7a',
      800: '#032e4a',
      900: '#000f1a',
    },
    green: {
      50: '#dcfef7',
      100: '#b7f5e7',
      200: '#8eedd7',
      300: '#63e5c7',
      400: '#3bdeb7',
      500: '#21c49d',
      600: '#14997a',
      700: '#076d57',
      800: '#004233',
      900: '#00180f',
    },
    gray: {
      50: '#e8f3ff',
      100: '#cfd7e4',
      200: '#b2bdcd',
      300: '#95a2b6',
      400: '#7888a0',
      500: '#5f6e87',
      600: '#49566a',
      700: '#343d4d',
      800: '#1d2531',
      900: '#070c18',
    },
    background: '#EEF0F4',
    text: '#5D6A74',
    dark: '#1A3344',
    white60: 'rgba(255, 255, 255, 0.6)',
    white80: 'rgba(255, 255, 255, 0.8)',
    black10: 'rgba(0, 0, 0, 0.1)',
    black20: 'rgba(0, 0, 0, 0.2)',
    haze: '#FBFBFC',
  },
  fonts: {
    ...chakraTheme.fonts,
    body: 'Poppins',
  },
};
