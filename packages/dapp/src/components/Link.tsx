import {
  Box,
  Button as ChakraButton,
  Link as ChakraLink,
} from '@chakra-ui/core';
import React from 'react';
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom';

type LinkButtonProps = React.ComponentProps<typeof ChakraButton> &
  RouterLinkProps;

export const LinkButton: React.FC<LinkButtonProps> = ({
  children,
  to,
  replace,
  ...props
}) => {
  return (
    <RouterLink to={to} replace={replace}>
      <ChakraButton {...props}>{children}</ChakraButton>
    </RouterLink>
  );
};

type LinkProps = Omit<
  React.ComponentProps<typeof ChakraLink>,
  keyof RouterLinkProps
> &
  RouterLinkProps;

export const Link: React.FC<LinkProps & LinkButtonProps> = ({
  children,
  to,
  replace,
  isExternal,
  ...props
}) => {
  if (isExternal) {
    return (
      <ChakraLink isExternal href={to.toString()} {...props}>
        {children}
      </ChakraLink>
    );
  }
  const { width, w } = props;

  return (
    <Box width={width || w}>
      <RouterLink to={to} replace={replace}>
        <ChakraButton
          variant="link"
          fontWeight="normal"
          color="currentColor"
          justifyContent={width || w ? 'flex-start' : 'center'}
          {...props}
        >
          {children}
        </ChakraButton>
      </RouterLink>
    </Box>
  );
};
