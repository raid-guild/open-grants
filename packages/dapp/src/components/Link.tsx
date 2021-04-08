import {
  Box,
  Button as ChakraButton,
  Link as ChakraLink,
} from '@chakra-ui/react';
import React from 'react';
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom';

type LinkButtonProps = React.ComponentProps<typeof ChakraButton> &
  Omit<React.ComponentProps<typeof ChakraLink>, keyof RouterLinkProps> &
  RouterLinkProps;

export const LinkButton: React.FC<LinkButtonProps> = ({
  children,
  to,
  replace,
  isExternal,
  ...props
}) => {
  if (isExternal) {
    return (
      <ChakraLink
        isExternal
        href={to.toString()}
        _hover={{ textDecor: 'none' }}
      >
        <ChakraButton {...props}>{children}</ChakraButton>
      </ChakraLink>
    );
  }
  return (
    <RouterLink to={to} replace={replace}>
      <ChakraButton {...props}>{children}</ChakraButton>
    </RouterLink>
  );
};

type LinkProps = React.ComponentProps<typeof ChakraLink> & RouterLinkProps;

export const Link: React.FC<LinkProps> = ({
  children,
  to,
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
  const { width, w, replace } = props;

  return (
    <>
      {width || w ? (
        <Box width={width || w}>
          <RouterLink to={to} replace={replace}>
            <ChakraLink as="span" {...props}>
              {children}
            </ChakraLink>
          </RouterLink>
        </Box>
      ) : (
        <RouterLink to={to} replace={replace}>
          <ChakraLink as="span" {...props}>
            {children}
          </ChakraLink>
        </RouterLink>
      )}
    </>
  );
};
