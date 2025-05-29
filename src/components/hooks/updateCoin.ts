import { bcs, fromHEX } from '@mysten/bcs';
import init, { deserialize, version, update_constants, update_identifiers, get_constants } from '@mysten/move-bytecode-template';
import { coinBytecodeHex, pRegBytecodeHex, tokenBytecodeHex, uRegBytecodeHex } from '../utils/constants';


const encodeText = (text: string): Uint8Array =>
    new TextEncoder().encode(text);

interface UpdateTokenResult {
    constants: Record<string, unknown>;
    initialBytes: Uint8Array;
    updatedBytes: Uint8Array;
}

export const useUpdateCoin = async (
    name: string,
    symbol: string,
    description: string,
    decimals: number
): Promise<UpdateTokenResult> => {
    try {
        const initialBytes = fromHEX(coinBytecodeHex);

        await init();
        // await init('path/to/move_binary_format_bg.wasm');

        deserialize(initialBytes);
        version(); // Optional: version check

        // update module name
        let updatedBytes = update_identifiers(initialBytes, {
            TEMPLATE: "MY_COIN",
            template: "my_coin",
        });

        // update decimals
        updatedBytes = update_constants(
            updatedBytes,
            bcs.u8().serialize(decimals).toBytes(),
            bcs.u8().serialize(2).toBytes(),
            'U8',
        );

        // update symbol
        updatedBytes = update_constants(
            updatedBytes,
            bcs.vector(bcs.u8()).serialize(encodeText(symbol)).toBytes(),
            bcs.vector(bcs.u8()).serialize(encodeText('MY')).toBytes(),
            'Vector(U8)',
        );

        // update name
        updatedBytes = update_constants(
            updatedBytes,
            bcs.vector(bcs.u8()).serialize(encodeText(name)).toBytes(),
            bcs.vector(bcs.u8()).serialize(encodeText('My Coin')).toBytes(),
            'Vector(U8)',
        );

        // update description
        updatedBytes = update_constants(
            updatedBytes,
            bcs.vector(bcs.u8()).serialize(encodeText(description)).toBytes(),
            bcs.vector(bcs.u8()).serialize(encodeText('My coin description')).toBytes(),
            'Vector(U8)',
        );

        const constants = get_constants(initialBytes);
        console.assert(updatedBytes !== initialBytes, 'Bytecode was not updated!');

        console.log({
            constants,
            initialBytes,
            updatedBytes,
        });
        return { constants, initialBytes, updatedBytes };
    } catch (err) {
        console.error('Error updating token:', err);
        throw err;
    }
};

export const useUpdatePRegCoin = async (
    name: string,
    symbol: string,
    description: string,
    decimals: number
): Promise<UpdateTokenResult> => {
    try {
        const initialBytes = fromHEX(pRegBytecodeHex);

        await init();

        deserialize(initialBytes);
        version();

        // module name
        let updatedBytes = update_identifiers(initialBytes, {
            TEMPLATE: "P_REGULATED_COIN",
            template: "p_regulated_coin",
        });

        // decimals
        updatedBytes = update_constants(
            updatedBytes,
            bcs.u8().serialize(decimals).toBytes(),
            bcs.u8().serialize(5).toBytes(),
            'U8',
        );

        // symbol
        updatedBytes = update_constants(
            updatedBytes,
            bcs.vector(bcs.u8()).serialize(encodeText(symbol)).toBytes(),
            bcs.vector(bcs.u8()).serialize(encodeText('RGCN')).toBytes(),
            'Vector(U8)',
        );

        // name
        updatedBytes = update_constants(
            updatedBytes,
            bcs.vector(bcs.u8()).serialize(encodeText(name)).toBytes(),
            bcs.vector(bcs.u8()).serialize(encodeText('Regulated Coin')).toBytes(),
            'Vector(U8)',
        );

        // description
        updatedBytes = update_constants(
            updatedBytes,
            bcs.vector(bcs.u8()).serialize(encodeText(description)).toBytes(),
            bcs.vector(bcs.u8()).serialize(encodeText('Example Regulated Coin')).toBytes(),
            'Vector(U8)',
        );

        const constants = get_constants(initialBytes);
        console.assert(updatedBytes !== initialBytes, 'Bytecode was not updated!');

        console.log({
            constants,
            initialBytes,
            updatedBytes,
        });
        return { constants, initialBytes, updatedBytes };
    } catch (err) {
        console.error('Error updating token:', err);
        throw err;
    }
};


