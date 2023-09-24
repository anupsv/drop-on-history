import { Halo2Lib, Halo2Data } from "@axiom-crypto/halo2-js";
import { CircuitInputs } from "./constants";

export const circuit = async (
  halo2Lib: Halo2Lib,
  halo2Data: Halo2Data,
  { txHash1, txHash2, logIdx2, logIdx1 }: CircuitInputs
) => {
  const { add, and, or, addToCallback, log } = halo2Lib;
  const { getReceipt, getTx } = halo2Data;
  // Mint (address _to, uint256 _tokenId)
  const eventSchema1 =
    "0x0f6798a560793a54c3bcfe86a93cde1e73087d944c0ea20544137d4121396885";

  // Transfer (index_topic_1 address from, index_topic_2 address to, index_topic_3 uint256 tokenId)
  const eventSchema2 =
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

  // specify and fetch the data you want Axiom to verify
  let receipt1 = getReceipt(txHash1);
  let receiptLog1 = receipt1.log(logIdx1); //get the log at index 2

  // get the topic at index 0 (event schema)
  let mintSchema = receiptLog1.topic(0, eventSchema1);

  // get the topic at index 1
  let mintTo = receiptLog1.topic(1, eventSchema1).toCircuitValue();

  // get the block number for receipt
  let blockNum1 = receipt1.blockNumber().toCircuitValue();

  // get the `to` field of the transaction
  let tx = getTx(txHash1);
  let txTo = tx.to().toCircuitValue();

  ////// Set schema 2

  let receipt2 = getReceipt(txHash2);
  let receiptLog2 = receipt2.log(logIdx2);
  let txSchema = receiptLog2.topic(0, eventSchema2);
  let sentTo = receiptLog2.topic(2, eventSchema2).toCircuitValue();
  let blockNum2 = receipt2.blockNumber().toCircuitValue();

  addToCallback(mintSchema);
  addToCallback(txSchema);
  addToCallback(mintTo);
  addToCallback(sentTo);
  addToCallback(blockNum1);
  addToCallback(blockNum2);
  addToCallback(txTo);

  log(mintSchema);
  log(mintTo);
  log(blockNum1);
  log(txTo);
};
