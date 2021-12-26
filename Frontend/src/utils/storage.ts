

// saving value
const saveToken = (value: string) => {

    try {
        localStorage.setItem("token", value);
        localStorage.setItem("auth", "loggedIn");
    } catch (e) {
        console.log("Cannot set the token", e);
    }
}

// get value
const getToken =  () => {
    return localStorage.getItem("token");
}

const getAuth = () => {
    return localStorage.getItem("auth");
}

// delete value
const deleteToken = () => {
    try {
        localStorage.removeItem("token");
        localStorage.removeItem("auth");
        console.log(`Token deleted successfully`)
    } catch (e) {
        console.log("cannot delete tokens ", e);
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {saveToken, getToken, deleteToken, getAuth};
