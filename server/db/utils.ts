import { types } from "cassandra-driver";

export const TimeUuid = types.TimeUuid;

export const timeUuidToDate = (timeUuid: InstanceType<typeof TimeUuid>) => {
    // https://github.com/xehrad/UUID_to_Date/blob/master/UUID_to_Date.js

    const GREGORIAN_OFFSET = 122192928000000000;

    const uuidParts = timeUuid.toString().split("-");
    const timeStr = uuidParts[2].substring(1) + uuidParts[1] + uuidParts[0];
    const timeInt = parseInt(timeStr, 16);

    const unixTimestamp = Math.floor((timeInt - GREGORIAN_OFFSET) / 10000);
    return new Date(unixTimestamp);
};
