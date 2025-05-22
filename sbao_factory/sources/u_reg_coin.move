module sbao_factory::u_regulated_coin;

use std::ascii;
use std::string;
use sui::coin::{Self, TreasuryCap, Coin, DenyCapV2, CoinMetadata};
use sui::deny_list::DenyList;
use sui::event;
use sui::url::Url;

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

public entry fun add_deny_list(
    deny_list: &mut DenyList,
    deny_cap: &mut DenyCapV2<U_REGULATED_COIN>,
    deny_addr: address,
    ctx: &mut TxContext,
) {
    coin::deny_list_v2_add(deny_list, deny_cap, deny_addr, ctx);
}

public entry fun remove_deny_list(
    deny_list: &mut DenyList,
    deny_cap: &mut DenyCapV2<U_REGULATED_COIN>,
    deny_addr: address,
    ctx: &mut TxContext,
) {
    coin::deny_list_v2_remove(deny_list, deny_cap, deny_addr, ctx);
}

public entry fun global_pause(
    deny_list: &mut DenyList,
    deny_cap: &mut DenyCapV2<U_REGULATED_COIN>,
    ctx: &mut TxContext,
) {
    coin::deny_list_v2_enable_global_pause(deny_list, deny_cap, ctx);
}

public entry fun global_unpause(
    deny_list: &mut DenyList,
    deny_cap: &mut DenyCapV2<U_REGULATED_COIN>,
    ctx: &mut TxContext,
) {
    coin::deny_list_v2_disable_global_pause(deny_list, deny_cap, ctx);
}

public entry fun get_decimals(metadata: &CoinMetadata<U_REGULATED_COIN>): u8 {
    coin::get_decimals(metadata)
}

public entry fun get_name(metadata: &CoinMetadata<U_REGULATED_COIN>): string::String {
    coin::get_name(metadata)
}

public entry fun get_symbol(metadata: &CoinMetadata<U_REGULATED_COIN>): ascii::String {
    coin::get_symbol(metadata)
}

public entry fun get_description(metadata: &CoinMetadata<U_REGULATED_COIN>): string::String {
    coin::get_description(metadata)
}

public entry fun get_supply(treasury_cap: &TreasuryCap<U_REGULATED_COIN>): u64 {
    coin::total_supply(treasury_cap)
}

public entry fun get_icon_url(metadata: &CoinMetadata<U_REGULATED_COIN>): Option<Url> {
    coin::get_icon_url(metadata)
}

public entry fun update_name(
    treasury_cap: &TreasuryCap<U_REGULATED_COIN>,
    metadata: &mut CoinMetadata<U_REGULATED_COIN>,
    name: string::String,
) {
    coin::update_name(treasury_cap, metadata, name)
}

public entry fun update_symbol(
    treasury_cap: &TreasuryCap<U_REGULATED_COIN>,
    metadata: &mut CoinMetadata<U_REGULATED_COIN>,
    symbol: ascii::String,
) {
    coin::update_symbol(treasury_cap, metadata, symbol)
}

public entry fun update_description(
    treasury_cap: &TreasuryCap<U_REGULATED_COIN>,
    metadata: &mut CoinMetadata<U_REGULATED_COIN>,
    description: string::String,
) {
    coin::update_description(treasury_cap, metadata, description)
}

public entry fun update_icon_url(
    treasury_cap: &TreasuryCap<U_REGULATED_COIN>,
    metadata: &mut CoinMetadata<U_REGULATED_COIN>,
    icon_url: ascii::String,
) {
    coin::update_icon_url(treasury_cap, metadata, icon_url)
}
