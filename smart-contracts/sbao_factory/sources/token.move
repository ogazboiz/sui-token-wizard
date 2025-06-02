module sbao_factory::token;

use std::string::{Self, String};
use sui::balance::Balance;
use sui::coin::{Self, TreasuryCap};
use sui::token::{Self, Token, TokenPolicy, TokenPolicyCap, ActionRequest};

public struct TOKEN has drop {}

public struct Spend has drop {}

fun init(otw: TOKEN, ctx: &mut TxContext) {
    let (treasury_cap, metadata) = coin::create_currency(
        otw,
        6,
        b"SBAO symbol",
        b"SBAO name",
        b"SBAO description",
        option::none(),
        ctx,
    );

    transfer::public_freeze_object(metadata);
    transfer::public_transfer(treasury_cap, tx_context::sender(ctx));
}

/// `Mint` is available to the holder of the `TreasuryCap` by default and hence does not need to be confirmed
/// `transfer` action however does require a confirmation and can be confirmed with `TreasuryCap`
#[allow(lint(self_transfer))]
public entry fun mint(
    treasury_cap: &mut TreasuryCap<TOKEN>,
    amount: u64,
    recipient: address,
    ctx: &mut TxContext,
) {
    let token = token::mint(treasury_cap, amount, ctx);
    let request: ActionRequest<TOKEN> = token::transfer(token, recipient, ctx);
    token::confirm_with_treasury_cap(treasury_cap, request, ctx);
    // transfer::public_transfer(token, recipient);
    // token
}

public entry fun burn(treasury_cap: &mut TreasuryCap<TOKEN>, coin: Token<TOKEN>) {
    token::burn(treasury_cap, coin);
}

/// create new policy
#[allow(lint(self_transfer))]
public entry fun new_policy(treasury_cap: &TreasuryCap<TOKEN>, ctx: &mut TxContext) {
    let (policy, policy_cap) = token::new_policy(treasury_cap, ctx);
    token::share_policy(policy);
    transfer::public_transfer(policy_cap, tx_context::sender(ctx));
}

public fun create_action_request(
    name: String,
    amount: u64,
    recipient: Option<address>,
    spent_balance: Option<Balance<TOKEN>>,
    ctx: &mut TxContext,
): ActionRequest<TOKEN> {
    token::new_request(name, amount, recipient, spent_balance, ctx)
}

/// add rule for action, constrain spend (share policy after?)
public entry fun add_rule_for_action(
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

public entry fun allow(
    policy: &mut TokenPolicy<TOKEN>,
    policy_cap: &TokenPolicyCap<TOKEN>,
    action: string::String,
    ctx: &mut TxContext,
) {
    token::allow(policy, policy_cap, action, ctx);
}

/// `spend` action
/// does require a confirmation and can be confirmed with `TreasuryCap`
public entry fun spend(treasury_cap: &mut TreasuryCap<TOKEN>, token: Token<TOKEN>, ctx: &mut TxContext) {
    let request = token::spend(token, ctx);
    token::confirm_with_treasury_cap(treasury_cap, request, ctx);
}
