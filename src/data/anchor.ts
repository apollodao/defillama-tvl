import BigNumber from 'bignumber.js';
import { contractQuery } from '../network';

// fetch aUST balance
export const getaUSTBalance = async (height: number) => {
  try {
    const output: any = await contractQuery(
      'terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu',
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

// get aUST value
export const getaUSTPrice = async (height: number) => {
  try {
    const output: any = await contractQuery(
      'terra1sepfj7s0aeg5967uxnfk4thzlerrsktkpelm5s',
      {
        epoch_state: {}
      },
      height
    );

    return new BigNumber(output.exchange_rate).toNumber();
  } catch (error) {
    return 0;
  }
};
