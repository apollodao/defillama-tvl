import { LCDClient } from '@terra-money/terra.js';
import { networks } from './networks';

const connectLcd = () => {
  return new LCDClient({
    chainID: 'columbus-5',
    URL: 'https://fcd.terra.dev'
  });
};

export const getTokenValue = async (
  height: number,
  token: string = '',
  network: string = 'classic'
) => {
  const token_info = networks[network].tokens.find(
    (t: any) => t.symbol === token
  );
  const { ust_pair_pool } = token_info;

  const ust_share = await getLPUSTShare(height, ust_pair_pool);
  const token_share = await getLPNonUSTShare(height, ust_pair_pool);

  return ust_share / token_share;
};

export const contractQuery = async (
  address: string,
  msg: any,
  height: number
) => {
  const lcd = connectLcd();
  try {
    const res = await lcd.wasm.contractQuery(address, msg, { height });
    return res;
  } catch (error) {
    console.log('error running contract query:', { address, msg });
    return error;
  }
};

export const getTokenBalance = async (
  height: number,
  token = 'ASTRO',
  wallet_address = ''
): Promise<number> => {
  if (!wallet_address) {
    wallet_address = networks['classic'].contracts.apollo_warchest;
  }

  try {
    const res: any = await contractQuery(
      networks['classic'].contracts[token],
      {
        balance: { address: wallet_address }
      },
      height
    );

    return parseInt(res.balance);
  } catch (error) {
    console.log('Error fetching token balance: ');
    return 0;
  }
};

const getTotalSupply = async (height: number, token = '') => {
  try {
    const res: any = await contractQuery(
      networks['classic'].contracts[token].lp_token,
      {
        token_info: {}
      },
      height
    );
    return parseInt(res.total_supply);
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getLPUSTShare = async (height: number, lptoken = ''): Promise<number> => {
  const lp_info: any = await getLPInfo(height, lptoken);
  return parseInt(
    lp_info.assets.find((a: any) => a.info.hasOwnProperty('native_token'))
      .amount
  );
};

const getLPNonUSTShare = async (height: number, lptoken = '') => {
  const lp_info: any = await getLPInfo(height, lptoken);
  return parseInt(
    lp_info.assets.find((a: any) => !a.info.hasOwnProperty('native_token'))
      .amount
  );
};

const getLPTotalValue = async (height: number, lptoken = '') => {
  return (await getLPUSTShare(height, lptoken)) * 2;
};

export const getLPTokenValue = async (height: number, lptoken = '') => {
  const circulating_supply: any = await getLPInfo(height, lptoken);
  const total_value = await getLPTotalValue(height, lptoken);
  return total_value / parseInt(circulating_supply.total_share);
};

const getLPInfo = async (height: number, lptoken: string = '') => {
  try {
    const res = await contractQuery(
      networks['classic'].contracts[lptoken].pair_pool,
      { pool: {} },
      height
    );
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getTokenValueFromStableLP = async (
  height: number,
  lptoken = ''
): Promise<number> => {
  const ust_share = await getLPUSTShare(height, lptoken);
  const token_share = await getLPNonUSTShare(height, lptoken);

  return ust_share / token_share;
};

export const getApolloVaultBalance = async (
  height: number,
  lptoken: string,
  wallet_address?: string,
  network = 'classic'
) => {
  if (!wallet_address) {
    wallet_address = networks[network].contracts.apollo_warchest;
  }

  try {
    const res: any = await contractQuery(
      networks[network].contracts.apollo_factory,
      {
        get_user_strategies: {
          user: wallet_address,
          limit: 1,
          start_from: networks[network].contracts[lptoken].apollo_strategy - 1
        }
      },
      height
    );

    return parseInt(res.strategies[0].base_token_balance);
  } catch (error) {
    console.log(error);
    return error;
  }
};
