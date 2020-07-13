import { Injectable } from '@angular/core';
import * as IPFS from 'ipfs';
import * as OrbitDB from 'orbit-db';
import * as Identities from 'orbit-db-identity-provider';
import { async } from '@angular/core/testing';

declare let require: any;
declare let window: any;


export interface IGrant {
  _id: number;
  name: string;
  description: string;
  image: string;
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrbitService {
  ipfsOptions = {
    EXPERIMENTAL: {
      pubsub: true
    },
  }

  accessOptions = {
    // Give write access to everyone
    accessController: {
      write: ['*']
    }
  }

  grantDbAddress = "orbitdb/zdpuAwDkuDG1Yekf35M4EFBGzg6VPjq6UQNyMWD5n5Whr4KKW/grant";
  ipfs: any;
  orbitdb: any;
  db: any;
  dbReady = false;

  grants = [];

  constructor() {

    // Create IPFS instance
    this.ipfs = new IPFS({
      //repo: '/orbitdb/examples/browser/new/ipfs/0.27.3',
      repo: 'ipfs-1',
      start: true,
      EXPERIMENTAL: {
        pubsub: true
      },
      config: {
        Addresses: {
          Swarm: [
            // Use IPFS dev signal server
            // '/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star',
            '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
            // Use local signal server
            // '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star',
            "/ip4/107.170.133.32/tcp/4001/ipfs/QmUZRGLhcKXF1JyuaHgKm23LvqcoMYwtb9jmh8CkP4og3K",
            "/ip4/139.59.174.197/tcp/4001/ipfs/QmZfTbnpvPwxCjpCG3CXJ7pfexgkBZ2kgChAiRJrTK1HsM",
            "/ip4/139.59.6.222/tcp/4001/ipfs/QmRDcEDK9gSViAevCHiE6ghkaBCU7rTuQj4BDpmCzRvRYg",
            "/ip4/46.101.198.170/tcp/4001/ipfs/QmePWxsFT9wY3QuukgVDB7XZpqdKhrqJTHTXU7ECLDWJqX",
            "/ip4/198.46.197.197/tcp/4001/ipfs/QmdXiwDtfKsfnZ6RwEcovoWsdpyEybmmRpVDXmpm5cpk2s",
            "/ip4/198.46.197.197/tcp/4002/ipfs/QmWAm7ZPLGTgofLXZgoAzEaNkYFPsaVKKGjWscE4Fbec9P"
          ]
        },

        //Bootstrap: [
        //  "/ip4/198.46.197.197/tcp/4001/ipfs/QmdXiwDtfKsfnZ6RwEcovoWsdpyEybmmRpVDXmpm5cpk2s",
        //  "/ip4/198.46.197.197/tcp/4002/ipfs/QmWAm7ZPLGTgofLXZgoAzEaNkYFPsaVKKGjWscE4Fbec9P"
        //]
      }
    })

    this.ipfs.on('error', (e) => this.handleError(e))

    this.ipfs.on('ready', async () => {
      console.log('IPFS is ready');

      // Disconnect from noisy peers
      // this.ipfs.swarm.disconnect('/dns4/node0.preload.ipfs.io/tcp/443/wss/ipfs/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic');
      // this.ipfs.swarm.disconnect('/dns4/node1.preload.ipfs.io/tcp/443/wss/ipfs/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6');

      console.log(`Connecting to DB ${this.grantDbAddress} waiting...`);
      this.orbitdb = await OrbitDB.createInstance(this.ipfs);
      console.log("orbitdb createInstance", this.orbitdb)

      // this.db = await this.orbitdb.open(this.grantDbAddress, {
      //   // If database doesn't exist, create it
      //   create: true,
      //   overwrite: false,
      //   // Load only the local version of the database,
      //   // don't load the latest from the network yet
      //   localOnly: false,
      //   type: 'docstore',
      //   write: ['*'],
      // });


      this.db = await this.orbitdb.docs(this.grantDbAddress, {
        accessController: {
          write: ['*']
        }
      })

      console.log("db", this.db);

      this.db.events.on('ready', () => {
        console.log(`Database is ready!`)
      })

      // Load the latest local copy of the DB.
      await this.db.load();

      // Signal that the DB is ready for use.
      this.dbReady = true;

      this.getGrants();

      this.db.events.on('replicated', (address) => {
        console.log(`DB just replicated with peer ${address}.`);
        this.getGrants();
      })
      //  Get grants
    });
  }

  handleError(e) {
    console.error(`Error with IPFS: `, e.stack)
  }

  async addGrant(data: IGrant) {
    // let value = {
    //   _id: id,
    //   name: "grant name",
    //   discription: "grant discription"
    // };

    await this.db.put(data);
    console.log(`Grant added to DB!`);
    return data;
  }

  async getGrants() {
    let grants = this.db.get('');
    console.log("grants", grants);
    return grants;
  }

  async getGrantsById(id: string) {
    console.log("id", id)
    let grants = this.db.get(id);
    return grants
  }

}
