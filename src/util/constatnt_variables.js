export default class Constant {
    static serviceURL = "http://203.241.251.177/wparts";
    static externalServiceURL = "http://lab.pyunhan.co.kr";
    static asyncFiredTerm = 1000*60*60*24;  //1일
    static asyncFiredTermTest = 1000*60*2;  //2분
    static deliveryApiKey="3LJ8cI2G0mSsKhGzRgAWCw";
    
    
    static getInvoiceNames() {
        return ["CJ대한통운","우체국택배","편의점택배","로젠택배","한진택배"];
    }
    static getGoodsQuality() {
        return ["S급","A급","B급"];
    }

    static getGoodsGenuine() {
        return ["정품","비정품"];
    }
}      