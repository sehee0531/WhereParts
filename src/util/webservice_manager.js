
class WebServiceManager {
    #url;
    #method;
    #formDatas;
    #binaryDatas;
    #headerData;
    #credentials;
    #listener;
    #isMultipart;
    #isQueryData;


    constructor(url,method,listener) {
        this.#listener=listener;
        this.#url=url;
        this.#method=method;
        this.#formDatas={};
        this.#binaryDatas={};
        this.#headerData={};
        this.#credentials='omit';
        this.#isMultipart=true;
        this.#isQueryData=false;
    }

    //Query형식으로 하나만 서버로 보낼 경우
    addSingleQueryData(data) {
        this.#isMultipart=false;
        this.#isQueryData=true;
        this.#headerData={'Content-Type':'application/x-www-form-urlencoded'}
        this.addFormData('data',data);
    }

    //JSON형식으로 하나만 서버로 보낼 경우
    addSingleFormData(data) {
        this.#isMultipart=false;
        this.#headerData={'Content-Type':'application/json; charset=utf-8'};
        this.addFormData("data",data);
    }

    //바이너리 형태로 하나만 서버로 보낼 경우
    addSingleBinaryData(data) {
        this.#isMultipart=false;
        this.#headerData={'Content-Type':'application/octet-stream'};
        this.addBinaryData("data",data);
    }

    //Multipart 형식으로 Form Data 추가
    addFormData(key,data) {
        this.#formDatas[key]=data;
    }

    //Multipart 형식으로 Binary Data 추가
    addBinaryData(key,data) {
        this.#binaryDatas[key]=data;
    }

    addHeader(key,data) {
        this.#headerData[key]=data;
    }

    setCredentials(data) {
        this.#credentials=data;
    }

    async start() {
        var response;
        //POST일 경우
        if(this.#method==='post' || this.#method==='POST') {
            if(this.#isMultipart===true) {
                let bodyData = new FormData();
                for(const [key,value] of Object.entries(this.#formDatas))
                    bodyData.append(key,JSON.stringify(value));

                for(const [key,value] of Object.entries(this.#binaryDatas))
                    bodyData.append(key,value);

                response = await fetch(this.#url,{method:this.#method,body:bodyData,headers:this.#headerData,credentials:this.#credentials})
                .catch(()=>{const listener = this.#listener.bind(); listener();});   
            }
            //Multipart 형식이 아닌 Single로 JSON 이든 Binary든 하나만 보낼 경우
            else if(this.#isMultipart===false && this.#isQueryData===false){               
                if(Object.keys(this.#formDatas).length===1) {                    
                    const sendData=JSON.stringify(this.#formDatas["data"]);
                    response = await fetch(this.#url,{method:this.#method,body:sendData,headers:this.#headerData,credentials:this.#credentials})
                    .catch(()=>{const listener = this.#listener.bind(); listener();});
                }
                else if(Object.keys(this.#binaryDatas).length===1) {
                    response = await fetch(this.#url,{method:this.#method,body:this.#binaryDatas['data'],headers:this.#headerData,credentials:this.#credentials})
                    .catch(()=>{const listener = this.#listener.bind(); listener();});
                }
            }
            else if(this.#isMultipart===false && this.#isQueryData===true) {
                if(Object.keys(this.#formDatas).length===1) {                    
                    const sendData=this.#formDatas["data"];
                    response = await fetch(this.#url,{method:this.#method,body:sendData,headers:this.#headerData,credentials:this.#credentials})
                    .catch(()=>{const listener = this.#listener.bind(); listener();});
                }
            }        
        }
        //GET일 경우
        else {
            response = await fetch(this.#url,{headers:this.#headerData,credentials:this.#credentials})
            .catch(()=>{const listener = this.#listener.bind(); listener();});            
        }
        
        if(response.ok)
            return response;
    }
}

export default WebServiceManager;