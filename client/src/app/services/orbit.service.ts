import { Injectable } from '@angular/core';
import * as IPFS from 'ipfs';
import * as OrbitDB from 'orbit-db';
import { resolve } from 'url';
import { async } from 'rxjs/internal/scheduler/async';
// const IPFS = require('ipfs')
// const OrbitDB = require('orbit-db')
const Identities = require('orbit-db-identity-provider')

declare let require: any;
declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class OrbitService {
  ipfsOptions = {
    EXPERIMENTAL: {
      pubsub: true
    }
  }

  constructor() {

    (async () => {
    })();

    // Create IPFS instance
    const ipfs = new IPFS()
    ipfs.on('ready', async () => {
      const orbitdb = await OrbitDB.createInstance(ipfs)
      console.log("orbitdb", orbitdb);
      const options = {
        // Give write access to everyonez
        accessController: {
          write: ['*']
        }
      }

      const db = await orbitdb.keyvalue('first-database', options)
      console.log("db", db);
    })
  }

}
