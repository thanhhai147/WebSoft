export default class TokenUtil {
    static getToken() {
        const tokenString = sessionStorage.getItem('auth_token');
        const userToken = JSON.parse(tokenString);
        return userToken
    };

    static saveToken(userToken) {
        sessionStorage.setItem('auth_token', JSON.stringify(userToken));
    };

    static getUsername() {
        const tokenString = sessionStorage.getItem('auth_username');
        const userToken = JSON.parse(tokenString);
        return userToken
    };

    static saveUsername(username) {
        sessionStorage.setItem('auth_username', JSON.stringify(username));
    }

    static removeToken() {
        sessionStorage.removeItem('auth_token')
    }
    
    static removeUsername() {
        sessionStorage.removeItem('auth_username')
    }
    
}