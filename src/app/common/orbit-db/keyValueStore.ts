const Store = require('orbit-db-store');
const KeyValueIndex = require('./KeyValueIndex');

export class KeyValueStore extends Store {
    constructor(ipfs, identity, address, options) {
        Object.assign(options || {}, { Index: KeyValueIndex });
        super(ipfs, identity, address, options)
    }

    get(key) {
        return this._index.get(key);
    }

    set(key, data) {
        this.put(key, data);
    }

    put(key, data) {
        return this._addOperation({
            op: 'PUT',
            key: key,
            value: data,
            meta: {
                ts: new Date().getTime()
            }
        });
    }

    del(key) {
        return this._addOperation({
            op: 'DEL',
            key: key,
            value: null,
            meta: {
                ts: new Date().getTime()
            }
        });
    }
}