import { contractQuery } from '../network';
import BigNumber from 'bignumber.js';
const request = require('axios');

export async function getYLunaBalance(height: number) {
  try {
    const output: any = await contractQuery(
      'terra1ns5nsvtdxu53dwdthy3yxs6x3w2hf3fclhzllc',
      {
        reward_info: {
          staker_addr: 'terra1hxrd8pnqytqpelape3aemprw3a023wryw7p0xn'
        }
      },
      height
    );
    return parseFloat(output.bond_amount);
  } catch (error) {
    console.log(error);
    return 0;
  }
}

export async function getYLunaExchangeRate(height: number) {
  try {
    const res = await request.get(
      `https://fcd.terra.dev/terra/wasm/v1beta1/contracts/terra1yrc0zpwhuqezfnhdgvvh7vs5svqtgyl7pu3n6c/store?height=${height}&query_msg=eyJzaW11bGF0ZV9zd2FwX29wZXJhdGlvbnMiOnsib2ZmZXJfYW1vdW50IjoiMTAwMDAwMCIsIm9wZXJhdGlvbnMiOlt7InByaXNtX3N3YXAiOnsib2ZmZXJfYXNzZXRfaW5mbyI6eyJjdzIwIjoidGVycmExN3drYWRnMHRhaDU1NHIzNXg2d3ZmZjB5NXM3dmU4bnBjamZ1aHoifSwiYXNrX2Fzc2V0X2luZm8iOnsiY3cyMCI6InRlcnJhMWRoOTQ3OGsycXZxaHFlYWpobjc1YTJhN2RzbmY3NHk1dWtyZWd3In19fSx7InByaXNtX3N3YXAiOnsib2ZmZXJfYXNzZXRfaW5mbyI6eyJjdzIwIjoidGVycmExZGg5NDc4azJxdnFocWVhamhuNzVhMmE3ZHNuZjc0eTV1a3JlZ3cifSwiYXNrX2Fzc2V0X2luZm8iOnsibmF0aXZlIjoidXVzZCJ9fX1dfX0%3D`
    );
    return new BigNumber(res.data.query_result.amount).div(1000000).toNumber();
  } catch (error) {
    return 0;
  }
}

export async function getPLunaBalance(height: number) {
  try {
    const output: any = await contractQuery(
      'terra1tlgelulz9pdkhls6uglfn5lmxarx7f2gxtdzh2',
      {
        balance: {
          address: 'terra1hxrd8pnqytqpelape3aemprw3a023wryw7p0xn'
        }
      },
      height
    );
    return parseFloat(output.balance);
  } catch (error) {
    return 0;
  }
}

export async function getPLunaExchangeRate(height: number) {
  try {
    const res = await request.get(
      `https://fcd.terra.dev/terra/wasm/v1beta1/contracts/terra1yrc0zpwhuqezfnhdgvvh7vs5svqtgyl7pu3n6c/store?height=${height}&query_msg=eyJzaW11bGF0ZV9zd2FwX29wZXJhdGlvbnMiOnsib2ZmZXJfYW1vdW50IjoiMTAwMDAwMCIsIm9wZXJhdGlvbnMiOlt7InByaXNtX3N3YXAiOnsib2ZmZXJfYXNzZXRfaW5mbyI6eyJjdzIwIjoidGVycmExdGxnZWx1bHo5cGRraGxzNnVnbGZuNWxteGFyeDdmMmd4dGR6aDIifSwiYXNrX2Fzc2V0X2luZm8iOnsiY3cyMCI6InRlcnJhMWRoOTQ3OGsycXZxaHFlYWpobjc1YTJhN2RzbmY3NHk1dWtyZWd3In19fSx7InByaXNtX3N3YXAiOnsib2ZmZXJfYXNzZXRfaW5mbyI6eyJjdzIwIjoidGVycmExZGg5NDc4azJxdnFocWVhamhuNzVhMmE3ZHNuZjc0eTV1a3JlZ3cifSwiYXNrX2Fzc2V0X2luZm8iOnsibmF0aXZlIjoidXVzZCJ9fX1dfX0%3D`
    );
    return new BigNumber(res.data.query_result.amount).div(1000000).toNumber();
  } catch (error) {
    return 0;
  }
}
