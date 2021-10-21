import { WideContentPage } from 'components';
import React from 'react';
import { RemoteComponent } from '@paciolan/remote-component';

const url = 'http://localhost:5000/test.js';

const MyComponent = () => <RemoteComponent url={url} />;

const Dashboard = (): JSX.Element => (
  <WideContentPage title="Dashboard">
    <span>Dashboard</span>
    <MyComponent />
  </WideContentPage>
);

export default Dashboard;
