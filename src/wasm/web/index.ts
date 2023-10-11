import init, { initThreadPool, init_panic_hook, Halo2Wasm, Halo2LibWasm } from "@axiom-crypto/halo2-wasm/web";

export const getHalo2Wasm = async (numThreads: number) => {
    await init();
    init_panic_hook();
    await initThreadPool(numThreads);
    const halo2wasm = new Halo2Wasm();
    return halo2wasm;
}

export const getHalo2LibWasm = (halo2wasm: Halo2Wasm) => {
    const halo2libwasm = new Halo2LibWasm(halo2wasm);
    return halo2libwasm;
}

export { Halo2Wasm, Halo2LibWasm };
