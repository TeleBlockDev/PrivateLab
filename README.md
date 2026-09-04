# PrivateLab

**Privacy-preserving laboratory result verification powered by Midnight.**

PrivateLab is a Wave 1 prototype that demonstrates how a patient can verify that a laboratory result meets a required condition without unnecessarily revealing the underlying medical value.

## Wave 1

The first implementation focuses on one laboratory parameter:

- Hemoglobin
- A minimum required value
- Privacy-preserving verification

The Compact contract contains the verification circuit:

`verifyHemoglobin`

The intended result is to reveal only whether the requirement is satisfied, rather than exposing the patient's actual hemoglobin value.

## Technology

- Midnight Compact
- Compact compiler 0.34.0
- Compact language 0.26.0
- Compact runtime 0.19.0

## Status

Wave 1 development in progress.

## License

Apache License 2.0
