import { WideContentPage } from 'components';
import React from 'react';
import FinishingTasks from './components/FinishingTasks';
import UpcomingCallsList from './components/UpcomingCallsList';

const Dashboard = (): JSX.Element => (
  <WideContentPage title="Dashboard">
    <span>View your upcoming calls and tasks with upcoming finish date</span>
    <UpcomingCallsList />
    <FinishingTasks />
  </WideContentPage>
);

export default Dashboard;