export const useUpdateURegCoin = async (
    name: string,
    symbol: string,
    description: string,
    decimals: number
): Promise<UpdateTokenResult> => {
    try {
        const initialBytes = fromHEX(uRegBytecodeHex);

        await init();

        deserialize(initialBytes);
        version();

        // module name
        let updatedBytes = update_identifiers(initialBytes, {
            TEMPLATE: "MY_COIN",
            template: "my_coin",
        });

        // decimals
        updatedBytes = update_constants(
            updatedBytes,
            bcs.u8().serialize(decimals).toBytes(),
            bcs.u8().serialize(5).toBytes(),
            'U8',
        );

        // symbol
        updatedBytes = update_constants(
            updatedBytes,
            bcs.vector(bcs.u8()).serialize(encodeText(symbol)).toBytes(),
            bcs.vector(bcs.u8()).serialize(encodeText('RGCN')).toBytes(),
            'Vector(U8)',
        );

        // name
        updatedBytes = update_constants(
            updatedBytes,
            bcs.vector(bcs.u8()).serialize(encodeText(name)).toBytes(),
            bcs.vector(bcs.u8()).serialize(encodeText('Regulated Coin')).toBytes(),
            'Vector(U8)',
        );

        // description
        updatedBytes = update_constants(
            updatedBytes,
            bcs.vector(bcs.u8()).serialize(encodeText(description)).toBytes(),
            bcs.vector(bcs.u8()).serialize(encodeText('Example Regulated Coin')).toBytes(),
            'Vector(U8)',
        );

        const constants = get_constants(initialBytes);
        console.assert(updatedBytes !== initialBytes, 'Bytecode was not updated!');

        console.log({
            constants,
            initialBytes,
            updatedBytes,
        });
        return { constants, initialBytes, updatedBytes };
    } catch (err) {
        console.error('Error updating token:', err);
        throw err;
    }
};

export const useUpdateToken = async (
    name: string,
    symbol: string,
    description: string,
    decimals: number
): Promise<UpdateTokenResult> => {
    try {
        const initialBytes = fromHEX(tokenBytecodeHex);

        await init();

        deserialize(initialBytes);
        version();

        // module name
        let updatedBytes = update_identifiers(initialBytes, {
            TEMPLATE: "TOKEN",
            template: "token",
        });

        // decimals
        updatedBytes = update_constants(
            updatedBytes,
            bcs.u8().serialize(decimals).toBytes(),
            bcs.u8().serialize(6).toBytes(),
            'U8',
        );

        // symbol
        updatedBytes = update_constants(
            updatedBytes,
            bcs.vector(bcs.u8()).serialize(encodeText(symbol)).toBytes(),
            bcs.vector(bcs.u8()).serialize(encodeText('SBAO symbol')).toBytes(),
            'Vector(U8)',
        );

        // name
        updatedBytes = update_constants(
            updatedBytes,
            bcs.vector(bcs.u8()).serialize(encodeText(name)).toBytes(),
            bcs.vector(bcs.u8()).serialize(encodeText('SBAO name')).toBytes(),
            'Vector(U8)',
        );

        // description
        updatedBytes = update_constants(
            updatedBytes,
            bcs.vector(bcs.u8()).serialize(encodeText(description)).toBytes(),
            bcs.vector(bcs.u8()).serialize(encodeText('SBAO description')).toBytes(),
            'Vector(U8)',
        );

        const constants = get_constants(initialBytes);
        console.assert(updatedBytes !== initialBytes, 'Bytecode was not updated!');

        console.log({
            constants,
            initialBytes,
            updatedBytes,
        });
        return { constants, initialBytes, updatedBytes };
    } catch (err) {
        console.error('Error updating token:', err);
        throw err;
    }
};