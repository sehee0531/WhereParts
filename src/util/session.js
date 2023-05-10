/*{userInfo:{
    id: "1234567890",
    companyName: "인제정비",
    companyAddress: "인제로 인제대학교",
    isLoggedin: true
    },
pageInfo:{
    prevPage:"BuyList",
    nextPage:"MyPage"
    }
}*/
export default class Session {
    static #items={};

    static clear() {
        Session.#items={};
    }

    static getAllItem() {
        return Session.#items;
    }
    
    static setItem(key,item) {
        Session.#items[key]=item;
    }

    static getItem(key) {
        return Session.#items[key];
    }

    static setUserInfoItem(item) {
        Session.#items['userInfo']=item;
    }

    static getUserInfoItem() {
        return Session.#items['userInfo'];
    }

    static setPageInfoItem(item) {
        Session.#items['pageInfo']=item;
    }

    static getPageInfoItem() {
        if(Session.#items.hasOwnProperty('pageInfo'))
            return Session.#items['pageInfo'];
        else
            return null;
    }

    static isLoggedin() {
        if (Session.#items.hasOwnProperty('userInfo'))
            return Session.#items['userInfo'].isLoggedin;
        else
            return false;
    }

    static getUserID() {
        return Session.#items['userInfo'].id;
    }

    static getNextPage() {
        return Session.#items['pageInfo'].nextPage;
    }

    static getPrevPage() {
        return Session.#items['pageInfo'].prevPage;
    }    
}