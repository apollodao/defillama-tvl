import { Coin } from '@terra-money/terra.js';
import { lcdClient } from '../network';

// fetch UST balance
export const getUSTBalance = async (height: number): Promise<number> => {
  const lcd = lcdClient();
  try {
    const res = await lcd.bank.balance(
      'terra1hxrd8pnqytqpelape3aemprw3a023wryw7p0xn',
      { height }
    );
    const uusd = res[0].get('uusd') || new Coin('uusd', '0');

    return parseInt(uusd.amount.toString());
  } catch (error) {
    // console.log(error);
    console.log('error fetching UST balance');
    return 0;
  }
};

// get UST value
export const getUSTPrice = async (height: number) => {
  return 1; // kek
};

export const getLunaBalance = async (height: number): Promise<number> => {
  const lcd = lcdClient();
  try {
    const res = await lcd.bank.balance(
      'terra1hxrd8pnqytqpelape3aemprw3a023wryw7p0xn',
      { height }
    );
    const uluna = res[0].get('uluna') || new Coin('uluna', '0');

    return parseInt(uluna.amount.toString());
  } catch (error) {
    // console.log(error);
    console.log('error fetching UST balance');
    return 0;
  }
};

export const getLunaPrice = async (height: number): Promise<number> => {
  const lcd = lcdClient();
  try {
    const output = await lcd.market.swapRate(new Coin('uluna', 1), 'uusd', {
      height
    });
    return parseFloat(output.toString());
  } catch (error) {
    console.log(`Error: ${error}`);
    return 0;
  }
};
