import chakraTheme, { Theme as ChakraTheme } from '@chakra-ui/theme';

interface MetaColors {
    background: string;
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
        background: '#EAECEF',
        gray: {
            50: '#fafcff',
            100: '#e8f3ff',
            200: '#cfd7e4',
            300: '#b2bdcd',
            400: '#95a3b6',
            500: '#7888a0',
            600: '#5f6f87',
            700: '#49566a',
            800: '#343d4d',
            900: '#1d2531',
        },
    },
    fonts: {
        ...chakraTheme.fonts,
        body: 'Poppins',
    },
};
