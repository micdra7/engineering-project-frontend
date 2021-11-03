import React, { useEffect, useState } from 'react';
import {
  SimpleGrid,
  Heading,
  Flex,
  Button,
  useToast,
  Spinner,
  Text,
  Center,
} from '@chakra-ui/react';

type TQuestionProps = {
  question: string;
  answers: string[];
  onAnswerClick: (index: number) => void;
};

const Question = ({
  question,
  answers,
  onAnswerClick,
}: TQuestionProps): JSX.Element => (
  <SimpleGrid columns={1}>
    <Heading size="lg">{question}</Heading>
    {answers.map((answer, index) => (
      <Flex justify="center" key={answer} w="100%" mb={1}>
        <Button w="100%" onClick={() => onAnswerClick(index)}>
          {answer}
        </Button>
      </Flex>
    ))}
  </SimpleGrid>
);

type TQuizProps = {
  sendData: (data: string) => void;
  sendFinish: () => void;
  sendScore: (score: number) => void;
  name: string;
  gameDataEntries: string[];
  isFinished: boolean;
  currentData: string[];
  usersCount: number;
};

const Quiz = ({
  sendData,
  sendFinish,
  sendScore,
  name,
  gameDataEntries,
  isFinished,
  currentData,
  usersCount,
}: TQuizProps): JSX.Element => {
  const toast = useToast();
  const [isClientFinished, setClientFinished] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    if (isFinished) {
      sendScore(correctAnswersCount * 10);
      toast({
        duration: 5000,
        isClosable: true,
        position: 'bottom-right',
        title: 'Score',
        description: `Your score was ${correctAnswersCount * 10}`,
        status: 'info',
      });
    }
  }, [isFinished]);

  useEffect(() => {
    if (
      !!usersCount &&
      currentData?.length === usersCount &&
      isClientFinished
    ) {
      sendFinish();
    }
  }, [currentData, isClientFinished]);

  return (
    <Center
      bg="cyan.100"
      rounded="md"
      flexFlow="row wrap"
      minH="350px"
      p={4}
      m={2}>
      <Heading w="100%">{name}</Heading>
      {currentQuestionIndex === gameDataEntries?.length - 1 &&
      isClientFinished ? (
        <Center w="100%">
          <Spinner />
          <Text fontWeight="semibold">
            Please wait while other users finish their games
          </Text>
        </Center>
      ) : (
        gameDataEntries
          ?.filter((_, index) => index === currentQuestionIndex)
          ?.map(entry => {
            const object = JSON.parse(entry);

            return (
              <Question
                question={object.question}
                answers={object.answers}
                onAnswerClick={(index: number) => {
                  if (object.correctAnswerIndex === index) {
                    setCorrectAnswersCount(correctAnswersCount + 1);
                  }

                  if (currentQuestionIndex === gameDataEntries.length - 1) {
                    sendData(JSON.stringify({ finished: true }));
                    setClientFinished(true);
                  } else {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                  }
                }}
              />
            );
          })
      )}
    </Center>
  );
};

export default Quiz;
