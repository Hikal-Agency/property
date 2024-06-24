import { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { PhoneNumberUtil } from 'google-libphonenumber';
import * as isoCountries from 'i18n-iso-countries';
import * as countriesAndTimezones from 'countries-and-timezones';

const phoneNumberUtil = PhoneNumberUtil.getInstance();

isoCountries.registerLocale(require("i18n-iso-countries/langs/en.json"));

export const getCountryFromNumber = (phoneNumber) => {
    try {
        const parsedNumber = phoneNumberUtil.parse(phoneNumber);
        if (parsedNumber) {
            const countryCode = phoneNumberUtil.getRegionCodeForNumber(parsedNumber);
            // console.log("COUNTRY CODE ALPHA2 =============== ", countryCode);
            
            const countryName = isoCountries.getName(countryCode, "en");
            // console.log("COUNTRY NAME =============== ", countryName);

            // const timezone = moment.tz.guess(true, { countryCode: countryCode });
            const timezone = getTimezoneByCountryCode(countryCode);
            // console.log("COUNTRY TIMEZONE ===================== ", timezone);

            return {
                countryCode: countryCode,
                countryName: countryName,
                timezone: timezone
            };
        }
        else {
            // console.error(`COUNTRY Failed to parse phone number: ${parsedNumber}`);
            return { 
                countryCode: null, 
                countryName: null, 
                timezone: null 
            };
        }
    }
    catch (error) {
        // console.error("COUNTRY ERROR =============== ", error);
        return { 
            countryCode: null, 
            countryName: null, 
            timezone: null 
        };
    }
};

const getTimezoneByCountryCode = (countryCode) => {
    try {
        const country = countriesAndTimezones.getCountry(countryCode);
        if (country) {
            return country.timezones[0];
        } else {
            console.error("Country not found");
            return null;
        }
    } catch (error) {
        console.error("Error getting timezone", error);
        return null;
    }
};


