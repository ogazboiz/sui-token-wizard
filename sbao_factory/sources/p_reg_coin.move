module sbao_factory::u_regulated_coin;

use sui::coin::{Self, TreasuryCap, Coin};
use sui::event;

public struct U_REGULATED_COIN has drop {}

public struct MintEvent has copy, drop {
    amount: u64,
    recipient: address,
}

public struct BurnEvent has copy, drop {
    amount: u64,
}

fun init(otw: U_REGULATED_COIN, ctx: &mut TxContext) {
    let (treasury_cap, deny_cap, meta_data) = coin::create_regulated_currency_v2(
        otw,
        5,
        b"RGCN",
        b"Regulated Coin",
        b"Example Regulated Coin",
        option::none(),
        false, // unpausable
        ctx,
    );

    let sender = tx_context::sender(ctx);
    transfer::public_transfer(treasury_cap, sender);
    transfer::public_transfer(deny_cap, sender);
    transfer::public_transfer(meta_data, sender);
}

public fun mint(
    treasury_cap: &mut TreasuryCap<U_REGULATED_COIN>,
    amount: u64,
    recipient: address,
    ctx: &mut TxContext,
) {
    let coin = coin::mint(treasury_cap, amount, ctx);
    event::emit(MintEvent { amount, recipient });
    transfer::public_transfer(coin, recipient)
}

public entry fun burn(
    treasury_cap: &mut TreasuryCap<U_REGULATED_COIN>,
    coin: Coin<U_REGULATED_COIN>,
) {
    let amount = coin::value(&coin);
    coin::burn(treasury_cap, coin);
    event::emit(BurnEvent { amount });
}
