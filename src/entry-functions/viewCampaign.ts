import { InputViewFunctionData } from "@aptos-labs/ts-sdk";

const CAMPAIGN_ACCOUNT = "0x525c21051cef420a04407311b913cadbbfc365a48d679bef71c4c2fb016d47dd";
const MODULE = "Campaign";

export const viewModuleFunction = (): InputViewFunctionData => {
    return {
        function: `${CAMPAIGN_ACCOUNT}::${MODULE}::get_all_campaign`,
        typeArguments: [],
        functionArguments: []
    };
};
