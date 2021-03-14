import { Flex, Text } from '@chakra-ui/react';
import React, { Component, ErrorInfo, ReactNode } from 'react';

type ErrorProps = {
  children: ReactNode;
};

type ErrorState = {
  error: Error | null | undefined;
};

const MISSING_ERROR = 'Error was swallowed during propagation.';

export class ErrorBoundary extends Component<ErrorProps, ErrorState> {
  constructor(props: ErrorProps) {
    super(props);
    this.state = {
      error: undefined,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorState {
    return { error };
  }

  componentDidCatch(error: Error | null, info: ErrorInfo): void {
    this.setState({ error: error || new Error(MISSING_ERROR) });
    console.error({ error, info });
  }

  render(): ReactNode {
    const { error } = this.state;
    const { children } = this.props;
    if (error) {
      return (
        <Flex
          justify="center"
          align="center"
          direction="column"
          w="100%"
          minH="100vh"
        >
          <Text fontSize="lg"> Something went wrong </Text>
          <Text> Please check console for error log </Text>
        </Flex>
      );
    }

    return children;
  }
}
