import type { WitnessContext } from '@midnight-ntwrk/compact-runtime';
import type { Ledger, Witnesses } from '../../contract/compiled/contract/index.js';

export type PrivateLabPrivateState = {
  hemoglobin: bigint;
};

export const createPrivateLabWitnesses = (
  privateState: PrivateLabPrivateState,
): Witnesses<PrivateLabPrivateState> => ({
  getHemoglobin(
    context: WitnessContext<Ledger, PrivateLabPrivateState>,
  ): [PrivateLabPrivateState, bigint] {
    return [context.privateState, privateState.hemoglobin];
  },
});
