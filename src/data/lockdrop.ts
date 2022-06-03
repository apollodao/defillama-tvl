import { networks } from '../networks';
import { contractQuery } from '../network';

// get user info from lockdrop contract using user address and xAstro token contract address.

const getUserInfo = async (
  height: number,
  user_addr = '',
  network = 'classic'
) => {
  let xastro_token_address;
  if (network === 'mainnet' || network === 'classic') {
    xastro_token_address = 'terra14lpnyzc9z4g3ugr4lhm8s4nle0tq8vcltkhzh7';
  } else {
    xastro_token_address = 'terra1yufp7cv85qrxrx56ulpfgstt2gxz905fgmysq0';
  }

  try {
    const res = await contractQuery(
      networks[network].contracts.apollo_astro_lockdrop,
      {
        user_info: {
          address: user_addr,
          token: xastro_token_address
        }
      },
      height
    );
    return res;
  } catch (error) {
    console.log(`ERROR: ${error}`);
    return 0;
  }
};

const getLockdropInfo = async (height: number, network = 'classic') => {
  let xastro_token_address;
  if (network === 'mainnet' || network === 'classic') {
    xastro_token_address = 'terra14lpnyzc9z4g3ugr4lhm8s4nle0tq8vcltkhzh7';
  } else {
    xastro_token_address = 'terra1yufp7cv85qrxrx56ulpfgstt2gxz905fgmysq0';
  }

  try {
    const res = await contractQuery(
      networks[network].contracts.apollo_astro_lockdrop,
      {
        supported_asset: {
          token: xastro_token_address
        }
      },
      height
    );
    return res;
  } catch (error) {
    console.log(`ERROR: ${error}`);
    return 0;
  }
};

module.exports = {
  getUserInfo,
  getLockdropInfo
};
