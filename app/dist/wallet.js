// This file is part of example-private-party.
// Copyright (C) Midnight Foundation
// SPDX-License-Identifier: Apache-2.0
// Licensed under the Apache License, Version 2.0 (the "License");
// You may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import { DustSecretKey, LedgerParameters, nativeToken, ZswapSecretKeys, } from '@midnight-ntwrk/midnight-js-protocol/ledger';
import { ttlOneHour } from '@midnight-ntwrk/midnight-js-utils';
import { FluentWalletBuilder, } from '@midnight-ntwrk/testkit-js';
import * as Rx from 'rxjs';
export class MidnightWalletProvider {
    logger;
    env;
    zswapSecretKeys;
    dustSecretKey;
    wallet;
    unshieldedKeystore;
    constructor(logger, env, wallet, zswapSecretKeys, dustSecretKey, unshieldedKeystore) {
        this.logger = logger;
        this.env = env;
        this.zswapSecretKeys = zswapSecretKeys;
        this.dustSecretKey = dustSecretKey;
        this.wallet = wallet;
        this.unshieldedKeystore = unshieldedKeystore;
    }
    getCoinPublicKey() {
        return this.zswapSecretKeys.coinPublicKey;
    }
    getEncryptionPublicKey() {
        return this.zswapSecretKeys.encryptionPublicKey;
    }
    async balanceTx(tx, ttl = ttlOneHour()) {
        const recipe = await this.wallet.balanceUnboundTransaction(tx, {
            shieldedSecretKeys: this.zswapSecretKeys,
            dustSecretKey: this.dustSecretKey,
        }, { ttl });
        const signed = await this.wallet.signRecipe(recipe, (payload) => this.unshieldedKeystore.signData(payload));
        return await this.wallet.finalizeRecipe(signed);
    }
    submitTx(tx) {
        return this.wallet.submitTransaction(tx);
    }
    /**
     * USER SIDE of fee sponsorship.
     *
     * Balances only the caller's OWN value side — shielded and unshielded — and
     * deliberately NOT dust, then signs and finalizes (binds) the transaction.
     *
     * Finalizing here is the security-relevant step: the returned transaction is
     * bound and signed by this wallet, so a sponsor receiving it can only ADD a
     * DUST fee offer. It cannot change what the transaction does.
     */
    async balanceOwnValueAndFinalize(tx, ttl = ttlOneHour()) {
        const recipe = await this.wallet.balanceUnboundTransaction(tx, {
            shieldedSecretKeys: this.zswapSecretKeys,
            dustSecretKey: this.dustSecretKey,
        }, { ttl, tokenKindsToBalance: ['shielded', 'unshielded'] });
        const signed = await this.wallet.signRecipe(recipe, (payload) => this.unshieldedKeystore.signData(payload));
        return await this.wallet.finalizeRecipe(signed);
    }
    /**
     * SPONSOR SIDE of fee sponsorship.
     *
     * Takes a transaction the user has already proven, balanced, signed and bound,
     * and attaches ONLY a DUST fee offer paid by this wallet. The user's proof and
     * private inputs are never touched — this wallet has no way to read them.
     */
    async addDustFeesAndFinalize(tx, ttl = ttlOneHour()) {
        const recipe = await this.wallet.balanceFinalizedTransaction(tx, {
            shieldedSecretKeys: this.zswapSecretKeys,
            dustSecretKey: this.dustSecretKey,
        }, { ttl, tokenKindsToBalance: ['dust'] });
        const signed = await this.wallet.signRecipe(recipe, (payload) => this.unshieldedKeystore.signData(payload));
        return await this.wallet.finalizeRecipe(signed);
    }
    /**
     * Current DUST balance at `now`, in SPECK (the atomic unit of DUST).
     *
     * Zero means this wallet cannot pay a fee for any transaction, no matter how
     * much NIGHT it holds — which is exactly the condition fee sponsorship solves.
     */
    async getDustBalance() {
        const state = await this.wallet.waitForSyncedState();
        return state.dust.balance(new Date());
    }
    /**
     * Sends unshielded NIGHT to another wallet, paying this wallet's own fees.
     *
     * Whether the NIGHT sent here goes on to generate DUST depends entirely on the
     * RECIPIENT's key: the ledger creates a DUST UTXO only when a NIGHT UTXO is
     * created under a key that already has an entry in its Registration Table. So an
     * unregistered recipient ends up holding NIGHT while still having zero DUST —
     * which is exactly the precondition the sponsorship demo needs.
     */
    async transferNight(to, amount, ttl = ttlOneHour()) {
        const recipe = await this.wallet.transferTransaction([
            {
                type: 'unshielded',
                outputs: [{ type: nativeToken().raw, receiverAddress: to, amount }],
            },
        ], {
            shieldedSecretKeys: this.zswapSecretKeys,
            dustSecretKey: this.dustSecretKey,
        }, { ttl });
        const signed = await this.wallet.signRecipe(recipe, (payload) => this.unshieldedKeystore.signData(payload));
        const finalized = await this.wallet.finalizeRecipe(signed);
        return await this.wallet.submitTransaction(finalized);
    }
    async start() {
        this.logger.info('Starting wallet...');
        await this.wallet.start(this.zswapSecretKeys, this.dustSecretKey);
    }
    async stop() {
        return this.wallet.stop();
    }
    static async build(logger, env, secret) {
        const dustOptions = {
            ledgerParams: LedgerParameters.initialParameters(),
            additionalFeeOverhead: 1000n,
            feeBlocksMargin: 5,
        };
        const base = FluentWalletBuilder.forEnvironment(env)
            .withDustOptions(dustOptions);
        const builder = secret.kind === 'mnemonic'
            ? base.withMnemonic(secret.value)
            : base.withSeed(secret.value);
        const buildResult = await builder.buildWithoutStarting();
        const { wallet, seeds, keystore } = buildResult;
        logger.info(`Wallet built from ${secret.kind}`);
        return new MidnightWalletProvider(logger, env, wallet, ZswapSecretKeys.fromSeed(seeds.shielded), DustSecretKey.fromSeed(seeds.dust), keystore);
    }
}
function isProgressStrictlyComplete(progress) {
    if (!progress || typeof progress !== 'object') {
        return false;
    }
    const candidate = progress;
    if (typeof candidate.isStrictlyComplete !== 'function') {
        return false;
    }
    return candidate.isStrictlyComplete();
}
export async function syncWallet(logger, wallet, timeout = 300_000) {
    logger.info('Syncing wallet...');
    let emissionCount = 0;
    return Rx.firstValueFrom(wallet.state().pipe(Rx.tap((state) => {
        emissionCount++;
        const shielded = isProgressStrictlyComplete(state.shielded.state.progress);
        const unshielded = isProgressStrictlyComplete(state.unshielded.progress);
        const dust = isProgressStrictlyComplete(state.dust.state.progress);
        logger.info(`Wallet sync [${emissionCount}]: shielded=${shielded}, unshielded=${unshielded}, dust=${dust}`);
        if (!shielded) {
            logger.debug(`  shielded.progress: ${JSON.stringify(state.shielded.state.progress)}`);
        }
        if (!unshielded) {
            logger.debug(`  unshielded.progress: ${JSON.stringify(state.unshielded.progress)}`);
        }
        if (!dust) {
            logger.debug(`  dust.progress: ${JSON.stringify(state.dust.state.progress)}`);
        }
    }), Rx.filter((state) => isProgressStrictlyComplete(state.shielded.state.progress) &&
        isProgressStrictlyComplete(state.dust.state.progress) &&
        isProgressStrictlyComplete(state.unshielded.progress)), Rx.tap(() => logger.info(`Wallet sync complete after ${emissionCount} emissions`)), Rx.timeout({
        each: timeout,
        with: () => Rx.throwError(() => new Error(`Wallet sync timeout after ${timeout}ms (${emissionCount} emissions received)`)),
    }), Rx.catchError((err) => {
        logger.error(`Wallet sync error: ${err}`);
        return Rx.throwError(() => err);
    })));
}
