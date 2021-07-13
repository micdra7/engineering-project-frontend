import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';
import App from './components/App/App';
import '@fontsource/lato/700.css';
import '@fontsource/questrial/400.css';
import theme from './resources/theme';
import 'focus-visible/dist/focus-visible';
import { AuthContextProvider } from './store/auth';

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
