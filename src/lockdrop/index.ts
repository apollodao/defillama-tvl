import { loop_blocks } from '../util';
import { getLockdropInfo } from '../data/lockdrop';
import { getXAstroPrice } from '../data/astro';
import BigNumber from 'bignumber.js';
import axios from 'axios';

const query_lockdrop_contract = async (height: number) => {
  const block_info = await axios.get('https://fcd.terra.dev/blocks/' + height);
  const { total_amount_in_lockups } = await getLockdropInfo(height);
  let xastro_balance: BigNumber = new BigNumber(total_amount_in_lockups);
  let xastro_price: BigNumber = new BigNumber(await getXAstroPrice(height));
  let total_value: BigNumber = xastro_balance.times(xastro_price);

  return {
    block_time: block_info.data.block.header.time,
    xastro_balance,
    xastro_price,
    total_value
  };
};

export const lockdrop_query = async () => {
  // loop blocks
  const days = 5; // lockdrop was only live for 5 days
  let running_value: BigNumber = new BigNumber(0);
  let running_balance: BigNumber = new BigNumber(0);
  let output: any[] = [];

  // test single block
  //console.log(await query_lockdrop_contract(7479260));

  await loop_blocks(async (height) => {
    const { xastro_balance, xastro_price, total_value, block_time } =
      await query_lockdrop_contract(height);
    output.push({
      height,
      block_time,
      total_value: total_value.toNumber(),
      xastro_balance: xastro_balance.toNumber(),
      xastro_price: xastro_price.toNumber()
    });

    running_value = running_value.plus(total_value);
    running_balance = running_balance.plus(xastro_balance);
  }, days);

  console.log(output);

  console.log(
    `${days} day:
    average value: ${running_value.div(days).toNumber()}
    average value (demicrofy): ${running_value
      .div(days)
      .div(1000000)
      .toNumber()}
    average balance: ${running_balance.div(days).toNumber()}
    average balance (demicrofy): ${running_balance
      .div(days)
      .div(1000000)
      .toNumber()}`
  );
};
