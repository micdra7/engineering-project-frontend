export interface Link {
  to: string;
  text: string;
  key: string;
}

export const publicLinks: Link[] = [
  { to: '/', text: 'Home', key: 'publicHomeKey' },
  { to: '/sign-up', text: 'Log In / Register', key: 'publicLoginKey' },
];

export const userLinks: Link[] = [
  { to: '/', text: 'Home', key: 'userHomeKey' },
  { to: '/profile', text: 'Profile', key: 'userProfileKey' },
  { to: '/calls', text: 'Calls', key: 'userCallsKey' },
  { to: '/tasks', text: 'Tasks', key: 'userTasksKey' },
  { to: '/chats', text: 'Chats', key: 'userChatsKey' },
  { to: '/results', text: 'Game results', key: 'userResultsKey' },
];

export const adminLinks: Link[] = [
  { to: '/users', text: 'Users', key: 'adminsUsersKey' },
  { to: '/games', text: 'Games', key: 'adminGamesKey' },
];
