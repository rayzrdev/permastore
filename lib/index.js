
const XPDB = require('xpdb');
const Cashr = require('cashr');

class Permastore extends XPDB {
    /**
     * Creates a new Permastore
     * @param {string} path The path to the store
     * @param {CacheOptions} options The cache options
     * 
     * @memberof Permastore
     */
    constructor(path, settings = { timeoutDelay: 2 * 60 * 1000 }) {
        super(path);

        this._cache = new Cashr(settings)
    }

    /**
     * The internal cache
     * 
     * @type {Cashr}
     * 
     * @readonly
     * 
     * @memberof Permastore
     */
    get cache() {
        return this._cache;
    }

    /**
     * Retrieves a key from either the cache or from the DB
     * 
     * @param {any} key The key of the value you want to get
     * @param {XPDBGetOptions} options The options for XPDB.get
     * @returns {Promise<any>} A Promise of the value, or the default value (if provided), or undefined
     * 
     * @memberof Permastore
     */
    get(key, options = {}) {
        if (this.cache.has(key)) {
            return Promise.resolve(this.cache.get(key));
        }
        return super.get(key, options).then(value => this.cache.set(key, value));
    }

    /**
     * Sets a value at the given key
     * 
     * @param {string} key The key of the property to set
     * @param {any} value The value to set
     * @returns {Promise<undefined>} A Promise that resolves once the DB sets the value
     * 
     * @memberof Permastore
     */
    put(key, value) {
        this.cache.set(key, value);

        return super.put(key, value);
    }

    /**
     * Deletes a value from storage
     * 
     * @param {any} key The key of the value to delete
     * @returns {Promise<undefined>} A Promise that resolves once the DB deletes the value
     * 
     * @memberof Permastore
     */
    delete(key) {
        this.cache.delete(key);

        return super.delete();
    }
}

module.exports = Permastore;