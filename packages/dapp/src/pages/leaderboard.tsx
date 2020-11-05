import { Flex, VStack } from '@chakra-ui/core';
import HeaderBG from 'assets/header.jpg';
import { Leaderboard } from 'components/Leaderboard';
import React from 'react';

const LeaderboardPage: React.FC = () => (
  <VStack w="100%">
    <Flex bgSize="cover" bgImage={`url(${HeaderBG})`} h="5rem" w="100%" />
    <Leaderboard />
  </VStack>
);

export default LeaderboardPage;
