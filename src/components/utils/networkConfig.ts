import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";
import { testnetPackageId } from "./constants";


const { networkConfig, useNetworkVariable, useNetworkVariables } =
    createNetworkConfig({
        devnet: {
            url: getFullnodeUrl("devnet"),
            variables: {
                packageId: testnetPackageId,
            },
        },
        testnet: {
            url: getFullnodeUrl("testnet"),
            variables: {
                packageId: testnetPackageId,
            },
        },
        mainnet: {
            url: getFullnodeUrl("mainnet"),
            variables: {
                packageId: testnetPackageId,
            },
        },
    });

export { useNetworkVariable, useNetworkVariables, networkConfig };
