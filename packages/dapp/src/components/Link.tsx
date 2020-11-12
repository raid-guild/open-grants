import {
  Box,
  Button as ChakraButton,
  Link as ChakraLink,
} from '@chakra-ui/core';
import React from 'react';
import {   Link as RouterLink,
  LinkProps as RouterLinkProps,
useHistory ,
} from 'react-router-dom';


type LinkProps = React.ComponentProps<typeof ChakraButton> &
  Omit<React.ComponentProps<typeof ChakraLink>, keyof RouterLinkProps> &
  RouterLinkProps;

export const LinkButton: React.FC<LinkProps> = ({
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

export const Link: React.FC<LinkProps> = ({
  children,
  to,
  isExternal,
  ...props
}) => {
  const history = useHistory();
  if (isExternal) {
    return (
      <ChakraLink isExternal href={to.toString()} {...props}>
        {children}
      </ChakraLink>
    );
  }
  const { width, w } = props;

  return (
    <>
      {width || w ? (
        <Box width={width || w}>
          <ChakraLink {...props} onClick={() => history.push(to as string)}>
            {children}
          </ChakraLink>
        </Box>
      ) : (
        <ChakraLink {...props} onClick={() => history.push(to as string)}>
          {children}
        </ChakraLink>
      )}
    </>
  );
};
