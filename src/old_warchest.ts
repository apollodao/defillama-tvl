import { LCDClient, Coin } from '@terra-money/terra.js';
const request = require('axios');
import {
  getTokenBalance,
  getTokenValueFromStableLP,
  getLPTokenValue,
  getApolloVaultBalance
} from './network';
import { getXMarsPrice } from './data/mars';
import { getXAstroPrice, getXAstroBalance } from './data/astro';
import { getUSTLockedInKinetic } from './data/kinetic';

const contracts = {
  apolloFactory: 'terra1g7jjjkt5uvkjeyhp8ecdz4e4hvtn83sud3tmh2',
  apolloWarchest: 'terra1vcpt3p9p6rrqaw4zwt706p8vj7uhd0sf4p5snl'
};

const network = {
  URL: 'https://fcd.terra.dev',
  //URL: "https://lcd.terra.dev",
  chainID: 'columbus-5'
};

const connectTerra = async () => {
  const terra = new LCDClient(network);
  return terra;
};

async function contractQuery(
  height: number,
  client: LCDClient,
  contract = 'terra1g7jjjkt5uvkjeyhp8ecdz4e4hvtn83sud3tmh2',
  query: any = { get_total_tvl: {} }
) {
  const result = await client.wasm.contractQuery(contract, query, { height });
  return result;
}

async function getApolloLpTokenBalance(height: number, client: LCDClient) {
  try {
    const output: any = await contractQuery(
      height,
      client,
      'terra1n3gt4k3vth0uppk0urche6m3geu9eqcyujt88q',
      {
        balance: {
          address: 'terra1hxrd8pnqytqpelape3aemprw3a023wryw7p0xn'
        }
      }
    );
    return output.balance;
  } catch (error) {
    return 0;
  }
}

async function getAstroportApolloLpBalance(height: number, client: LCDClient) {
  try {
    const output: any = await contractQuery(
      height,
      client,
      'terra1627ldjvxatt54ydd3ns6xaxtd68a2vtyu7kakj',
      {
        user_info: {
          address: 'terra1hxrd8pnqytqpelape3aemprw3a023wryw7p0xn'
        }
      }
    );
    return output.lockup_infos[0].lp_units_locked;
  } catch (error) {
    return 0;
  }
}

async function getMarsLockdropInfo(height: number, client: LCDClient) {
  try {
    const output: any = await contractQuery(
      height,
      client,
      'terra1n38982txtv2yygtcfv3e9wp2ktmjyxl6z88rma',
      {
        user_info: {
          address: 'terra1hxrd8pnqytqpelape3aemprw3a023wryw7p0xn'
        }
      }
    );
    //Once Mars goes live, we will return the unlocked amount
    return parseInt(output.total_ust_locked);
  } catch (error) {
    return 0;
  }
}

async function getYieldFoundryDAOSeedInvestment() {
  return parseInt('250000000000');
}

async function getApolloLPTotalSupply(height: number, client: LCDClient) {
  try {
    const output: any = await contractQuery(
      height,
      client,
      'terra1n3gt4k3vth0uppk0urche6m3geu9eqcyujt88q',
      {
        token_info: {}
      }
    );
    return parseInt(output.total_supply || '0');
  } catch (error) {
    return 0;
  }
}

async function getApolloLpUusdAmount(height: number, client: LCDClient) {
  try {
    const output: any = await contractQuery(
      height,
      client,
      'terra1xj2w7w8mx6m2nueczgsxy2gnmujwejjeu2xf78',
      {
        pool: {}
      }
    );
    return parseInt(
      output.assets.find((a: any) => a.info.hasOwnProperty('native_token'))
        .amount || '0'
    );
  } catch (error) {
    return 0;
  }
}

async function getAstroTokenBalance(height: number, client: LCDClient) {
  try {
    const output: any = await contractQuery(
      height,
      client,
      'terra1xj49zyqrwpv5k928jwfpfy2ha668nwdgkwlrg3',
      {
        balance: {
          address: 'terra1hxrd8pnqytqpelape3aemprw3a023wryw7p0xn'
        }
      }
    );
    return output.balance;
  } catch (error) {
    return 0;
  }
}

async function getApolloTokenBalance(height: number, client: LCDClient) {
  try {
    const output: any = await contractQuery(
      height,
      client,
      'terra100yeqvww74h4yaejj6h733thgcafdaukjtw397',
      {
        balance: {
          address: 'terra1hxrd8pnqytqpelape3aemprw3a023wryw7p0xn'
        }
      }
    );
    return output.balance;
  } catch (error) {
    return 0;
  }
}

async function getApolloExchangeRate(height: number) {
  try {
    const res = await request.get(
      'https://price-api-mainnet.apollo.farm/v1/apollo/price?interval=1m'
    );

    if (!res) {
      return 0;
    }

    return parseFloat(res.data.lastPrice);
  } catch (error) {
    return 0;
  }
}

