import BigNumber from 'bignumber.js';
//import { getAstroPrice, getAstroBalance } from '../data/astro';
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
import { getApolloBalance, getApolloPrice } from '../data/apollo';
import { getStaderBalance } from '../data/stader';
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
  }
  // TODO: finish porting these assets
  // {
  //   symbol: 'APOLLO-UST LP',
  //   balance_query: getXAstroBalance,
  //   price_query: getXAstroPrice
  // },
  // {
  //   symbol: 'Mars Lockdrop UST',
  //   balance_query: getXAstroBalance,
  //   price_query: getXAstroPrice
  // },
  // {
  //   symbol: 'ASTRO-UST LP',
  //   balance_query: getXAstroBalance,
  //   price_query: getXAstroPrice
  // },
  // {
  //   symbol: 'XMARS',
  //   balance_query: getXAstroBalance,
  //   price_query: getXAstroPrice
  // },
  // {
  //   symbol: 'Kinetic Lockdrop UST',
  //   balance_query: getXAstroBalance,
  //   price_query: getXAstroPrice
  // },
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

// loop backwards through blocks (days) starting at depeg event.
const loop_blocks = async (
  callback: (height: number) => void = () => {},
  days: number = 30,
  start_height: number = 7544910,
  days_interval: number = 13130
) => {
  let height: number = start_height;

  for (let i = 0; i < days; i++) {
    await callback(height);
    height -= days_interval;
  }
};

// main query
// loop through days
//  query assets
//  add assets to report

export const warchest_query = async () => {
  // loop blocks
  const days = 1; // set to 30 for real report. lower number for testing
  let running_total: BigNumber = new BigNumber(0);
  await loop_blocks(async (height) => {
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
