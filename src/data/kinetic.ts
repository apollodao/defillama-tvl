import { networks } from '../networks';
import { contractQuery } from '../network';

// get UST locked in Kinetic
export const getUSTLockedInKinetic = async (
  height: number,
  network = 'classic'
) => {
  return 700000000000;

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
    return parseFloat(res);
  } catch (error) {
    console.log(`ERROR: ${error}`);
    return 0;
  }
};

module.exports = {
  getUSTLockedInKinetic
};
