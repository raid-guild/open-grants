import { Injectable } from '@angular/core';
import * as IPFS from 'ipfs';
import * as OrbitDB from 'orbit-db';

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
    const ipfs = new IPFS({
      repo: '/orbitdb/examples/browser/new/ipfs/0.33.1',
      start: true,
      preload: {
        enabled: false
      },
      EXPERIMENTAL: {
        pubsub: true,
      },
      config: {
        Addresses: {
          Swarm: [
            // Use IPFS dev signal server
            // '/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star',
            '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
            // Use local signal server
            // '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star',
          ]
        },
      }
    });

    ipfs.on('ready', async () => {
      this.orbitdb = await OrbitDB.createInstance(ipfs);
      // this.getData();
      // this.setData();
      // this.replicate();
    })
  }

  async setData() {
    const db = await this.orbitdb.docs('grant')
    // console.log("db", db.address.toString())

    let value = { _id: new Date().toISOString(), name: 'grant', followers: 501 };
    const hash = await db.put(value);

    const grants = db.get('')
    console.log("grants", grants);
    // await db.close()
  }

  async getData() {
    const db = await this.orbitdb.docs('grant')
    await db.load();
    const grants = db.get('')
    console.log("grants", grants);

    // const all = db.query((doc) => doc.followers > 500)
    // console.log("all", all)
  }



}
