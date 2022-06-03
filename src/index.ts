const axios = require('axios');
// const sdk = require('@defillama/sdk');
import BigNumber from 'bignumber.js';
import { PoolResponse } from '../types/pool_response';
import { FactoryStrategyInfoResponse } from '../types/get_strategies_response';

const limit = 1;

async function strategies(height: number) {
  let totalStrategies: FactoryStrategyInfoResponse[] = [];
  let current = 0;
  do {
    // Node is semi-pruned, only every 100th block is stored
    const url =
      'https://lcd.terra.dev/wasm/contracts/terra1g7jjjkt5uvkjeyhp8ecdz4e4hvtn83sud3tmh2/store?query_msg=' +
      encodeURIComponent(
        `{"get_strategies": {"limit": ${limit}, "start_from": ${current}}}`
      );
    const pagedStrategies: FactoryStrategyInfoResponse[] = (
      await axios.get(url)
    ).data.result.strategies;
    console.log(`pagedStrategies:`, pagedStrategies);
    totalStrategies = totalStrategies.concat(pagedStrategies);
    current += limit;
    if (current === 30) {
      current++; //skip
    }
  } while (current < 51);
  return totalStrategies;
}

async function lpPriceInUst(pool: string) {
  const url =
    `https://lcd.terra.dev/wasm/contracts/${pool}/store?query_msg=` +
    encodeURIComponent(`{"pool":{}}`);

  const res: PoolResponse = (await axios.get(url)).data.result;

  if (
    'native_token' in res.assets[0].info &&
    res.assets[0].info.native_token.denom === 'uusd'
  ) {
    return new BigNumber(res.assets[0].amount)
      .multipliedBy(2)
      .div(res.total_share);
  } else if (
    'native_token' in res.assets[1].info &&
    res.assets[1].info.native_token.denom === 'uusd'
  ) {
    return new BigNumber(res.assets[1].amount)
      .multipliedBy(2)
      .div(res.total_share);
  } else {
    // return new BigNumber(0);
    throw new Error(`pair ${pool} is not a UST pair`);
  }
}

async function strategyTvl(
  strategy: FactoryStrategyInfoResponse,
  height: number
) {
  const strategyAddr = strategy.address;
  const lpToken = strategy.base_token;

  //Query the LP pair
  let url =
    `https://lcd.terra.dev/wasm/contracts/${lpToken}/store?query_msg=` +
    encodeURIComponent(`{"minter": {}}`);
  const pair: string = (await axios.get(url)).data.result.minter;

  //Get the LP token price in UST (Only works for UST pairs)
  const lpPrice = await lpPriceInUst(pair);

  //Get the number of LP tokens in the strategy at the specific height
  url =
    `https://fcd.terra.dev/wasm/contracts/${strategyAddr}/store?height=${height}&query_msg=` +
    encodeURIComponent(`{"strategy_info":{}}`);
  const res: { total_bond_amount: string } = (await axios.get(url)).data.result;

  const tvl = lpPrice.multipliedBy(res.total_bond_amount);

  console.log(`tvl for strategy ${strategy.id}: ${tvl.toString()}`);

  return tvl;
}

async function tvl(timestamp: number, ethBlock: number, chainBlocks: number) {
  const strats = await strategies(chainBlocks);

  let total = new BigNumber(0);

  for (let i = 0; i < strats.length; i++) {
    const strategy = strats[i];
    total = total.plus(await strategyTvl(strategy, chainBlocks));
  }

  console.log(`total tvl: ${total.toString()}`);

  // const total = strats.reduce((t, s) => t + Number(s.tvl), 0);
  return {
    '0xa47c8bf37f92abed4a126bda807a7b7498661acd': new BigNumber(
      total.multipliedBy(1e12)
    ).toFixed(0)
  };
}

module.exports = {
  timetravel: false,
  methodology: 'Total TVL on vaults',
  tvl
};

tvl(0, 0, 7544910).then((res) => {
  console.log(`res:`, res);
});
