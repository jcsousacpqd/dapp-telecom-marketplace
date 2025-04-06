import { ethers } from 'ethers';
import AssetsABI from '@/contracts/AssetsContract.json';

export const getContract = (address: string, abi: any, signerOrProvider: any) => {
  return new ethers.Contract(address, abi, signerOrProvider);
};
