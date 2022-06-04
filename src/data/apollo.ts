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

// locked LP Balance
export const getAstroportApolloLpBalance = async (height: number) => {
  try {
    const output: any = await contractQuery(
      'terra1627ldjvxatt54ydd3ns6xaxtd68a2vtyu7kakj',
      {
        user_info: {
          address: 'terra1hxrd8pnqytqpelape3aemprw3a023wryw7p0xn'
        }
      },
      height
    );
    return new BigNumber(output.lockup_infos[0].lp_units_locked).toNumber();
  } catch (error) {
    return 0;
  }
};

// get apollo lp share
export const getApolloLPTotalSupply = async (height: number) => {
  try {
    const output: any = await contractQuery(
      'terra1n3gt4k3vth0uppk0urche6m3geu9eqcyujt88q',
      {
        token_info: {}
      },
      height
    );
    return new BigNumber(output.total_supply || '0').toNumber();
  } catch (error) {
    return 0;
  }
};

// get apollo lp uusd amount
export const getApolloLpUusdAmount = async (height: number) => {
  try {
    const output: any = await contractQuery(
      'terra1xj2w7w8mx6m2nueczgsxy2gnmujwejjeu2xf78',
      {
        pool: {}
      },
      height
    );
    return new BigNumber(
      output.assets.find((a: any) => a.info.hasOwnProperty('native_token'))
        .amount || '0'
    )
      .times(2)
      .toNumber();
  } catch (error) {
    return 0;
  }
};

export const getApolloLPPrice = async (height: number) => {
  return new BigNumber(await getAstroportApolloLpBalance(height))
    .div(new BigNumber(await getApolloLPTotalSupply(height)))
    .toNumber();
};
