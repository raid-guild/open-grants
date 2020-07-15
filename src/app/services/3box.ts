export interface Threebox {
    public: KeyValueStore;
    private: KeyValueStore;
    close(): void;
    logout(): void;
  }
  
  export interface KeyValueStore {
    log(): Array<Object>;
    get(key: string): string;
    set(key: string, value: string): boolean;
    remove(key: string): boolean;
  }
  
  export interface BoxOptions {
    ipfsOptions: Object;
    orbitPath: string;
    consentCallback: Function;
  }
  
  export interface GetProfileOptions {
    ipfsOptions: Object;
    orbitPath: string;
    addressServer: string;
  }
  