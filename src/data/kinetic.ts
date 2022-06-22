import { networks } from '../networks';
import { contractQuery } from '../network';
import BigNumber from 'bignumber.js';

// get UST locked in Kinetic
export const getUSTLockedInKinetic = async (
  height: number,
  network = 'classic'
) => {
  try {
    const res: any = await contractQuery(
      networks[network].contracts.kinetic_lockdrop,
      {
        user_info: {
          address: networks[network].contracts.apollo_warchest
        }
      },
      height
    );
    return new BigNumber(res.total_ust_locked).toNumber();
  } catch (error) {
    //console.log(`ERROR: ${error}`);
    return 0;
  }
};
