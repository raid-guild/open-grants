import { Link } from '@chakra-ui/core';
import NextLink, { LinkProps } from 'next/link';
import React from 'react';

type Props = Omit<React.ComponentProps<typeof Link>, keyof LinkProps> &
  LinkProps;

export const MetaLink: React.FC<Props> = ({
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
      <Link color="cyan.400" isExternal href={href} {...props}>
        {children}
      </Link>
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
      <Link color="cyan.400" {...props}>
        {children}
      </Link>
    </NextLink>
  );
};
