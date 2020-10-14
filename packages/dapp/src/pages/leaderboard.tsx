import { VStack } from '@chakra-ui/core';
import { Leaderboard } from 'components/Leaderboard';
import React from 'react';

const LeaderboardPage: React.FC = () => (
  <VStack w="100%" pt="5rem">
    <Leaderboard />
  </VStack>
);

export default LeaderboardPage;
