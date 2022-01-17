class Storage {
    // eslint-disable-next-line no-useless-constructor
    constructor(options) {}

    // 
    _getInputData(data, options) {
        const _data = {
            data,
            keyInfo: Object.assign(options, {
                timestamp: new Date().getTime()
            })
        };

        return JSON.stringify(_data);
    }

    // 
    _getOutputData(data) {
        return JSON.parse(data);
    }

    // _key => { data, keyInfo }
    _getData(_key) {
        const _data = localStorage.getItem(_key);

        return this._getOutputData(_data);
    }

    // key
    _getKey(key) {
        return `__storage__${key}__`;
    }

    _remove(_key) {
        localStorage.removeItem(_key);
    }

    // 
    _isExpired(_key) {
        const { keyInfo } = this._getData(_key);
        const { expires, timestamp } = keyInfo;

        if (!expires) {
            return true;
        }

        return (
            timestamp + expires * 24 * 3600 * 1000 - new Date().getTime() < 0
        );
    }

    // 
    _isOnce(_key) {
        const { keyInfo } = this._getData(_key);
        const { isOnce } = keyInfo;

        return !!isOnce;
    }

    get(key) {
        const _key = this._getKey(key);
        const _data = this._getData(_key);

        if (!_data) {
            return null;
        }

        const isExpired = this._isExpired(_key);
        const isOnce = this._isOnce(_key);

        // _key
        if (isExpired || isOnce) {
            this._remove(_key);
        }

        return isExpired ? null : _data.data;
    }

    set(key, data, options = {}) {
        const _key = this._getKey(key);
        const _data = this._getInputData(data, options);

        localStorage.setItem(_key, _data);
    }

    remove(key) {
        const _key = this._getKey(key);

        this._remove(_key);
    }

    once(key, data, options = {}) {
        const _key = this._getKey(key);
        const _data = this._getInputData(
            data,
            Object.assign(options, {
                isOnce: true
            })
        );

        localStorage.setItem(_key, _data);
    }
}
const store = new Storage();
export default store;
