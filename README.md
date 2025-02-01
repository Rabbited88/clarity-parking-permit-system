# Digital Parking Permit System

A blockchain-based digital parking permit system that allows for:

- Issuing digital parking permits with specified zones and duration
- Permit validation and verification
- Permit transfers between users with complete ownership history
- Permit revocation by admin
- Tracking permit validity periods

Each permit contains:
- Owner address
- Valid until timestamp
- Parking zone
- Vehicle ID
- Complete ownership history with transfer timestamps

Built with Clarity for the Stacks blockchain.

## New Features
- Added permit ownership history tracking
- Each permit now maintains a list of previous owners with transfer timestamps
- Maximum of 10 ownership transfers per permit
- New read-only function to query permit history
