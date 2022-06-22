import BigNumber from 'bignumber.js';
import { loop_blocks } from '../util';
import {
  getAstroPrice,
  getAstroBalance,
  getXAstroBalance,
  getXAstroPrice
} from '../data/astro';
import {
  getUSTBalance,
  getUSTPrice,
  getLunaBalance,
  getLunaPrice
} from '../data/bank';
import { getaUSTBalance, getaUSTPrice } from '../data/anchor';
import {
  getYLunaBalance,
  getYLunaExchangeRate,
  getPLunaBalance,
  getPLunaExchangeRate
} from '../data/prism';
import {
  getApolloBalance,
  getApolloPrice,
  getApolloLpUusdAmount,
  getApolloLPPrice
} from '../data/apollo';
import { getStaderBalance } from '../data/stader';
import {
  getTokenBalance,
  getApolloVaultBalance,
  getLPTokenValue
} from '../network';
import { getXMarsPrice, getMarsLockdropInfo } from '../data/mars';
import { getUSTLockedInKinetic } from '../data/kinetic';

import { WarchestAsset } from '../../types/asset';

// build queries and populate this array to add to report
const warchest_assets: WarchestAsset[] = [
  {
    symbol: 'UST',
    balance_query: getUSTBalance,
    price_query: getUSTPrice
  },
  {
    symbol: 'LUNA',
    balance_query: getLunaBalance,
    price_query: getLunaPrice
  },
  {
    symbol: 'aUST',
    balance_query: getaUSTBalance,
    price_query: getaUSTPrice
  },
  {
    symbol: 'Stader Luna',
    balance_query: getStaderBalance,
    price_query: getLunaPrice
  },
  {
    symbol: 'yLuna',
    balance_query: getYLunaBalance,
    price_query: getYLunaExchangeRate
  },
  {
    symbol: 'pLuna',
    balance_query: getPLunaBalance,
    price_query: getPLunaExchangeRate
  },
  {
    symbol: 'ASTRO',
    balance_query: getAstroBalance,
    price_query: getAstroPrice
  },
  {
    symbol: 'XASTRO',
    balance_query: getXAstroBalance,
    price_query: getXAstroPrice
  },
  {
    symbol: 'APOLLO',
    balance_query: getApolloBalance,
    price_query: getApolloPrice
  },
  {
    symbol: 'APOLLO-UST LP',
    balance_query: getApolloLpUusdAmount,
    price_query: getApolloLPPrice
  },
  {
    symbol: 'XMARS',
    balance_query: async (height: number) => {
      return getTokenBalance(height, 'XMARS');
    },
    price_query: getXMarsPrice
  },
  {
    symbol: 'ASTRO-UST LP',
    balance_query: async (height: number) => {
      return getApolloVaultBalance(height, 'ASTROUSTLP');
    },
    price_query: async (height: number) => {
      return getLPTokenValue(height, 'ASTROUSTLP');
    }
  },
  {
    symbol: 'Mars Lockdrop UST',
    balance_query: getMarsLockdropInfo,
    price_query: async (height: number) => {
      return 1; // ust price is 1
    }
  },
  {
    symbol: 'Kinetic Lockdrop UST',
    balance_query: getUSTLockedInKinetic,
    price_query: async (height: number) => {
      return 1; // ust price is 1
    }
  }
];

// return warchest assets
const query_assets = async (height: number) => {
  let value_total: BigNumber = new BigNumber(0);
  const assets = [];

  for (let i = 0; i < warchest_assets.length; i++) {
    const balance = await warchest_assets[i].balance_query(height);
    const price = await warchest_assets[i].price_query(height);

    const asset = {
      symbol: warchest_assets[i].symbol,
      balance,
      price,
      usd_value: new BigNumber(balance).multipliedBy(price).toNumber()
    };
    value_total = value_total.plus(asset.usd_value);

    assets.push(asset);
  }
  return {
    value_total,
    assets
  };
};

// main query
// loop through days
//  query assets
//  add assets to report

export const warchest_query = async () => {
  // loop blocks
  const days = 1; // set to 30 for real report. lower number for testing
  let running_total: BigNumber = new BigNumber(0);
  await loop_blocks(async (height: number) => {
    const { value_total, assets } = await query_assets(height);
    console.log(
      {
        height,
        value_total: value_total.toNumber(),
        assets
      },
      ','
    );

    running_total = running_total.plus(value_total);
  }, days);

  console.log(
    `${days} day:
    average: ${running_total.div(days).toNumber()}
    average (demicrofy): ${running_total.div(days).div(1000000).toNumber()}`
  );
};
