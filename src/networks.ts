export const networks: any = {
  classic: {
    name: 'mainnet',
    chainID: 'columbus-5',
    lcd: 'https://lcd.terra.dev',
    apolloLcd: 'https://lcd.terra.dev',
    tokens: [
      {
        label: 'Mars',
        symbol: 'MARS',
        token_contract: 'terra12hgwnpupflfpuual532wgrxu2gjp0tcagzgx4n',
        ust_lp_token: 'terra1ww6sqvfgmktp0afcmvg78st6z89x5zr3tmvpss',
        ust_pair_pool: 'terra19wauh79y42u5vt62c5adt2g5h4exgh26t3rpds'
      },
      {
        label: 'Astro',
        symbol: 'ASTRO',
        token_contract: 'terra1xj49zyqrwpv5k928jwfpfy2ha668nwdgkwlrg3',
        ust_lp_token: 'terra17n5sunn88hpy965mzvt3079fqx3rttnplg779g',
        ust_pair_pool: 'terra1l7xu2rl3c7qmtx3r5sd2tz25glf6jh8ul7aag7'
      },
      {
        label: 'xAstro',
        symbol: 'XASTRO',
        token_contract: 'terra14lpnyzc9z4g3ugr4lhm8s4nle0tq8vcltkhzh7',
        ust_lp_token: 'terra17n5sunn88hpy965mzvt3079fqx3rttnplg779g',
        ust_pair_pool: 'terra1l7xu2rl3c7qmtx3r5sd2tz25glf6jh8ul7aag7'
      },
      {
        label: 'Apollo',
        symbol: 'APOLLO',
        token_contract: 'terra100yeqvww74h4yaejj6h733thgcafdaukjtw397',
        ust_lp_token: 'terra1zuktmswe9zjck0xdpw2k79t0crjk86fljv2rm0',
        ust_pair_pool: 'terra1zpnhtf9h5s7ze2ewlqyer83sr4043qcq64zfc4'
      },
      {
        label: 'Anchor',
        symbol: 'ANC',
        token_contract: 'terra14z56l0fp2lsf86zy3hty2z47ezkhnthtr9yq76',
        ust_lp_token: 'terra1wmaty65yt7mjw6fjfymkd9zsm6atsq82d9arcd',
        ust_pair_pool: 'terra1qr2k6yjjd5p2kaewqvg93ag74k6gyjr7re37fs'
      },
      {
        label: 'Mirror',
        symbol: 'MIR',
        token_contract: 'terra15gwkyepfc6xgca5t5zefzwy42uts8l2m4g40k6',
        ust_lp_token: 'terra17trxzqjetl0q6xxep0s2w743dhw2cay0x47puc',
        ust_pair_pool: 'terra143xxfw5xf62d5m32k3t4eu9s82ccw80lcprzl9'
      }
    ],
    contracts: {
      ASTROUSTLP: {
        type: 'stable-lp',
        token_1: 'ASTRO',
        lp_token: 'terra17n5sunn88hpy965mzvt3079fqx3rttnplg779g',
        pair_pool: 'terra1l7xu2rl3c7qmtx3r5sd2tz25glf6jh8ul7aag7',
        apollo_strategy: 42
      },
      APOLLOUSTLP: {
        type: 'stable-lp',
        token_1: 'APOLLO',
        lp_token: '',
        pair_pool: 'terra1a04v570f9cxp49mk06vjsm8axsswndpwwt67k4'
      },
      MARSUSTLP: {
        type: 'stable-lp',
        token_1: 'MARS',
        lp_token: 'terra1ww6sqvfgmktp0afcmvg78st6z89x5zr3tmvpss',
        pair_pool: 'terra19wauh79y42u5vt62c5adt2g5h4exgh26t3rpds'
      },
      HALOUSTLP: {
        type: 'stable-lp',
        token_1: 'HALO',
        lp_token: 'terra17pzt8t2hmx6587zn6yh5ensylm3s9mm4m72v2n',
        pair_pool: 'terra1yjg0tuhc6kzwz9jl8yqgxnf2ctwlfumnvscupp'
      },
      ASTRO: 'terra1xj49zyqrwpv5k928jwfpfy2ha668nwdgkwlrg3',
      XASTRO: 'terra14lpnyzc9z4g3ugr4lhm8s4nle0tq8vcltkhzh7',
      APOLLO: '',
      XMARS: 'terra1a04v570f9cxp49mk06vjsm8axsswndpwwt67k4',
      mars_staking: 'terra1y8wwr5q24msk55x9smwn0ptyt24fxpwm4l7tjl',
      astro_staking: 'terra1nq4aszdm82wujstxwpjxtvckg7ghu63mqkey33',
      astro_farm_governance: 'terra1f68wt2ch3cx2g62dxtc8v68mkdh5wchdgdjwz7',
      apollo_warchest: 'terra1hxrd8pnqytqpelape3aemprw3a023wryw7p0xn',
      apollo_factory: 'terra1g7jjjkt5uvkjeyhp8ecdz4e4hvtn83sud3tmh2',
      kinetic_lockdrop: 'terra140pm775hac6qzzvjd66ur44ye8llw4g5y55qw3',
      apollo_astro_lockdrop: 'terra120z72wqvrtfjgyxcdnhnxn5e5chxz7ruud290n'
    }
  },
  testnet: {
    name: 'testnet',
    chainID: 'bombay-12',
    lcd: 'https://bombay-lcd.terra.dev',
    apolloLcd: 'https://bombay-lcd.terra.dev',
    contracts: {
      ASTROUSTLP: {
        type: 'stable',
        token_1: '',
        lp_token: '',
        pair_pool: ''
      },
      APOLLOUSTLP: {
        type: 'stable',
        token_1: '',
        lp_token: '',
        pair_pool: ''
      },
      apollo_astro_lockdrop: 'terra1w5yex98p6zjyz5yc40qavm99k796xnqaafsmys'
    }
  },
  moonshine: {
    name: 'moonshine',
    chainID: 'localterra',
    lcd: 'https://moonshine-lcd.terra.dev',
    contracts: {
      ASTROUSTLP: {
        type: 'stable',
        token_1: '',
        lp_token: '',
        pair_pool: ''
      },
      APOLLOUSTLP: {
        type: 'stable',
        token_1: '',
        lp_token: '',
        pair_pool: ''
      }
    }
  }
};

export default networks;
