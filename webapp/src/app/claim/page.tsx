import BuildComputeQuery from "@/components/claim/BuildComputeQuery";
import Title from "@/components/ui/Title";
import autoAirdropJson from '@/lib/abi/AutonomousAirdrop.json';

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

export default async function Claim({ searchParams }: PageProps) {
  const address = searchParams?.address as string ?? "";
  const txHash1 = searchParams?.txHash1 as string ?? "";
  const txHash2 = searchParams?.txHash2 as string ?? "";
  const blockNumber1 = searchParams?.blockNumber1 as string ?? "";
  const blockNumber2 = searchParams?.blockNumber2 as string ?? "";
  const logIdx1 = searchParams?.logIdx1 as string ?? "";
  const logIdx2 = searchParams?.logIdx2 as string ?? "";

  return (
    <>
      <Title>
        Claim airdrop
      </Title>
      <div className="text-center">
        Click the buttom below to claim your UselessToken airdrop. UselessToken is purely used for testing purposes and holds no financial or nonmonetary value.
      </div>
      <div className="flex flex-col gap-2 items-center">
        <BuildComputeQuery
          airdropAbi={autoAirdropJson.abi}
          address={address}
          txHash1={txHash1}
          txHash2={txHash2}
          blockNumber1={blockNumber1}
          blockNumber2={blockNumber2}
          logIdx1={logIdx1}
          logIdx2={logIdx2}
        />
      </div>
    </>
  )
}