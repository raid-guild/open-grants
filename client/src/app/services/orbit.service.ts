import { Injectable } from '@angular/core';
import * as IPFS from 'ipfs';
import * as OrbitDB from 'orbit-db';
import * as Identities from 'orbit-db-identity-provider';

declare let require: any;
declare let window: any;

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

  dbAddress = "/orbitdb/zdpuAtEjthqQry5YzXcQYNVPF659reiacB6xXPwLHkJ6STKZB/grant";
  ipfs: any;
  orbitdb: any;
  db: any;
  dbReady = false;

  grants = [];

  constructor() {

    // Create IPFS instance
    this.ipfs = new IPFS({
      //repo: '/orbitdb/examples/browser/new/ipfs/0.27.3',
      repo: 'ipfs-' + Math.random(),
      start: true,
      relay: { enabled: true, hop: { enabled: true } },
      EXPERIMENTAL: {
        pubsub: true,
        dht: true
      },
      config: {
        Addresses: { Swarm: ['/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'] }
        // Addresses: {
        //   Swarm: [
        //     // Use IPFS dev signal server
        //     // '/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star',
        //     '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
        //     // Use local signal server
        //     // '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star',
        //     "/ip4/107.170.133.32/tcp/4001/ipfs/QmUZRGLhcKXF1JyuaHgKm23LvqcoMYwtb9jmh8CkP4og3K",
        //     "/ip4/139.59.174.197/tcp/4001/ipfs/QmZfTbnpvPwxCjpCG3CXJ7pfexgkBZ2kgChAiRJrTK1HsM",
        //     "/ip4/139.59.6.222/tcp/4001/ipfs/QmRDcEDK9gSViAevCHiE6ghkaBCU7rTuQj4BDpmCzRvRYg",
        //     "/ip4/46.101.198.170/tcp/4001/ipfs/QmePWxsFT9wY3QuukgVDB7XZpqdKhrqJTHTXU7ECLDWJqX",
        //     "/ip4/198.46.197.197/tcp/4001/ipfs/QmdXiwDtfKsfnZ6RwEcovoWsdpyEybmmRpVDXmpm5cpk2s",
        //     "/ip4/198.46.197.197/tcp/4002/ipfs/QmWAm7ZPLGTgofLXZgoAzEaNkYFPsaVKKGjWscE4Fbec9P"
        //   ]
        // },

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
      this.ipfs.swarm.disconnect('/dns4/node0.preload.ipfs.io/tcp/443/wss/ipfs/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic');
      this.ipfs.swarm.disconnect('/dns4/node1.preload.ipfs.io/tcp/443/wss/ipfs/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6');

      // Create the database.
      const identity = await Identities.createIdentity({ id: 'local-id' })

      console.log(`Connecting to DB ${this.dbAddress} waiting...`);
      this.orbitdb = await OrbitDB.createInstance(this.ipfs);
      console.log("orbitdb createInstance", this.orbitdb)

      this.db = await this.orbitdb.open("grant", {
        // If database doesn't exist, create it
        create: true,
        overwrite: true,
        // Load only the local version of the database,
        // don't load the latest from the network yet
        localOnly: false,
        type: 'keyvalue',
        write: ['*'],
      });

      console.log("db", this.db);

      this.db.events.on('ready', () => {
        console.log(`Database is ready!`)
      })

      // Load the latest local copy of the DB.
      await this.db.load();

      // Signal that the DB is ready for use.
      this.dbReady = true;

      //  Get grants
    });

  }

  handleError(e) {
    console.error(`Error with IPFS: `, e.stack)
  }

  async setData() {
    let id = Math.floor(Math.random() * 1000000);

    let value = {
      name: "grant name",
      discription: "grant discription"
    };

    let hash = await this.db.put(id, value);

    console.log(`Grant added to DB!`, hash)

    this.getGrants();
  }

  async getGrants() {
    this.grants = this.db.get('')
    console.log("grants", this.grants);
  }



}
