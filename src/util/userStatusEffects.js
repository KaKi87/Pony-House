import { App } from '@capacitor/app';
import initMatrix from '../client/initMatrix';
import { emitUpdateProfile } from '../client/action/navigation';
import tinyAPI from './mods';
import { countObj } from './tools';
import moment from './libs/momentjs';

// Cache Data
const userInteractions = {

    enabled: false,
    mobile: {
        isActive: true,
    },

    vc: {
        isActive: false,
    },

    afkTime: {
        value: null,
        interval: null
    },

};

// Mobile
App.addListener('appStateChange', ({ isActive }) => {
    userInteractions.mobile.isActive = isActive;
});

// User AFK

// Update
const lastTimestampUpdate = () => {
    userInteractions.afkTime.value = moment().valueOf();
};

// Voice Chat Mode
export function setVoiceChatMode(value = true) {
    if (typeof value === 'boolean') userInteractions.vc.isActive = value;
};

// Get
export function getUserAfk(type = 'seconds') {

    if (__ENV_APP__.ELECTRON_MODE && global.systemIdleTime?.get) {
        global.systemIdleTime.exec();
        return global.systemIdleTime.get();
    }

    if (typeof userInteractions.afkTime.value === 'number') {
        return moment().diff(userInteractions.afkTime.value, type);
    }

    return null;

};

export function enableAfkSystem(value = true) {
    if (typeof value === 'boolean') userInteractions.enabled = value;
};

// Interval
const intervalTimestamp = () => {
    if (userInteractions.enabled) {

        // API
        const counter = getUserAfk();
        tinyAPI.emit('afkTimeCounter', counter);
        const content = initMatrix.matrixClient.getAccountData('pony.house.profile')?.getContent() ?? {};
        const originalAfk = content.active_devices;
        if (countObj(content) > 0) {

            tinyAPI.emit('afkTimeCounterProgress', counter);

            if (!Array.isArray(!content.active_devices)) content.active_devices = [];
            const deviceId = initMatrix.matrixClient.getDeviceId();
            const deviceIdIndex = content.active_devices.indexOf(deviceId);

            // 10 Minutes later...
            if (
                !userInteractions.vc.isActive &&
                (content.status === '🟢' || content.status === 'online') &&
                (counter > 600 || content.status === '🟠' || content.status === 'idle' || !userInteractions.mobile.isActive)
            ) {
                if (deviceIdIndex > -1) content.active_devices.splice(deviceIdIndex, 1);
            }

            // Nope
            else if (deviceIdIndex < 0 && content.active_devices.length < 1) {
                content.active_devices.push(deviceId);
            }

            if (!Array.isArray(originalAfk) || originalAfk.length !== content.active_devices.length) {
                tinyAPI.emit('afkTimeCounterUpdated', counter);
                initMatrix.matrixClient.setAccountData('pony.house.profile', content);
                emitUpdateProfile(content);
            }

        }

    }
};

// Start
export function startUserAfk() {

    if (userInteractions.afkTime.interval) {
        clearInterval(userInteractions.afkTime.interval);
        userInteractions.afkTime.interval = null;
    }

    if (!__ENV_APP__.ELECTRON_MODE) {
        $(window).on("mousemove", lastTimestampUpdate);
        userInteractions.afkTime.value = moment().valueOf();
    }

    userInteractions.afkTime.interval = setInterval(intervalTimestamp, 1000);

};

// Stop
export function stopUserAfk() {

    if (!__ENV_APP__.ELECTRON_MODE) $(window).on("mousemove", lastTimestampUpdate);
    if (userInteractions.afkTime.interval) {
        clearInterval(userInteractions.afkTime.interval);
        userInteractions.afkTime.interval = null;
    }

    if (!__ENV_APP__.ELECTRON_MODE) userInteractions.afkTime.value = null;

};

