"use client";

import { Constants } from "@/shared/constants";
import { AxiomV2Callback, AxiomV2ComputeQuery, BuiltQueryV2, QueryV2, bytes32, getFunctionSelector } from "@axiom-crypto/experimental";
import { useEffect, useRef, useState } from "react";
import { wrap, Remote } from "comlink";
import { Circuit } from "./worker";
import { convertToBytes, convertToBytes32 } from "@/lib/utils";
import { config, vk } from "@/lib/circuit/constants";
import ClaimAirdropClient from "./ClaimAirdropClient";
import { newAxiomV2 } from "@/lib/axiom";
import LoadingAnimation from "../ui/LoadingAnimation";

export default function BuildComputeQuery(
  { airdropAbi, address, txHash1, txHash2, blockNumber1, blockNumber2, logIdx1, logIdx2 }:{
    airdropAbi: any[],
    address: string,
    txHash1: string,
    txHash2: string,
    blockNumber1: string,
    blockNumber2: string,
    logIdx1: string,
    logIdx2: string,
  }
) {
  const [builtQuery, setBuiltQuery] = useState<BuiltQueryV2 | null>(null);
  const [payment, setPayment] = useState<string | null>(null);

  const workerApi = useRef<Remote<Circuit>>();

  useEffect(() => {

    const run = async () => {
      const setupWorker = async () => {
        console.log("setup worker start");
        const worker = new Worker(new URL("./worker", import.meta.url), { type: "module" });
        const Halo2Circuit = wrap<typeof Circuit>(worker);
        workerApi.current = await new Halo2Circuit("https://eth-goerli.g.alchemy.com/v2/JLBlHmi_gZ2Q8bEvbEN_pllNxX1-d6ge");
        await workerApi.current.setup(window.navigator.hardwareConcurrency);
        console.log("setup worker done");

      }
      await setupWorker();

      const build = async () => {
        console.log("setup build start");

        const circuitInputs = {
          txHash1,
          txHash2,
          logIdx1: Number(logIdx1),
          logIdx2: Number(logIdx2),
        };
        console.log("CircuitInputs", circuitInputs);
        await workerApi.current?.newCircuit();
        await workerApi.current?.buildCircuit(circuitInputs);

        console.log("setup build done");

      }

      const generateQuery = async () => {
        await build();
        await workerApi.current?.prove();

        const proof = await workerApi.current!.getProof();
        const publicInstances = await workerApi.current!.getCallbackData();
        const publicInstancesBytes = "0x" + publicInstances.map((instance) => instance.slice(2).padStart(64, "0")).join("");

        const compute: AxiomV2ComputeQuery = {
          k: config.k,
          vkey: convertToBytes32(new Uint8Array(vk)),
          computeProof: publicInstancesBytes + convertToBytes(proof),
        };

        const callback: AxiomV2Callback = {
          callbackAddr: Constants.AUTO_AIRDROP_ADDR as `0x${string}`,
          callbackFunctionSelector: getFunctionSelector("axiomV2Callback(uint64,address,bytes32,bytes32,bytes32[],bytes)"),
          resultLen: publicInstances.length / 2,
          callbackExtraData: bytes32(address as string),
        }

        const query = (newAxiomV2().query as QueryV2).new();
        query.setComputeQuery(compute);
        query.setCallback(callback);
        const builtQuery = await query.build();
        const payment = query.calculateFee();
        setBuiltQuery(builtQuery);
        setPayment(payment)
      }
      await generateQuery();
    }
    run();
  }, [address, blockNumber1, blockNumber2, logIdx1, logIdx2, txHash1, txHash2, setBuiltQuery, setPayment]);

  if (!builtQuery || !payment) {
    return(
      <div className="flex flex-row items-center font-mono gap-2">
        {"Building Query"} <LoadingAnimation />
      </div>
      );
  }

  return (
    <ClaimAirdropClient
      airdropAbi={airdropAbi}
      builtQuery={builtQuery}
      payment={payment}
    />
  )
}