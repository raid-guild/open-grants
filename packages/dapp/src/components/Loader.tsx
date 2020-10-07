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

export const Loader: React.FC<Props> = () => {
  return <Lottie options={defaultOptions} height={177} width={201} />;
};
