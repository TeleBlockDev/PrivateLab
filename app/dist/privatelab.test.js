import { beforeAll, afterAll, describe, expect, it } from 'vitest';
import pino from 'pino';
import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { privateLabContract } from './contract.js';
import { buildProviders } from './providers.js';
import { getConfig } from './config.js';
import { MidnightWalletProvider, syncWallet } from './wallet.js';
const logger = pino({ level: 'silent' });
const config = getConfig();
const aliceSecret = {
    kind: 'mnemonic',
    value: process.env['MIDNIGHT_PREPROD_MNEMONIC'] ?? '',
};
const envConfig = {
    networkId: config.networkId,
    walletNetworkId: config.networkId,
    indexer: config.indexer,
    indexerWS: config.indexerWS,
    node: config.node,
    nodeWS: config.nodeWS,
    faucet: config.faucet,
    proofServer: config.proofServer,
};
const zkConfigPath = new URL('./managed/PrivateLab', import.meta.url).pathname;
let aliceWallet;
describe('PrivateLab', () => {
    beforeAll(async () => {
        setNetworkId(config.networkId);
        aliceWallet = await MidnightWalletProvider.build(logger, envConfig, aliceSecret);
        await aliceWallet.start();
        await syncWallet(logger, aliceWallet.wallet, 600000);
    }, 600_000);
    afterAll(async () => {
        if (aliceWallet) {
            await aliceWallet.stop();
        }
    });
    it('deploys and privately verifies hemoglobin against a minimum', async () => {
        const compiledPrivateLab = privateLabContract(132n, zkConfigPath);
        const deployed = await deployContract(aliceProviders(), {
            compiledContract: compiledPrivateLab,
            privateStateId: 'privatelab-hemoglobin',
            initialPrivateState: {
                hemoglobin: 132n,
            },
        });
        const result = await deployed.callTx.verifyHemoglobin(120n);
        expect(result.public.txId).toBeDefined();
    });
});
function aliceProviders() {
    return buildProviders(aliceWallet, zkConfigPath, config);
}
