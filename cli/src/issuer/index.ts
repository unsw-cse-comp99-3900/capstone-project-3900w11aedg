#!/usr/bin/env ts-node

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { loadData, saveData } from '../../../lib/src/data.js';
import generateKeyPair from '../../../lib/src/key.js';
import generateDID from '../../../lib/src/generate-did.js';
import { signCredential } from '../../../lib/src/issuer/signing.js';
import config from './cli.config.json' assert { type: 'json' };

const rootDir = path.resolve(config.rootDir);

const program = new Command();
const didURL = path.join(rootDir, 'did.txt');
const keyPairURL = path.join(rootDir, 'keyPair.key');

program.name('issuer').description('UNSW Credential Issuance Tool').version('1.0.0');

program
  .command('sign <credential>')
  .description('Signs a credential')
  .action(async (credential: string) => {
    const { did, keyPair } = await loadData(didURL, keyPairURL);
    const credentialJSON = fs.readFileSync(__dirname + '/credentials/' + credential, 'utf8');
    const signedCredential = await signCredential(credentialJSON, keyPair, did);
    console.log(`Signed credential: ${JSON.stringify(signedCredential, null, 2)}`);
  });

program
  .command('create-key-pair')
  .description('Creates a new key pair')
  .action(async () => {
    try {
      const keyPair = await generateKeyPair({ id: 'https://www.unsw.edu.au/' });
      const publicKey = keyPair.publicKey.toString();
      const did = await generateDID(publicKey);
      saveData(didURL, keyPairURL, keyPair, did.id);
      console.log(`Key pair created.`);
      console.log(`Your DID: ${did.id}`);
    } catch (err) {
      console.error('Error creating key pair', err);
    }
  });

program.parse(process.argv);
