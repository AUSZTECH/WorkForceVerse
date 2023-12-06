import jwtDecode from "jwt-decode";
import { Platform } from "react-native";


// Keychain
import {
    ACCESS_CONTROL,
    getSupportedBiometryType,
    SECURITY_LEVEL,
    SECURITY_RULES,
    setGenericPassword,
    setInternetCredentials,
    resetGenericPassword,
    resetInternetCredentials,
    STORAGE_TYPE
} from "react-native-keychain";

// API
import baseURL from "../../assets/common/baseURL";
import API from "../../utils/API";

export const SET_CURRENT_USER = "SET_CURRENT_USER";

export const loginUser = async (loginId, password, dispatch) => {
    try {
        const res = await API({
            method: 'POST',
            url: `api/Auth/Login?username=${loginId}&password=${password}`,
        })
        const decoded = jwtDecode(res.data.responseData)
        getSupportedBiometryType()
            .then(async (biometricType) => {
                if (Platform.OS === 'android' && biometricType !== null) {
                    await setGenericPassword(loginId, password, {
                        accessControl: ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
                        storage: STORAGE_TYPE.RSA,
                        rules: SECURITY_RULES.AUTOMATIC_UPGRADE,
                        securityLevel: SECURITY_LEVEL.ANY,
                    })
                }
                await setInternetCredentials(baseURL, loginId, res.data.responseData, {
                    storage: STORAGE_TYPE.FB
                })
                dispatch(setCurrentUser(decoded, res.data.responseData))
            })
            .catch((e) => {

                throw new Error(e)
            })
    } catch (e) {
        console.log(e)
        throw new Error(e)
    }
}

export const logoutUser = async (dispatch) => {
    await resetGenericPassword()
    await resetInternetCredentials(baseURL)
    dispatch(setCurrentUser({}))
}

export const setCurrentUser = (decoded, token) => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded,
        token,
        userID: decoded.UserId,
        companyID: decoded.CompanyId,
        siteID: 0,
    }
}