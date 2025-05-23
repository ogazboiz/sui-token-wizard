module sbao_factory::token;

use sui::coin;
use sui::token;

public struct TOKEN has drop {}

public struct Spend has drop {}

public struct Token has key, store {
    id: UID,
}
//event ?
// public struct TokenMint has key {
//     id: UID,
//     mint_cap: u64,
// }

fun init(otw: TOKEN, ctx: &mut TxContext) {
    let (treasury_cap, metadata) = coin::create_currency(
        otw,
        6,
        b"SBAO",
        b"SBAO",
        b"SBAO",
        option::none(),
        ctx,
    );

    let (mut policy, policy_cap) = token::new_policy(&treasury_cap, ctx);

    // freely allow buy
    token::allow(&mut policy, &policy_cap, token::spend_action(), ctx);

    // constrain spend
    token::add_rule_for_action<TOKEN, Spend>(
        &mut policy,
        &policy_cap,
        token::spend_action(),
        ctx,
    );

    token::share_policy(policy);

    transfer::public_freeze_object(metadata);
    transfer::public_transfer(treasury_cap, tx_context::sender(ctx));
    transfer::public_transfer(policy_cap, tx_context::sender(ctx));
}














public fun mint(treasury_cap: &mut TreasuryCap<TOKEN>, amount: u64, ctx: &mut TxContext): Token<TOKEN> {
    token::mint(treasury_cap, amount, ctx)
}
//create ext func for ->
//mint
//transfer (requires confirmation)
//allow
//add rule for action (share policy after?)
//create new_policy
//create new_request
