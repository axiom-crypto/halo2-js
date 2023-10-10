import { Halo2Wasm, init_panic_hook, Halo2LibWasm } from "@axiom-crypto/halo2-wasm/js/halo2_wasm";

export const getHalo2Wasm = () => {
    init_panic_hook();
    const halo2wasm = new Halo2Wasm();
    return halo2wasm;
}

export const getHalo2LibWasm = (halo2wasm: Halo2Wasm) => {
    const halo2libwasm = new Halo2LibWasm(halo2wasm);
    return halo2libwasm;
}

export { Halo2Wasm, Halo2LibWasm };