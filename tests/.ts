import {
    Clarinet,
    Tx,
    Chain,
    Account,
    types
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Test permit issuance",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const user1 = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'parking-permit',
                'issue-permit',
                [
                    types.principal(user1.address),
                    types.uint(30),
                    types.ascii("ZONE-A"),
                    types.ascii("ABC123")
                ],
                deployer.address
            )
        ]);
        
        block.receipts[0].result.expectOk().expectUint(1);
    }
});

Clarinet.test({
    name: "Test permit validation",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const user1 = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'parking-permit',
                'issue-permit',
                [
                    types.principal(user1.address),
                    types.uint(30),
                    types.ascii("ZONE-A"),
                    types.ascii("ABC123")
                ],
                deployer.address
            ),
            Tx.contractCall(
                'parking-permit',
                'is-valid-permit',
                [types.uint(1)],
                deployer.address
            )
        ]);
        
        block.receipts[1].result.expectOk().expectBool(true);
    }
});

Clarinet.test({
    name: "Test permit transfer",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const user1 = accounts.get('wallet_1')!;
        const user2 = accounts.get('wallet_2')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'parking-permit',
                'issue-permit',
                [
                    types.principal(user1.address),
                    types.uint(30),
                    types.ascii("ZONE-A"),
                    types.ascii("ABC123")
                ],
                deployer.address
            ),
            Tx.contractCall(
                'parking-permit',
                'transfer-permit',
                [types.uint(1), types.principal(user2.address)],
                user1.address
            )
        ]);
        
        block.receipts[1].result.expectOk().expectBool(true);
    }
});
