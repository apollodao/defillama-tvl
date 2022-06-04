import { contractQuery } from '../network';

// fetch stader luna balance
export const getStaderBalance = async (height: number) => {
  try {
    const output: any = await contractQuery(
      'terra1r2vv8cyt0scyxymktyfuudqs3lgtypk72w6m3m',
      {
        get_user_computed_info: {
          user_addr: 'terra1hxrd8pnqytqpelape3aemprw3a023wryw7p0xn',
          pool_id: 2
        }
      },
      height
    );
    return (
      parseInt(output.info.deposit.staked) +
      parseInt(output.info.pending_rewards)
    );
  } catch (error) {
    return 0;
  }
};