async function getYLunaBalance(height: number, client: LCDClient) {
  try {
    const output: any = await contractQuery(
      height,
      client,
      'terra1ns5nsvtdxu53dwdthy3yxs6x3w2hf3fclhzllc',
      {
        reward_info: {
          staker_addr: 'terra1hxrd8pnqytqpelape3aemprw3a023wryw7p0xn'
        }
      }
    );
    return parseFloat(output.bond_amount);
  } catch (error) {
    console.log(error);
    return 0;
  }
}

async function getYLunaExchangeRate(height: number) {
  try {
    const res = await request.get(
      `https://fcd.terra.dev/terra/wasm/v1beta1/contracts/terra1yrc0zpwhuqezfnhdgvvh7vs5svqtgyl7pu3n6c/store?height=${height}&query_msg=eyJzaW11bGF0ZV9zd2FwX29wZXJhdGlvbnMiOnsib2ZmZXJfYW1vdW50IjoiMTAwMDAwMCIsIm9wZXJhdGlvbnMiOlt7InByaXNtX3N3YXAiOnsib2ZmZXJfYXNzZXRfaW5mbyI6eyJjdzIwIjoidGVycmExN3drYWRnMHRhaDU1NHIzNXg2d3ZmZjB5NXM3dmU4bnBjamZ1aHoifSwiYXNrX2Fzc2V0X2luZm8iOnsiY3cyMCI6InRlcnJhMWRoOTQ3OGsycXZxaHFlYWpobjc1YTJhN2RzbmY3NHk1dWtyZWd3In19fSx7InByaXNtX3N3YXAiOnsib2ZmZXJfYXNzZXRfaW5mbyI6eyJjdzIwIjoidGVycmExZGg5NDc4azJxdnFocWVhamhuNzVhMmE3ZHNuZjc0eTV1a3JlZ3cifSwiYXNrX2Fzc2V0X2luZm8iOnsibmF0aXZlIjoidXVzZCJ9fX1dfX0%3D`
    );
    return parseFloat(res.data.query_result.amount);
  } catch (error) {
    return 0;
  }
}

async function getPLunaBalance(height: number, client: LCDClient) {
  try {
    const output: any = await contractQuery(
      height,
      client,
      'terra1tlgelulz9pdkhls6uglfn5lmxarx7f2gxtdzh2',
      {
        balance: {
          address: 'terra1hxrd8pnqytqpelape3aemprw3a023wryw7p0xn'
        }
      }
    );
    return parseFloat(output.balance);
  } catch (error) {
    return 0;
  }
}

async function getPLunaExchangeRate(height: number) {
  try {
    const res = await request.get(
      `https://fcd.terra.dev/terra/wasm/v1beta1/contracts/terra1yrc0zpwhuqezfnhdgvvh7vs5svqtgyl7pu3n6c/store?height=${height}&query_msg=eyJzaW11bGF0ZV9zd2FwX29wZXJhdGlvbnMiOnsib2ZmZXJfYW1vdW50IjoiMTAwMDAwMCIsIm9wZXJhdGlvbnMiOlt7InByaXNtX3N3YXAiOnsib2ZmZXJfYXNzZXRfaW5mbyI6eyJjdzIwIjoidGVycmExdGxnZWx1bHo5cGRraGxzNnVnbGZuNWxteGFyeDdmMmd4dGR6aDIifSwiYXNrX2Fzc2V0X2luZm8iOnsiY3cyMCI6InRlcnJhMWRoOTQ3OGsycXZxaHFlYWpobjc1YTJhN2RzbmY3NHk1dWtyZWd3In19fSx7InByaXNtX3N3YXAiOnsib2ZmZXJfYXNzZXRfaW5mbyI6eyJjdzIwIjoidGVycmExZGg5NDc4azJxdnFocWVhamhuNzVhMmE3ZHNuZjc0eTV1a3JlZ3cifSwiYXNrX2Fzc2V0X2luZm8iOnsibmF0aXZlIjoidXVzZCJ9fX1dfX0%3D`
    );
    return parseFloat(res.data.query_result.amount);
  } catch (error) {
    return 0;
  }
}

