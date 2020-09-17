export const formatValue = (number: BigInt): string => {
  const etherValue = number / BigInt(10 ** 18);
  return etherValue.toString();
};
