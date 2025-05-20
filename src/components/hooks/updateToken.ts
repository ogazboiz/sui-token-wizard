import { bcs, fromHEX } from '@mysten/bcs';
import init, { deserialize, version, update_constants, update_identifiers, get_constants } from '@mysten/move-bytecode-template';
// import url from '@mysten/move-bytecode-template/move_bytecode_template_bg.wasm?url';
// import bytecodeUrl from '/my_coin.mv?url';

// const fetchBytecode = async (): Promise<Uint8Array> => {
//     try {
//         const res = await fetch(bytecodeUrl);
//         if (!res.ok) throw new Error(`Failed to fetch bytecode: ${res.statusText}`);
//         return new Uint8Array(await res.arrayBuffer());
//     } catch (err) {
//         console.error('Error fetching bytecode:', err);
//         throw err;
//     }
// };

const encodeText = (text: string): Uint8Array =>
    new TextEncoder().encode(text);

interface UpdateTokenResult {
    constants: any;
    initialBytes: Uint8Array;
    updatedBytes: Uint8Array;
}

export const useUpdateToken = async (
    name: string,
    symbol: string,
    description: string,
    decimals: number
): Promise<UpdateTokenResult> => {
    try {
        const initialBytes = fromHEX('a11ceb0b060000000a01000e020e2c033a44047e140592019e0107b002f90108a90460068905270ab005110cc1056100120114020b020f0219021a021b00030200000403000000030001050701000002010c01000102020c01000102060c010001050702000608070000100001000011020100000a030100011301060100020a16140100020c08090102021111120100021c15140100030e0b01010304150b01010c04160f01010c05180c0d0003050507090a0a0e060708130a100707040708170208000708070004070b06010800030507080702070b060108000b04010800020b050108000b06010800010808010b03010900010800070900020a020a020a020b03010808070807020b060109000b05010900010b05010800010900010608070105010b0601080002090005010b0401080003070b0601090003070807010b04010900010801010301060b0401090002070b060109000b04010900010802094275726e4576656e7404436f696e0c436f696e4d65746164617461074d595f434f494e094d696e744576656e74064f7074696f6e0b5472656173757279436170095478436f6e746578740355726c06616d6f756e74046275726e04636f696e0f6372656174655f63757272656e63790b64756d6d795f6669656c6404656d6974056576656e7404696e6974046d696e74076d795f636f696e046e6f6e65066f7074696f6e147075626c69635f667265657a655f6f626a6563740f7075626c69635f7472616e7366657209726563697069656e740673656e646572087472616e736665720a74785f636f6e746578740375726c0576616c75650000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020a0203024d590a0208074d7920436f696e0a0213124d7920636f69206465736372697074696f6e0002010d010102020903170502020109030000000004120b00310207000701070238000a0138010c020c030b0238020b030b012e110b38030201010400100d0b000a010b0338040c040b010a02120138050b040b0238060202010400140b0e0138070c020b000b013808010b02120238090200');

        await init();
        // await init('path/to/move_binary_format_bg.wasm');

        deserialize(initialBytes);
        version(); // Optional: version check

        let updatedBytes = update_identifiers(initialBytes, {
            TEMPLATE: "MY_COIN",
            template: "my_coin",
        });

        updatedBytes = update_constants(
            updatedBytes,
            bcs.u8().serialize(decimals).toBytes(),
            bcs.u8().serialize(2).toBytes(),
            'U8',
        );

        updatedBytes = update_constants(
            updatedBytes,
            bcs.vector(bcs.u8()).serialize(encodeText(symbol)).toBytes(),
            bcs.vector(bcs.u8()).serialize(encodeText('MY')).toBytes(),
            'Vector(U8)',
        );

        updatedBytes = update_constants(
            updatedBytes,
            bcs.vector(bcs.u8()).serialize(encodeText(name)).toBytes(),
            bcs.vector(bcs.u8()).serialize(encodeText('My Coin')).toBytes(),
            'Vector(U8)',
        );

        updatedBytes = update_constants(
            updatedBytes,
            bcs.vector(bcs.u8()).serialize(encodeText(description)).toBytes(),
            bcs.vector(bcs.u8()).serialize(encodeText('My coi description')).toBytes(),
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
