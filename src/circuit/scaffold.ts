import { Halo2Wasm } from "@axiom-crypto/halo2-wasm/web";
import { getKzgParams } from "../kzg";
import { CircuitConfig, DEFAULT_CIRCUIT_CONFIG } from "./types";

export class CircuitScaffold {
    protected halo2wasm!: Halo2Wasm;
    protected config: CircuitConfig;
    protected shouldTime: boolean;
    protected proof: Uint8Array | null = null;
    protected loadedVk: boolean;

    constructor(halo2wasm: Halo2Wasm | null, options?: { config?: CircuitConfig, shouldTime?: boolean }) {
        if (halo2wasm) this.halo2wasm = halo2wasm;
        this.config = options?.config ?? DEFAULT_CIRCUIT_CONFIG;
        this.shouldTime = options?.shouldTime ?? false;
        this.loadedVk = false;
    }

    protected timeStart(name: string) {
        if (this.shouldTime) console.time(name);
    }

    protected timeEnd(name: string) {
        if (this.shouldTime) console.timeEnd(name);
    }

    newCircuitFromConfig(config: CircuitConfig) {
        this.config = config;
        this.halo2wasm.config(config);
    }

    async loadParamsAndVk(vk: Uint8Array) {
        const kzgParams = await getKzgParams(this.config.k);
        this.halo2wasm.load_params(kzgParams);
        this.halo2wasm.load_vk(vk);
        this.loadedVk = true;
    }

    mock() {
        this.timeStart("Mock proving")
        this.halo2wasm.mock()
        this.timeEnd("Mock proving")
    }

    async keygen() {
        const kzgParams = await getKzgParams(this.config.k);
        this.halo2wasm.load_params(kzgParams);
        this.timeStart("VK generation")
        this.halo2wasm.gen_vk();
        this.timeEnd("VK generation")
        this.timeStart("PK generation")
        this.halo2wasm.gen_pk();
        this.timeEnd("PK generation")
    }

    prove() {
        if (this.loadedVk) {
            this.timeStart("PK generation");
            this.halo2wasm.gen_pk();
            this.timeEnd("PK generation");
        }
        this.timeStart("SNARK proof generation")
        let proof = this.halo2wasm.prove();
        this.timeEnd("SNARK proof generation")
        this.proof = proof;
        return proof;
    }

    verify(proof: Uint8Array) {
        this.timeStart("Verify SNARK proof")
        this.halo2wasm.verify(proof);
        this.timeEnd("Verify SNARK proof")
    }

    getInstances(): string[] {
        return this.halo2wasm.get_instance_values(0);
    }

    getCircuitStats() {
        return this.halo2wasm.get_circuit_stats();
    }
}