import * as vc from '@digitalbazaar/vc';
import { DataIntegrityProof } from '@digitalbazaar/data-integrity';
import { createSignCryptosuite } from '@digitalbazaar/bbs-2023-cryptosuite';
import documentLoader from '../document-loader.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const signCredential = async (credential: any, keyPair: any) => {
  const suite = new DataIntegrityProof({
    signer: keyPair.signer(),
    date: new Date().toDateString(),
    cryptosuite: createSignCryptosuite({
      mandatoryPointers: ['/issuanceDate', '/issuer'],
    }),
  });

  return await vc.issue({
    credential,
    suite,
    documentLoader,
  });
};
