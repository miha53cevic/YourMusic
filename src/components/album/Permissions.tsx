import { PermissionsAndroid } from 'react-native';

export const read_permissions = async(callbackFunction: Function) => {
    try {
        const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
            title: "YourMusic needs Permission",
            message: "For the app to work properly read permissions are needed",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
        }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can read files");
            const res = await callbackFunction();
        } else {
            console.log("File permission denied");
            // Ask for permission again
            read_permissions(callbackFunction);
        }
    } catch (err) {
        console.warn(err);
    }
};

export const write_permissions = async(callbackFunction: Function) => {
    try {
        const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
            title: "YourMusic needs Permission",
            message: "For the app to work properly write permissions are needed",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
        }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can write files");
            const res = await callbackFunction();
        } else {
            console.log("File permission denied");
            // Ask for permission again
            write_permissions(callbackFunction);
        }
    } catch (err) {
        console.warn(err);
    }
};