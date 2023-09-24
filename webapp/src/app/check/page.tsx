import LinkButton from "@/components/ui/LinkButton";
import Title from "@/components/ui/Title";
import { findFirstUniswapTx } from "@/lib/parseRecentTx";

interface PageProps {
  params: Params;
  searchParams: SearchParams;
}

interface Params {
  slug: string;
}

interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export default async function Check({ searchParams }: PageProps) {
  const address = searchParams?.address as string ?? "";
  
  // Find the user's uniswap transaction with the `Swap` event
  const uniswapTx = await findFirstUniswapTx(address);

  const renderNotEligible = () => {
    return (
      <>
        <div className="text-center">
          {"Sorry, we couldn't find a Swap event (swapping a token for a token that is not ETH) for this address after Goerli block 9000000."}
        </div>
        <LinkButton
          label="Go back"
          href="/"
        />
      </>
    )
  }

  const renderEligible = () => {
    // const log = uniswapTx?.log;
    // const txHash = log?.tx_hash;
    const txHash1 = uniswapTx.sale_txfer_event.log?.tx_hash;
    const txHash2 = uniswapTx.buy_event.log?.tx_hash;
    const blockNumber1 = uniswapTx.sale_txfer_event.log?.block_height;
    const blockNumber2 = uniswapTx.buy_event.log?.block_height;
    const logIdx1 = uniswapTx.sale_txfer_event?.logIdx;
    const logIdx2 = uniswapTx.buy_event?.logIdx;
    // console.log("logIdx->", logIdx)

    // if (!txHash || !blockNumber || (!logIdx && logIdx !== 0)) {
    //   return renderNotEligible();
    // }

    return (
      <>
        <div className="text-center">
          {"Congratulations! You're eligible for the UselessToken airdrop."}
        </div>
        <LinkButton
          label="Build Axiom proof params"
          href={"/claim?" + new URLSearchParams({
              address: address, txHash1: txHash1, txHash2: txHash2, blockNumber1: blockNumber1, blockNumber2: blockNumber2,
              logIdx1: logIdx1.toString(),
              logIdx2: logIdx2.toString(),
          })}
        />
      </>
    )
  }

  return (
    <>
      <Title>
        Check eligibility
      </Title>
      { uniswapTx !== null ? renderEligible() : renderNotEligible()}
    </>
  )
}