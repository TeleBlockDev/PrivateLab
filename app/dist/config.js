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
export const LOCAL_CONFIG = {
    networkId: 'undeployed',
    indexer: 'http://localhost:8088/api/v4/graphql',
    indexerWS: 'ws://localhost:8088/api/v4/graphql/ws',
    node: 'http://localhost:9944',
    nodeWS: 'ws://localhost:9944',
    proofServer: 'http://localhost:6300',
    faucet: '',
};
export const PREVIEW_CONFIG = {
    networkId: 'preview',
    indexer: 'https://indexer.preview.midnight.network/api/v4/graphql',
    indexerWS: 'wss://indexer.preview.midnight.network/api/v4/graphql/ws',
    node: 'https://rpc.preview.midnight.network',
    nodeWS: 'wss://rpc.preview.midnight.network',
    proofServer: process.env['MIDNIGHT_PROOF_SERVER'] ?? 'http://127.0.0.1:6300',
    faucet: 'https://midnight-tmnight-preview.nethermind.dev/',
};
export const PREPROD_CONFIG = {
    networkId: 'preprod',
    indexer: 'https://indexer.preprod.midnight.network/api/v4/graphql',
    indexerWS: 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws',
    node: 'https://rpc.preprod.midnight.network',
    nodeWS: 'wss://rpc.preprod.midnight.network',
    proofServer: process.env['MIDNIGHT_PROOF_SERVER'] ?? 'http://127.0.0.1:6300',
    faucet: 'https://midnight-tmnight-preprod.nethermind.dev/',
};
export function getConfig() {
    const network = process.env['MIDNIGHT_NETWORK'] ?? 'local';
    switch (network) {
        case 'local':
            return LOCAL_CONFIG;
        case 'preview':
            return PREVIEW_CONFIG;
        case 'preprod':
            return PREPROD_CONFIG;
        default:
            throw new Error(`Unknown network: ${network}. Supported: 'local', 'preview', 'preprod'.`);
    }
}
