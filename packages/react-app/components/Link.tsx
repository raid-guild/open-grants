import { Link as ChakraLink } from '@chakra-ui/core';
import NextLink, { LinkProps } from 'next/link';
import React from 'react';

type Props = Omit<React.ComponentProps<typeof ChakraLink>, keyof LinkProps> &
  LinkProps;

export const Link: React.FC<Props> = ({
  children,
  href,
  as,
  passHref,
  prefetch,
  replace,
  scroll,
  shallow,
  isExternal,
  ...props
}) => {
  if (isExternal && typeof href === 'string') {
    return (
      <ChakraLink isExternal href={href} {...props}>
        {children}
      </ChakraLink>
    );
  }

  return (
    <NextLink
      href={href}
      as={as}
      passHref={passHref || true}
      prefetch={prefetch}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
    >
      {/*  NextLink passes the href */}
      <ChakraLink {...props}>
        {children}
      </ChakraLink>
    </NextLink>
  );
};
