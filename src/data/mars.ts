import { networks } from '../networks';
import { contractQuery, getTokenValueFromStableLP } from '../network';

export const getXMarsExchange = async (height: number, network = 'classic') => {
  try {
    const res: any = await contractQuery(
      networks[network].contracts.mars_staking,
      {
        mars_per_x_mars: {}
      },
      height
    );
    return parseFloat(res);
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getMarsPrice = async (height: number) => {
  try {
    const mars_price = await getTokenValueFromStableLP(height, 'MARSUSTLP');
    return mars_price;
  } catch (error) {
    console.log(`ERROR: ${error}`);
    return 0;
  }
};

export const getXMarsPrice = async (height: number) => {
  try {
    const mars_price = await getMarsPrice(height);
    const mars_xmars_exchange: any = await getXMarsExchange(height);
    return mars_price * mars_xmars_exchange;
  } catch (error) {
    console.log(`ERROR: ${error}`);
    return 0;
  }
};

export const getMarsLockdropInfo = async (height: number) => {
  try {
    const output: any = await contractQuery(
      'terra1n38982txtv2yygtcfv3e9wp2ktmjyxl6z88rma',
      {
        user_info: {
          address: 'terra1hxrd8pnqytqpelape3aemprw3a023wryw7p0xn'
        }
      },
      height
    );
    return parseInt(output.total_ust_locked);
  } catch (error) {
    return 0;
  }
};
