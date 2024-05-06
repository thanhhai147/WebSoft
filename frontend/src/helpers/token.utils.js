function setCookie(key, value, expire='') {
    if (expire) {
        let date = new Date()
        date.setTime(date.getTime() + (expire*60*60*1000))
        expire = date.toUTCString()
    }

    const domain = process.env.REACT_APP_DOMAIN
    const path = '/'

    document.cookie =
        key + '=' + value + 
        ',expire' + '=' + expire +
        ',domain' + '=' + domain + 
        ',path' + '=' + path +
        ',HttpOnly'

}

function getCookie(key) {
    let match = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'));
    if (match) return match[2].split(',')[0];
    return null;
}

function removeCookie(key) {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export default class TokenUtil {
    static getToken() {
        const tokenString = getCookie('auth_token')
        const userToken = tokenString
        return userToken
    }

    static saveToken(userToken) {
        setCookie('auth_token', userToken, 24)
    }

    static getUsername() {
        const usernameString = getCookie('auth_username')
        const username = usernameString
        return username
    }

    static saveUsername(username) {
        setCookie('auth_username', username, 24)
    }

    static removeToken() {
        removeCookie('auth_token')
    }
    
    static removeUsername() {
        removeCookie('auth_username')
    }
    
}