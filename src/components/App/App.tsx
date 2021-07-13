import { Flex } from '@chakra-ui/react';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { SignUp } from '../../pages';
import { publicRoutes } from '../../resources/routes';
import { AuthContextProvider } from '../../store/auth';
import Navbar from '../organisms/Navbar';

const App = (): JSX.Element => (
  <Flex direction="row" wrap="wrap" justify="center">
    <Router>
      <AuthContextProvider>
        <Navbar />
        <Flex
          flexBasis="100%"
          justifyContent="center"
          mx="auto"
          py={3}
          px={[5, 5, 8]}>
          <Switch>
            <Route exact path={publicRoutes.HOME}>
              HOME
            </Route>
            <Route path={publicRoutes.SIGN_UP}>
              <SignUp />
            </Route>
          </Switch>
        </Flex>
      </AuthContextProvider>
    </Router>
  </Flex>
);

export default App;
