module sbao_factory::token;

use std::string;
use sui::coin::{Self, TreasuryCap};
use sui::token::{Self, Token, TokenPolicy, TokenPolicyCap};

public struct TOKEN has drop {}

public struct Spend has drop {}

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

/// `Mint` is available to the holder of the `TreasuryCap` by default and
/// hence does not need to be confirmed
#[allow(lint(self_transfer))]
public fun mint(
    mut treasury_cap: TreasuryCap<TOKEN>,
    amount: u64,
    ctx: &mut TxContext,
): Token<TOKEN> {
    let token = token::mint(&mut treasury_cap, amount, ctx);
    transfer::public_transfer(treasury_cap, tx_context::sender(ctx));
    token
}

/// `transfer` action
/// does require a confirmation and can be confirmed with `TreasuryCap`
public fun transfer(
    treasury_cap: &mut TreasuryCap<TOKEN>,
    token: Token<TOKEN>,
    recipient: address,
    ctx: &mut TxContext,
) {
    let request = token::transfer(token, recipient, ctx);
    token::confirm_with_treasury_cap(treasury_cap, request, ctx);
}

/// `spend` action
/// does require a confirmation and can be confirmed with `TreasuryCap`
public fun spend(treasury_cap: &mut TreasuryCap<TOKEN>, token: Token<TOKEN>, ctx: &mut TxContext) {
    let request = token::spend(token, ctx);
    token::confirm_with_treasury_cap(treasury_cap, request, ctx);
}

/// create new policy
#[allow(lint(self_transfer))]
public fun new_policy(treasury_cap: &TreasuryCap<TOKEN>, ctx: &mut TxContext) {
    let (policy, policy_cap) = token::new_policy(treasury_cap, ctx);
    token::share_policy(policy);
    transfer::public_transfer(policy_cap, tx_context::sender(ctx));
}

//allow
public fun allow(
    policy: &mut TokenPolicy<TOKEN>,
    policy_cap: &TokenPolicyCap<TOKEN>,
    action: string::String,
    ctx: &mut TxContext,
) {
    token::allow(policy, policy_cap, action, ctx);
}

/// add rule for action, constrain spend (share policy after?)
public fun add_rule_for_action(
    policy: &mut TokenPolicy<TOKEN>,
    policy_cap: &TokenPolicyCap<TOKEN>,
    ctx: &mut TxContext,
) {
    token::add_rule_for_action<TOKEN, Spend>(
        policy,
        policy_cap,
        token::spend_action(),
        ctx,
    );
}
