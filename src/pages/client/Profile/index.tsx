import { Flex, Text } from '@chakra-ui/react';
import { Loader, WideContentPage } from 'components';
import React from 'react';
import { useMutation, useQuery } from 'react-query';
import { API } from 'services/api';
import { useLogger } from 'services/toast';
import ProfileForm from './components/ProfileForm';

const Profile = (): JSX.Element => {
  const logger = useLogger();

  const {
    isLoading: profileLoading,
    data: profile,
    refetch: refetchUser,
  } = useQuery('/users/current/profile', () =>
    API.get('/users/current/profile'),
  );
  const mutation = useMutation(data =>
    API.patch('/users/current/profile', data),
  );

  const onSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);

    try {
      await mutation.mutateAsync(values);

      logger.success({
        title: 'Success',
        description: 'Changes saved successfully',
      });
      refetchUser();
    } catch (error) {
      logger.error({
        title: 'Error',
        description: error?.response?.data?.message ?? 'Something went wrong',
      });
    }

    setSubmitting(false);
  };

  return (
    <WideContentPage title="Profile">
      <Flex color="cyan.900" flexFlow="row wrap">
        <Text mb={6}>Review and update your information</Text>

        {profileLoading ? (
          <Loader />
        ) : (
          <ProfileForm
            initialFormValues={{ ...profile?.data, password: '' }}
            onSubmit={onSubmit}
          />
        )}
      </Flex>
    </WideContentPage>
  );
};

export default Profile;
