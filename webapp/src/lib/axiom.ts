import { Axiom } from '@axiom-crypto/experimental';

export const newAxiomV2 = (): Axiom => {
  const axiom = new Axiom({
    providerUri: "https://eth-goerli.g.alchemy.com/v2/JLBlHmi_gZ2Q8bEvbEN_pllNxX1-d6ge",
    version: "v2",
    chainId: 5,
  });
  return axiom;
}