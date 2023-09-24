import { Constants } from "@/shared/constants";

export async function findFirstUniswapTx(address: string): Promise<any | null> {
  let page = 0;
  let next = "";
  while (next !== null) {
    const res = await getRecentTxs(address, page++);
    const recentTx = res?.data?.items ?? [];

    let sale_txfer_event = {};
    let buy_event = {};

    for (const tx of recentTx) {
      const to = tx?.to_address ?? "";
      const from = tx?.from_address ?? "";
      if (tx.block_height < Constants.ELIGIBLE_BLOCK_HEIGHT) {
        continue;
      }

      // first get the fact that the NFT was sold/sent to someone else.
      if (to.toLowerCase() === "0x932Ca55B9Ef0b3094E8Fa82435b3b4c50d713043".toLowerCase()) {
        if (tx?.log_events?.length > 0) {
          for (const [idx, log] of tx.log_events.entries()) {
            if (log?.raw_log_topics?.[0] === "0x0f6798a560793a54c3bcfe86a93cde1e73087d944c0ea20544137d4121396885".toLowerCase()) {
              if (JSON.stringify(sale_txfer_event) === '{}'){
                sale_txfer_event = {
                  logIdx: idx,
                  log
                };
                console.log("found the event 1", sale_txfer_event);
              }
            }

            if (log?.raw_log_topics?.[0] === Constants.EVENT_SCHEMA) {
              if (JSON.stringify(buy_event) === '{}'){
                buy_event = {
                  logIdx: idx,
                  log
                };
                console.log("found the event 2", buy_event);
              }
            }
          }
        }
      }
    }

    if (sale_txfer_event && buy_event) {
      return {
        "sale_txfer_event": sale_txfer_event,
        "buy_event": buy_event
      }
    }

    next = res?.data?.links?.next ?? null;
  }
  console.log("could not find any Swap transaction");
  return null;
}

async function getRecentTxs(address: string, page: number) {
  let headers = new Headers();
  headers.set('Authorization', `Bearer cqt_rQRvbhTRMbMv3bJbJYq3p4XBQgpJ`);

  const covalentUri = `${Constants.COVALENT_BASE_URI}/eth-goerli/address/0x08fB551f86d937439be7fa8E96178Fc0Df9Ac227/transactions_v3/page/${page}/`;
  const res = await fetch(covalentUri, {
    method: 'GET', 
    headers: headers
  });
  const json = await res.json();
  return json;
}