import { extendTheme } from '@chakra-ui/react';

const colors = {
  orange: {
    '50': '#FFECE5',
    '100': '#FFC9B8',
    '200': '#FFA68A',
    '300': '#FF845C',
    '400': '#FF612E',
    '500': '#FF3E00',
    '600': '#CC3200',
    '700': '#992500',
    '800': '#661900',
    '900': '#330C00',
  },
  cyan: {
    '50': '#ECF5F9',
    '100': '#C9E4ED',
    '200': '#A7D3E2',
    '300': '#85C2D6',
    '400': '#62B1CB',
    '500': '#409FBF',
    '600': '#338099',
    '700': '#266073',
    '800': '#19404D',
    '900': '#0D2026',
  },
  teal: {
    '50': '#E5FDFF',
    '100': '#B8F9FF',
    '200': '#8AF5FF',
    '300': '#5CF1FF',
    '400': '#2EEDFF',
    '500': '#00EAFF',
    '600': '#00BBCC',
    '700': '#008C99',
    '800': '#005D66',
    '900': '#002F33',
  },
  green: {
    '50': '#EEF7F6',
    '100': '#CEE8E5',
    '200': '#AFDAD5',
    '300': '#90CBC5',
    '400': '#71BCB4',
    '500': '#51AEA4',
    '600': '#418B83',
    '700': '#316862',
    '800': '#214542',
    '900': '#102321',
  },
};

const fonts = {
  heading: 'Lato',
  body: 'Questrial',
};

const styles = {
  global: {
    '.js-focus-visible :focus:not([data-focus-visible-added])': {
      outline: 'none',
      boxShadow: 'none',
    },
  },
};

const theme = extendTheme({ colors, fonts, styles });

export default theme;
