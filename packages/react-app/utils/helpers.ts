export const formatValue = (number: BigInt): string => {
  const etherValue = BigInt(number) / BigInt(10 ** 18);
  return etherValue.toString();
};
