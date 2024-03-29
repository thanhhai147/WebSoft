export default class TokenUtil {
    static getToken() {
        const tokenString = sessionStorage.getItem('auth_token');
        const userToken = JSON.parse(tokenString);
        return userToken
    };

    static saveToken(userToken) {
        sessionStorage.setItem('auth_token', JSON.stringify(userToken));
    };
    
}