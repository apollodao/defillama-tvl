import BigNumber from 'bignumber.js';

import {
  getTokenBalance,
  getTokenValueFromStableLP,
  getLPTokenValue,
  getApolloVaultBalance,
  contractQuery
} from '../network';

// fetch Apollo balance
export const getApolloBalance = async (height: number) => {
  try {
    const output: any = await contractQuery(
      'terra100yeqvww74h4yaejj6h733thgcafdaukjtw397',
      {
        balance: {
          address: 'terra1hxrd8pnqytqpelape3aemprw3a023wryw7p0xn'
        }
      },
      height
    );
    return parseInt(output.balance);
  } catch (error) {
    return 0;
  }
};

// get Apollo value
export const getApolloPrice = async (height: number) => {
  try {
    const apollo_price = await getTokenValueFromStableLP(height, 'APOLLOUSTLP');
    return apollo_price;
  } catch (error) {
    return 0;
  }
};
