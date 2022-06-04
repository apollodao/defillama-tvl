import BigNumber from 'bignumber.js';
//import { getAstroPrice, getAstroBalance } from '../data/astro';
import {
  getAstroPrice,
  getAstroBalance,
  getXAstroBalance,
  getXAstroPrice
} from '../data/astro';
import { WarchestAsset } from '../../types/asset';

const warchest_assets: WarchestAsset[] = [
  {
    symbol: 'ASTRO',
    balance_query: getAstroBalance,
    price_query: getAstroPrice
  },
  {
    symbol: 'XASTRO',
    balance_query: getXAstroBalance,
    price_query: getXAstroPrice
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
    height,
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

export const warchest_query = async () => {
  // loop blocks
  const days = 2;
  let running_total: BigNumber = new BigNumber(0);
  await loop_blocks(async (height) => {
    const { value_total, assets } = await query_assets(height);
    console.log({
      height,
      value_total: value_total.toNumber(),
      assets
    });

    running_total = running_total.plus(value_total);
  }, days);

  console.log(
    `${days} day:
    average: ${running_total.div(days).toNumber()}
    average (demicrofy): ${running_total.div(days).div(1000000).toNumber()}`
  );
};
