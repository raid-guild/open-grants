export const AppSettings = Object.freeze({
    localStorage_keys: {
        userEthAddress: 'userEthAddress',
        currentNetwork: 'currentNetwork',
        userSign: 'userSign',
        nouce: 'nouce'
    },
    firebaseConfig: {
        apiKey: "AIzaSyBd8SxIrn4VBHIOOYI8yxPNlMhHczJkM0Q",
        authDomain: "grants-platform.firebaseapp.com",
        databaseURL: "https://grants-platform.firebaseio.com",
        storageBucket: "grants-platform.appspot.com",
        projectId: "grants-platform",
    },
    ethersConfig: {
        networks: 'ropsten',
        gasLimit: 6e6,
        apiToken: "6KK5NG3BDH1QEVDE2WIMQA7AD3J691QHBV",
        factoryContract: '0x6cec1dc945ac2ddf852993403d0aab39f03b3bad',
        privateKey: "0x0123456789012345678901234567890123456789012345678901234567890123",
        rpcURL: "https://ropsten.infura.io/v3/56a56ec009b34e31b6aeb4eb817f0772"
    }
});