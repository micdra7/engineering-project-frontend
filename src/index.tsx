import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';
import App from './components/App/App';
import '@fontsource/lato/700.css';
import '@fontsource/questrial/400.css';
import theme from './resources/theme';
import 'focus-visible/dist/focus-visible';

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
