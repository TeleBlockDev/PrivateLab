<div align="center">

# 🧪 PrivateLab

## Privacy-Preserving Laboratory Result Verification

**Verify whether a laboratory result meets a required condition without revealing the underlying private value.**

[![Built with Midnight](https://img.shields.io/badge/Built%20with-Midnight-6C63FF?style=for-the-badge)](https://midnight.network/)
[![Compact](https://img.shields.io/badge/Compact-0.31.1-blue?style=for-the-badge)](https://docs.midnight.network/)
[![License](https://img.shields.io/badge/License-Apache--2.0-green?style=for-the-badge)](LICENSE)
[![Wave 1](https://img.shields.io/badge/Buildathon-Wave%201-blue?style=for-the-badge)](https://akindo.io/)

</div>

---

## 🧬 Overview

**PrivateLab** is a privacy-preserving laboratory result verification prototype powered by **Midnight**.

For Wave 1, PrivateLab focuses on one laboratory parameter:

### Hemoglobin

Example:

- Private value: `13.2 g/dL`
- Required minimum: `12.0 g/dL`
- Verification result: **PASS**
- The verifier does not need to receive the actual `13.2 g/dL` value.

---

---

## Wave 1 Implementation Details

PrivateLab's Wave 1 implementation focuses on privacy-preserving verification of a single laboratory parameter: Hemoglobin.

### Compact Contract

The core circuit is:

`verifyHemoglobin(minimum)`

The patient's Hemoglobin value is provided through the private witness:

`getHemoglobin()`

The circuit verifies whether:

`hemoglobin >= minimum`

Only the verification outcome is disclosed using Midnight's `disclose()` mechanism.

### Privacy Example

A Hemoglobin result of 13.2 g/dL is represented as:

`132`

A required minimum of 12.0 g/dL is represented as:

`120`

The circuit evaluates:

`132 >= 120`

Result:

**PASS**

The underlying laboratory value does not need to be disclosed to the verifier.

### Midnight Integration

The project includes:

- Compact contract compilation
- Generated contract bindings
- Proving and verifying keys
- ZKIR artifacts
- Private witness implementation
- Midnight providers
- Private-state handling
- TypeScript application integration
- Local Midnight integration testing

The complete deployment and private verification flow has been successfully validated in the local Midnight development environment.

## Buildathon Compliance

- Midnight-related functionality was developed for PrivateLab.
- The Compact contract compiles successfully.
- The repository is public and licensed under Apache License 2.0.
- The repository includes the `midnightntwrk` topic.
- Wave 1 focuses on a concrete privacy-preserving verification use case.
- The project includes a pitch deck and demonstration materials.

## Current Status

The core PrivateLab privacy circuit and local Midnight integration are working.

Wave 1 intentionally avoids simulated transactions and unnecessary features. The implementation establishes the core privacy verification primitive before expanding to multiple laboratory parameters and verifiable health credentials.

## Roadmap

### Wave 2 — Multi-Result Verification

- Multiple laboratory parameters
- Combined private verification
- Expanded private result handling

### Wave 3 — Verifiable Health Credentials

- Privacy-preserving health credentials
- Consent-based verification
- Authorized verifier workflows

---

> **Verify the requirement, not the private result.**

## License

PrivateLab is released under the **Apache License 2.0**.

## Disclaimer

PrivateLab is a privacy-preserving verification prototype and not a medical diagnostic tool.



> PrivateLab is a privacy-preserving verification prototype and not a medical diagnostic tool.


> PrivateLab is a privacy-preserving verification prototype and not a medical diagnostic tool.

---

## Wave 1 Implementation Details

PrivateLab's Wave 1 implementation focuses on privacy-preserving verification of a single laboratory parameter: Hemoglobin.

### Compact Contract

The core circuit is:

`verifyHemoglobin(minimum)`

The patient's Hemoglobin value is provided through the private witness:

`getHemoglobin()`

The circuit verifies whether:

`hemoglobin >= minimum`

Only the verification outcome is disclosed using Midnight's `disclose()` mechanism.

### Privacy Example

A Hemoglobin result of 13.2 g/dL is represented as:

`132`

A required minimum of 12.0 g/dL is represented as:

`120`

The circuit evaluates:

`132 >= 120`

Result:

**PASS**

The underlying laboratory value does not need to be disclosed to the verifier.

### Midnight Integration

The project includes:

- Compact contract compilation
- Generated contract bindings
- Proving and verifying keys
- ZKIR artifacts
- Private witness implementation
- Midnight providers
- Private-state handling
- TypeScript application integration
- Local Midnight integration testing

The complete deployment and private verification flow has been successfully validated in the local Midnight development environment.

## Buildathon Compliance

- Midnight-related functionality was developed for PrivateLab.
- The Compact contract compiles successfully.
- The repository is public and licensed under Apache License 2.0.
- The repository includes the `midnightntwrk` topic.
- Wave 1 focuses on a concrete privacy-preserving verification use case.
- The project includes a pitch deck and demonstration materials.

## Current Status

The core PrivateLab privacy circuit and local Midnight integration are working.

Wave 1 intentionally avoids simulated transactions and unnecessary features. The implementation establishes the core privacy verification primitive before expanding to multiple laboratory parameters and verifiable health credentials.

## Roadmap

### Wave 2 — Multi-Result Verification

- Multiple laboratory parameters
- Combined private verification
- Expanded private result handling

### Wave 3 — Verifiable Health Credentials

- Privacy-preserving health credentials
- Consent-based verification
- Authorized verifier workflows

---

> **Verify the requirement, not the private result.**

## License

PrivateLab is released under the **Apache License 2.0**.

## Disclaimer

PrivateLab is a privacy-preserving verification prototype and not a medical diagnostic tool.

