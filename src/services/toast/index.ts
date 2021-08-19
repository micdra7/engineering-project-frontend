import { ToastPosition, useToast } from '@chakra-ui/react';

type TLoggerParams = {
  description?: string;
  title?: string;
};

export const useLogger = () => {
  const toast = useToast();

  const toastProps = {
    duration: 5000,
    isClosable: true,
    position: 'bottom-right',
  };

  return {
    success: ({ description, title }: TLoggerParams) => {
      toast({
        ...toastProps,
        position: toastProps.position as ToastPosition,
        description,
        title,
        status: 'success',
      });
    },
    info: ({ description, title }: TLoggerParams) => {
      toast({
        ...toastProps,
        position: toastProps.position as ToastPosition,
        description,
        title,
        status: 'info',
      });
    },
    warning: ({ description, title }: TLoggerParams) => {
      toast({
        ...toastProps,
        position: toastProps.position as ToastPosition,
        description,
        title,
        status: 'warning',
      });
    },
    error: ({ description, title }: TLoggerParams) => {
      toast({
        ...toastProps,
        position: toastProps.position as ToastPosition,
        description,
        title,
        status: 'error',
      });
    },
  };
};
