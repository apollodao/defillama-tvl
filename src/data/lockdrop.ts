import { networks } from '../networks';
import { contractQuery } from '../network';

// get user info from lockdrop contract using user address and xAstro token contract address.

export const getUserInfo = async (
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

export interface LockdropInfo {
  token_address: string;
  total_amount_in_lockups: string;
  incentives_share: string;
  weighted_amount: string;
}

export const getLockdropInfo = async (
  height: number,
  network = 'classic'
): Promise<LockdropInfo> => {
  let xastro_token_address;
  if (network === 'mainnet' || network === 'classic') {
    xastro_token_address = 'terra14lpnyzc9z4g3ugr4lhm8s4nle0tq8vcltkhzh7';
  } else {
    xastro_token_address = 'terra1yufp7cv85qrxrx56ulpfgstt2gxz905fgmysq0';
  }

  try {
    const res: any = await contractQuery(
      networks[network].contracts.apollo_astro_lockdrop,
      {
        supported_asset: {
          token: xastro_token_address
        }
      },
      height
    );

    return {
      token_address: res.token_address,
      total_amount_in_lockups: res.total_amount_in_lockups,
      incentives_share: res.incentives_share,
      weighted_amount: res.weighted_amount
    };
  } catch (error) {
    //console.log(`ERROR: ${error}`);
    return {
      token_address: xastro_token_address,
      total_amount_in_lockups: '0',
      incentives_share: '0',
      weighted_amount: '0'
    };
  }
};
