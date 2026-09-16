import { CompiledContract } from "@midnight-ntwrk/midnight-js-protocol/compact-js";
import { Contract } from "./managed/PrivateLab/contract/index.js";
import { createPrivateLabWitnesses } from "./witnesses.js";

export const privateLabContract = (
  hemoglobin: bigint,
  zkConfigPath: string,
) =>
  CompiledContract.make("PrivateLab", Contract).pipe(
    CompiledContract.withWitnesses(
      createPrivateLabWitnesses({ hemoglobin }),
    ),
    CompiledContract.withCompiledFileAssets(zkConfigPath),
  );
