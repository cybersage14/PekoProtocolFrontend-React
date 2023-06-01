/**
 * Convert wallet address to be visible
 * @param walletAddress 0x5da095266ec7ec1d979f01a9d7e4ee902e0182bc
 * @param numberOfFirstLetters 6
 * @param numberOfLastLetters 4
 * @returns 0x5da0...82bc
 */
export const getVisibleWalletAddress = (
  walletAddress: string,
  numberOfFirstLetters: number = 6,
  numberOfLastLetters: number = 4
): string => {
  if (walletAddress.length <= 10) {
    return walletAddress;
  }
  return `${walletAddress.slice(
    0,
    numberOfFirstLetters
  )}...${walletAddress.slice(0 - numberOfLastLetters)}`;
};
