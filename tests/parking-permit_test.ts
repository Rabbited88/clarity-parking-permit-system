import {
    Clarinet,
    Tx,
    Chain,
    Account,
    types
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Test permit issuance with history",
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
                'get-permit-history',
                [types.uint(1)],
                deployer.address
            )
        ]);
        
        block.receipts[0].result.expectOk().expectUint(1);
        const history = block.receipts[1].result.expectOk().expectTuple();
        assertEquals(history['previous-owners'].length, 1);
    }
});

// [Previous test cases remain unchanged]