async function getBalances(height: number) {
  const marsLockDropUstBalance = await getMarsLockdropInfo(height, terra);
  const apolloLpTokenBalance = await getAstroportApolloLpBalance(height, terra);
  const apolloLpTotalSupply = await getApolloLPTotalSupply(height, terra);
  const apolloLpUusdAmount = await getApolloLpUusdAmount(height, terra).then(
    (a) => a * 2
  );
  const yLunaTokenBalance = await getYLunaBalance(height, terra);
  const pLunaTokenBalance = await getPLunaBalance(height, terra);
  const yLunaExchangeRate = await getYLunaExchangeRate(height);
  const pLunaExchangeRate = await getPLunaExchangeRate(height);
  const apolloTokenBalance = await getApolloTokenBalance(height, terra);
  const apolloExchangeRate = await getApolloExchangeRate(height, terra);
  const astro_ust_lp_balance: any = await getApolloVaultBalance(
    height,
    'ASTROUSTLP'
  );
  const astro_ust_lp_value = await getLPTokenValue(height, 'ASTROUSTLP');
  const xmars_balance: any = await getTokenBalance(height, 'XMARS');
  const xmars_price = await getXMarsPrice(height);
  const xastro_balance: any = await getXAstroBalance(height);
  const xastro_price = await getXAstroPrice(height);
  const kinetic_lockdrop = await getUSTLockedInKinetic(height);
  const kinetic_lockdrop_price = 1;

  const apolloLpValue =
    (apolloLpTokenBalance / apolloLpTotalSupply) * apolloLpUusdAmount;
  const aust_to_uusd = anchorBalance * anchorExchangeRate;
  const luna_to_uusd =
    (parseInt(lunaInWarchestToUST.amount.toString()) || 0) +
    (parseInt(lunaInStaderToUST.amount.toString()) || 0);

  const uusd_balance = uusd.amount || 0;
  const totalUST =
    luna_to_uusd +
    parseInt(uusd_balance.toString()) +
    parseInt(aust_to_uusd.toString()) +
    parseInt((astroTokenBalance * astroTokenExchangeRate).toString()) +
    apolloLpValue +
    yieldFoundryInvestment +
    marsLockDropUstBalance +
    (yLunaExchangeRate / 1000000) * yLunaTokenBalance +
    (pLunaExchangeRate / 1000000) * pLunaTokenBalance +
    apolloExchangeRate * apolloTokenBalance +
    astro_ust_lp_value * astro_ust_lp_balance +
    xmars_price * xmars_balance +
    xastro_price * xastro_balance +
    kinetic_lockdrop * kinetic_lockdrop_price;

  const values = {
    warchest: numberToDollarValue(totalUST),
    details: {
      UST: {
        label: 'UST',
        swap: 1,
        balance: parseInt(uusd.amount.toString()),
        value: parseInt(uusd.amount.toString()) * 1
      },
      LUNA: {
        label: 'LUNA',
        swap: lunaExchangeRate,
        balance: parseFloat(uluna.amount.toString()),
        value: lunaExchangeRate * parseInt(uluna.amount.toString())
      },
      aUST: {
        label: 'aUST',
        swap: parseFloat(anchorExchangeRate),
        balance: parseFloat(anchorBalance),
        value: parseFloat(anchorExchangeRate) * parseFloat(anchorBalance)
      },
      sLUNA: {
        label: 'LUNA (Staked in Stader)',
        swap: lunaExchangeRate,
        balance: lunaBalance,
        value: lunaExchangeRate * lunaBalance
      },
      APOLLOUSTLP: {
        label: 'APOLLO + UST LP',
        swap: apolloLpTokenBalance / apolloLpTotalSupply,
        balance: apolloLpUusdAmount,
        value: (apolloLpTokenBalance / apolloLpTotalSupply) * apolloLpUusdAmount
      },
      ASTRO: {
        label: 'ASTRO',
        swap: astroTokenExchangeRate,
        balance: parseFloat(astroTokenBalance),
        value: astroTokenExchangeRate * parseFloat(astroTokenBalance)
      },
      YIELDFOUNDRYSEEDINVESTMENT: {
        label: 'YF DAO Seed Investment', //Lol
        swap: 1,
        balance: yieldFoundryInvestment,
        value: 1 * yieldFoundryInvestment
      },
      MARSLOCKDROP: {
        label: 'Mars Lockdrop UST', //Lol
        swap: 1,
        balance: marsLockDropUstBalance,
        value: 1 * marsLockDropUstBalance
      },
      yLUNA: {
        label: 'yLuna',
        swap: yLunaExchangeRate / 1000000,
        balance: yLunaTokenBalance,
        value: (yLunaExchangeRate / 1000000) * yLunaTokenBalance
      },
      pLUNA: {
        label: 'pLuna',
        swap: pLunaExchangeRate / 1000000,
        balance: pLunaTokenBalance,
        value: (pLunaExchangeRate / 1000000) * pLunaTokenBalance
      },
      APOLLO: {
        label: 'Apollo',
        swap: apolloExchangeRate,
        balance: apolloTokenBalance,
        value: apolloExchangeRate * apolloTokenBalance
      },
      ASTROUSTLP: {
        label: 'Astro + UST LP',
        swap: astro_ust_lp_value,
        balance: astro_ust_lp_balance,
        value: astro_ust_lp_value * astro_ust_lp_balance
      },
      XMARS: {
        label: 'xMARS',
        swap: xmars_price,
        balance: xmars_balance,
        value: xmars_price * xmars_balance
      },
      XASTRO: {
        label: 'xAstro',
        swap: xastro_price,
        balance: xastro_balance,
        value: xastro_price * xastro_balance
      },
      KINETIC_LOCKDROP: {
        label: 'Kinetic Lockdrop',
        swap: kinetic_lockdrop_price,
        balance: kinetic_lockdrop,
        value: kinetic_lockdrop_price * kinetic_lockdrop
      }
    }
  };
  return values;
}

function numberToDollarValue(x: number) {
  if (typeof x === 'string') x = parseInt(x);

  x = x / 1000000;

  return x.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });
}
