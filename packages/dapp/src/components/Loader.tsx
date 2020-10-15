import React from 'react';
import Lottie from 'react-lottie';

import whaleLoaderData from '../assets/whaleLoader__data.json';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: whaleLoaderData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

type Props = {
  size?: number;
};

export const Loader: React.FC<Props> = ({ size = 1 }) => {
  return (
    <Lottie options={defaultOptions} height={177 * size} width={201 * size} />
  );
};
