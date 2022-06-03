import { networks } from '../networks';
import { contractQuery, getTokenBalance, getTokenValue } from '../network';

// get astro deposited into staking contract
const getAstroDeposited = async (height: number, network = 'classic') => {
  try {
    const res: any = await contractQuery(
      networks[network].contracts.astro_farm_governance,
      {
        total_deposit: {}
      },
      height
    );
    return parseFloat(res);
  } catch (error) {
    console.log(`ERROR: ${error}`);
    return 0;
  }
};

// get xastro total supply
const getXAstroSupply = async (height: number, network = 'classic') => {
  const x_astro_contract = networks[network].tokens.find(
    (token: any) => token.symbol === 'XASTRO'
  ).token_contract;

  if (!x_astro_contract) return 0;

  try {
    const res: any = await contractQuery(
      x_astro_contract,
      {
        token_info: {}
      },
      height
    );
    return parseFloat(res.total_supply);
  } catch (error) {
    console.log(`ERROR: ${error}`);
    return 0;
  }
};

// fetch astro balance
export const getAstroBalance = async (height: number) => {
  try {
    const astro_balance = await getTokenBalance(height, 'ASTRO', '');
    return astro_balance;
  } catch (error) {
    console.log(error);
    return 0;
  }
};

// fetch xastro balance
export const getXAstroBalance = async (height: number) => {
  try {
    const x_astro_balance = await getTokenBalance(height, 'XASTRO', '');
    return x_astro_balance;
  } catch (error) {
    console.log(error);
    return 0;
  }
};

// get astro exchange rate from chain
// const getXAstroExchange = async (network = "mainnet") => {
//   try {
//     const res = await contractQuery(
//       networks[network].contracts.astro_staking,
//       {
//         astro_per_x_astro: {},
//       },
//       network
//     );
//     return parseFloat(res);
//   } catch (error) {
//     console.log(error);
//     return 0;
//   }
// };

// get astro value from ASTRO-UST LP pool
const getAstroPrice = async (height: number) => {
  try {
    const astro_price = await getTokenValue(height, 'ASTRO');
    return astro_price;
  } catch (error) {
    console.log(`ERROR: ${error}`);
    return 0;
  }
};

// convert astro to xastro
export const getXAstroPrice = async (height: number) => {
  try {
    const astro_price = await getAstroPrice(height);
    const total_astro_deposited = await getAstroDeposited(height);
    const x_astro_supply = await getXAstroSupply(height);

    const astro_xastro_exchange = total_astro_deposited / x_astro_supply;

    return astro_price * astro_xastro_exchange;
  } catch (error) {
    console.log(`ERROR: ${error}`);
    return 0;
  }
};

// return just exchange
const getXAstroExchange = async (height: number) => {
  try {
    const total_astro_deposited = await getAstroDeposited(height);
    const x_astro_supply = await getXAstroSupply(height);

    const astro_xastro_exchange = total_astro_deposited / x_astro_supply;

    return astro_xastro_exchange;
  } catch (error) {
    console.log(`ERROR: ${error}`);
    return 0;
  }
};

module.exports = {
  getXAstroExchange,
  getAstroPrice,
  getXAstroPrice,
  getAstroBalance,
  getXAstroBalance
};
