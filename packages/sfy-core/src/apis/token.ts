export type TokenInfoType = {
    email: string,
    exp: number,
    name: string,
    sub: string,
    scope: string | Array<string> | undefined,
}

const defauleUserInfo: TokenInfoType = {
    email: "----@xxx.com",
    exp: 1686970659,
    name: "----",
    sub: "",
    scope: [],
}

class Token {
    readonly tokenStorageKey: string = '_sfytoken_';
    token: string | null = null;
    userInfo: TokenInfoType = defauleUserInfo;

    init() {
        let token = window.localStorage.getItem(this.tokenStorageKey);
        if (token) {
            this.setToken(token);
        }
    }

    setToken(token: string) {
        let userInfo = this.decodeUserInfo(token);
        if (userInfo) {
            this.userInfo = userInfo;
        }
        this.token = token;
        window.localStorage.setItem(this.tokenStorageKey, token);
    }

    clearToken() {
        this.userInfo = defauleUserInfo;
        this.token = null;
    }

    private decodeUserInfo(token: string) {
        var userInfo;
        // 解码 token
        try {
            var strings = token.split(".");
            userInfo = JSON.parse(window.atob(strings[1].replace(/-/g, "+").replace(/_/g, "/")));
        }
        catch (ex) {
        }

        return userInfo;
    }
}

export default new Token();