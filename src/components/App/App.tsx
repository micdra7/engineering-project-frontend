import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { publicRoutes } from '../../resources/routes';
import Navbar from '../organisms/Navbar';

const App = (): JSX.Element => (
  <Flex direction="row" wrap="wrap" justify="center">
    <Router>
      <Navbar />
      <Box flexBasis="100%">
        <Switch>
          <Route exact path={publicRoutes.HOME}>
            HOME
          </Route>
          <Route path={publicRoutes.SIGN_UP}>LOGIN</Route>
        </Switch>
      </Box>
    </Router>
  </Flex>
);

export default App;
