import React from 'react';
import { useLocation } from 'react-router-dom';
import { dayjs } from '../Utilities/dayjs';
export const StorageMessageKey = 'ao-message';
class UtilsBase {
    DateRegEx = /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)[0-9]{2}/;
    NiNoRegEx = /([ACEHJLMOPRSWXY][A-CEGHJ-NPR-TW-Z]|B[A-CEHJ-NPR-TW-Z]|G[ACEGHJ-NPR-TW-Z]|[KT][A-CEGHJ-MPR-TW-Z]|N[A-CEGHJL-NPR-SW-Z]|Z[A-CEGHJ-NPR-TW-Y])[0-9]{6}[A-D ]/;
    /**
     * Unique id for the tab (openned browser tab)
     */
    TabIdKey;
    constructor() {
        this.TabIdKey = Math.random().toString(36).substring(2, 8);
    }
    /**
     * Get number from any type/value
     * @param num Value to get number
     */
    getNumber = (num) => {
        if (!num || num === '')
            return 0;
        if (typeof num === 'number')
            return isNaN(num) ? 0 : num;
        return this.getNumber(parseFloat(num.replaceAll(',', '')));
    };
    /**
     * Get formatted date in DD/MM/YYYY hh:mm A or DD/MM/YYYY
     * @param date Date to be formatted
     * @param emptyValue Value to return if date is empty or null
     * @param withTime Return date with time
     */
    getFormattedDate = (date, emptyValue, withTime, timeZone = 'Europe/London') => {
        if (!date || date === '')
            return emptyValue;
        const dt = typeof date === 'string' &&
            /^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4}|[0-9]{2})$/.test(date)
            ? dayjs(date, 'DD/MM/YYYY')
            : dayjs(date);
        return dt.isValid()
            ? withTime
                ? dt.tz(timeZone).format(`DD/MM/YYYY hh:mm A`)
                : dt.format(`DD/MM/YYYY`)
            : emptyValue;
    };
    /**
     * Get formatted number
     * @param number Number to format
     * @param decimalPlaces Number of decimal places
     * @param withComma Get number with separator
     * @param useDashForZero Use dash for zero
     * @param withCurrency Prepend £ before number
     */
    getFormattedNumber = (number, decimalPlaces = 2, withComma = true, useDashForZero = false, withCurrency = false) => {
        if (isNaN(number))
            number = 0;
        if (useDashForZero && (!number || number === '' || number === 0 || number === '0'))
            return '-';
        var isNegative = false;
        if (number < 0) {
            isNegative = true;
            number = Math.abs(number);
        }
        var t = parseFloat(number)
            .toFixed(decimalPlaces !== null && decimalPlaces !== undefined ? decimalPlaces : 2)
            .split('.');
        var str = number;
        if (t.length >= 1) {
            str = '';
            //var r = t[0].slice('');
            var r = t[0].slice(0);
            for (var i = r.length - 1, j = 1; i >= 0; i--, j++) {
                str = r[i] + str;
                if (withComma && j % 3 === 0 && i > 0)
                    str = ',' + str;
            }
            if (t.length > 1)
                str += '.' + t[1];
        }
        return (withCurrency ? '£' : '') + (isNegative ? `(${str})` : str);
    };
    /**
     * Get formatted number
     * @param number Number to format
     * @param useDashForZero Use dash for zero
     */
    getFormattedCurrency = (number, useDashForZero = false) => this.getFormattedNumber(number, 2, true, useDashForZero, true);
    /**
     * Append zero if number is less then 10
     * @param num Number to check
     */
    appendZero = (num) => (num < 10 ? `0${num}` : num);
    /**
     * Get formatted time (MM:SS)
     * @param seconds Seconds - to get time
     * @param minutes Minutes - to get time
     */
    getFormattedTime = (seconds, minutes = 0) => {
        const dateTime = new Date(0, 0, 0, 0, minutes, seconds, 0), dateTimeM = this.appendZero(dateTime.getMinutes()), dateTimeS = this.appendZero(dateTime.getSeconds());
        return `${dateTimeM}:${dateTimeS}`;
    };
    /**
     * Get formatted time from total seconds
     * @param seconds Total seconds to calculate hours and minutes
     * @param ignoreSeconds Skip seconds in output string
     */
    getFormattedSeconds = (seconds, ignoreSeconds) => {
        if (seconds > 0) {
            var hours = Math.floor(seconds / 3600);
            seconds %= 3600;
            var minutes = Math.floor(seconds / 60);
            seconds = Math.floor(seconds % 60);
            return (`${this.appendZero(hours)}:${this.appendZero(minutes)}` +
                (ignoreSeconds ? '' : `:${this.appendZero(seconds)}`));
        }
        return '-';
    };
    /**
     * Get a property value from local storage
     * @param {string} Key name to find the value
     */
    getLocal = (key) => {
        const data = localStorage.getItem(key);
        if (data)
            return JSON.parse(data);
        return null;
    };
    /**
     * Set a property with value to local storage
     * @param {string} Key name to find the value
     * @param {any} data Data/value to be stored
     */
    setLocal = (key, data) => {
        localStorage.setItem(key, data ? JSON.stringify(data, this.jsonReplacer) : '');
    };
    /**
     * Remove a property with value from local storage
     * @param {string} Key name to find the value
     */
    removeLocal = (key) => {
        localStorage.removeItem(key);
    };
    /**
     * Get a property value from session storage
     * @param {string} Key name to find the value
     */
    getSession = (key) => {
        const data = sessionStorage.getItem(key);
        if (data)
            return JSON.parse(data);
        return null;
    };
    /**
     * Set a property with value to session storage
     * @param {string} Key name to find the value
     * @param {any} data Data/value to be stored
     */
    setSession = (key, data) => {
        sessionStorage.setItem(key, data ? JSON.stringify(data, this.jsonReplacer) : '');
    };
    jsonReplacer = (key, value) => {
        if (value === null)
            return undefined;
        if (value === false)
            return undefined;
        return value;
    };
    /**
     * Get file size in kb/mb/gb etc.
     * @param {number} size File lenth/size
     */
    getFileSize = (size) => {
        var selectedSize = 0;
        var selectedUnit = 'b';
        if (size > 0) {
            var units = ['tb', 'gb', 'mb', 'kb', 'b'];
            for (var i = 0; i < units.length; i++) {
                var unit = units[i];
                var cutoff = Math.pow(1000, 4 - i) / 10;
                if (size >= cutoff) {
                    selectedSize = size / Math.pow(1000, 4 - i);
                    selectedUnit = unit;
                    break;
                }
            }
            selectedSize = Math.round(10 * selectedSize) / 10; // Cutting of digits
        }
        return `${selectedSize} ${selectedUnit.toUpperCase()}`;
    };
    /**
     * A custom hook that builds on useLocation to parse the query string for you.
     */
    useQuery = () => new URLSearchParams(useLocation().search);
    /**
     * Sum number array
     * @param {number[]} arr Number array
     */
    sumArray = (arr) => arr.reduce((a, b) => a + b);
    /**
     * Get sorted array by property
     * @param {any[]} arr Array of objects
     * @param {string} key Property/field name to sort
     * @returns {any[]}
     */
    sortArray(arr, key) {
        return arr.sort((a, b) => {
            if (a[key] < b[key]) {
                return -1;
            }
            if (a[key] > b[key]) {
                return 1;
            }
            return 0;
        });
    }
    /**
     * Replace an item in array with index
     * @param arr Array of objects
     * @param index Index where to replace the item
     * @param newValue New item to be replaced with
     * @returns Array of objects
     */
    replaceItemAtIndex(arr, index, newValue) {
        return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
    }
    /**
     * Remove an item from array with index
     * @param arr Array of objects
     * @param index Index which item to be removed
     * @returns Array of object
     */
    removeItemAtIndex(arr, index) {
        return [...arr.slice(0, index), ...arr.slice(index + 1)];
    }
    /**
     * Capitalize the words of a string
     * @param {string} value String or value to be capitalized
     * @param {boolean} lower To lowercase other chars
     */
    capitalize = (value, lower = false) => value
        ? (lower ? value.toLowerCase() : value).replace(/(?:^|\s)\S/g, (a) => a.toUpperCase())
        : '';
    /**
     * Validate current MongoDB ObjectId
     * @param id Id to check for ObjectId
     */
    isValidObjectId = (id) => (id && /^[a-fA-F0-9]{24}$/i.test(id) ? true : false);
    /**
     * Set a property with value to local storage and then remove imidiatly, it is usefull to send message to all opened tabs
     * @param {string} Key name to find the value
     * @param {any} data Data/value to be stored
     */
    sendMessageToAllTabs = (type, data) => {
        const message = {
            type,
            t: this.TabIdKey,
            domain: window.location.hostname,
            ...data,
        };
        localStorage.setItem(StorageMessageKey, JSON.stringify(message));
        localStorage.removeItem(StorageMessageKey);
    };
    /**
     * Check and get new event message, from event object
     * @param {StorageEvent} event Event object received in storage event listener
     */
    getStorageMessage = (event) => {
        if (event.key === StorageMessageKey && event.newValue) {
            const message = JSON.parse(event.newValue);
            if (message && message.t !== Utils.TabIdKey && message.domain === window.location.hostname) {
                return message;
            }
        }
        return null;
    };
    /**
     * Assign value to an object by key/path name
     * @param obj Object to assign value to
     * @param path key full path
     * @param val value to be assigned
     * @param separator Path separator
     */
    setNestedKeyValue = (obj, path, val, separator = '.') => {
        const keys = path.split(separator);
        const lastKey = keys.pop();
        const lastObj = keys.reduce((obj, key) => (obj[key] = obj[key] || {}), obj);
        lastObj[lastKey] = val;
    };
    /**
     * Get comma separated address string
     * @param address address object to be converted
     */
    getAddressString = (address, emptyString = '') => {
        if (address) {
            return ([
                address.building,
                address.street,
                address.city,
                address.county,
                address.postcode,
                address.country,
            ]
                .filter((v) => v && v.length > 0)
                .join(', ') || emptyString);
        }
        return emptyString;
    };
    /**
     * Get new random UUID
     * @returns {string}
     */
    uuid = () => {
        let u = '', m = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx', i = 0, rb = (Math.random() * 0xffffffff) | 0;
        while (i++ < 36) {
            var c = m[i - 1], r = rb & 0xf, v = c == 'x' ? r : (r & 0x3) | 0x8;
            u += c == '-' || c == '4' ? c : v.toString(16);
            rb = i % 8 == 0 ? (Math.random() * 0xffffffff) | 0 : rb >> 4;
        }
        return u;
    };
}
export const Utils = new UtilsBase();
export function useIsMountedRef() {
    const isMountedRef = React.useRef(null);
    React.useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    });
    return isMountedRef;
}
