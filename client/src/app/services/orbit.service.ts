import { Injectable } from '@angular/core';
import * as IPFS from 'ipfs';
import * as OrbitDB from 'orbit-db';
import * as Store from 'orbit-db-store';
import { async } from '@angular/core/testing';
import { keccak256 } from 'ethers/utils';
// const IPFS = require('ipfs')
// const OrbitDB = require('orbit-db')
// const Store = require('orbit-db-store');
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

  orbitdb: any;

  constructor() {

    // Create IPFS instance
    const ipfs = new IPFS()
    ipfs.on('ready', async () => {
      this.orbitdb = await OrbitDB.createInstance(ipfs);
      // this.getData();
      // this.setData();
      // this.replicate();
    })

    // ipfs.on('ready', async () => {
    //   const orbitdb = await OrbitDB.createInstance(ipfs)
    //   console.log("orbitdb", orbitdb);
    //   console.log("orbitdb.identity.id", orbitdb.identity.id);
    //   const options = {
    //     // Give write access to everyonez
    //     accessController: {
    //       write: ['*']
    //     }
    //   }

    // const db1 = await orbitdb.keyvalue('/orbitdb/zdpuAqchjTEsoExUHaSmMePf2CMzjaP2UgaHTZxzxcuLUMstY/first-database', options)
    // console.log("db1", db1);
    // console.log("address", db1.address.toString())
    // // await db1.put('name', 'demo')
    // // await db1.put('fName', 'john', { pin: true })
    // // await db1.put('lName', 'doe', { pin: true })
    // await db1.close()

    // const db2 = await orbitdb.keyvalue('/orbitdb/zdpuAqchjTEsoExUHaSmMePf2CMzjaP2UgaHTZxzxcuLUMstY/first-database')
    // console.log("db2", db2);
    // await db2.load()
    // const name = db2.get('name')
    // const fname = db2.get('fName')
    // const lname = db2.get('lName')
    // console.log("name", name);
    // console.log("fname", fname);
    // console.log("lname", lname);
    // })
  }

  async setData() {
    const db = await this.orbitdb.docs('/orbitdb/zdpuAtYA3B4zYYaWKsWuLT46fFR8yP1fCWzZiqAXpKDqJyHgY/grant')
    // console.log("db", db.address.toString())

    const hash = await db.put({ _id: 'QmAwesomeIpfsHasm', name: 'grant', followers: 501 });

    const grants = db.get('')
    console.log("grants", grants);
    // await db.close()
  }

  async getData() {
    const db = await this.orbitdb.docs('/orbitdb/zdpuAtYA3B4zYYaWKsWuLT46fFR8yP1fCWzZiqAXpKDqJyHgY/grant')
    await db.load();
    const grants = db.get('')
    console.log("grants", grants);

    // const all = db.query((doc) => doc.followers > 500)
    // console.log("all", all)
  }



}
