import React, { useEffect, useState } from 'react';
import {
  SimpleGrid,
  Heading,
  Flex,
  Button,
  useToast,
  Spinner,
  Text,
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
      <Flex justify="center" key={answer}>
        <Button onClick={() => onAnswerClick(index)}>{answer}</Button>
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
    <SimpleGrid columns={1}>
      <Heading>{name}</Heading>
      {currentQuestionIndex === gameDataEntries?.length - 1 &&
      isClientFinished ? (
        <SimpleGrid columns={1}>
          <Spinner />
          <Text>Please wait while other users finish their games</Text>
        </SimpleGrid>
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
    </SimpleGrid>
  );
};

export default Quiz;
