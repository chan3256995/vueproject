import requests
import json
from requests.cookies import RequestsCookieJar
import traceback


try:


    jar = RequestsCookieJar()
    parms = None
    method = "POST"
    ret = {'code': "1000", 'message': ""}
    #
    # req_parms = json.loads(data.get("req_parms"))
    # url = req_parms.get("url")
    # header = req_parms.get("header")
    # m_cookies = req_parms.get("cookies")
    # m_parms = req_parms.get("parms")
    # m_method = req_parms.get("method")

    req_parms = {}
    url = req_parms.get("url")
    header = req_parms.get("header")
    m_cookies = req_parms.get("cookies")
    m_parms = req_parms.get("parms")
    m_method = req_parms.get("method")
    header = {


        "Host": "www.vvic.com",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",

          'Content-Type': 'application/x-www-form-urlencoded',

                'referer': 'https://www.vvic.com',
    }
    m_parms = {"params":{"disputeId":"116779515865179980","type":"3","isQnNew":True,"isHideNick":True}}
    m_parms2 = json.dumps(m_parms)
    print(m_parms2)
    m_method  = "GET"
    m_cookies = {
        "vvic_token":"bd8344ac-6493-4b65-be7c-0089dc280129",
        "cu":"8BCBC503584D9C653234CAB8F4ECEBFC",
        "uid":"779312",
        "userName":"vvic9200776044",
        "acw_tc":"2f624a2316823334099145380e7b643225ed7e1b744abec09f69ae5ed06511",
        "acw_sc__v2":"64466330d2383fff9731c398251f71fe255174f5",
        "generateToken":"eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJ2dmljLmNvbSIsInN1YiI6Ijc3OTMxMnwyMDIzMDQyNDE3NDI1NTg4MHxlY2EwN2E4YTk0ZjA0NzNmYmJjYjk5NTgzMTRjZjVjNCJ9.5W0N2Uut-OglhYCZ-X9xBeblFQpmxRpfTfX4iVdt8b79pgrULjYEW6IqCdzSR5xW4jxukBmlpuONKc0tiZplLg",
    }
    # m_cookies = {"cu":"E4051859BD6FA2287E668DD17DC33963","chash":"1875636657","_countlyIp":"119.125.110.156","_uab_collina":"166981247247671440618436","DEVICE_INFO":"%7B%22device_id%22%3A%22E4051859BD6FA2287E668DD17DC33963%22%2C%22device_channel%22%3A1%2C%22device_type%22%3A1%2C%22device_model%22%3A%22Windows%22%2C%22device_os%22%3A%22Windows%207%22%2C%22device_lang%22%3A%22zh-CN%22%2C%22device_size%22%3A%221366*768%22%2C%22device_net%22%3A%220%22%2C%22device_lon%22%3A%22%22%2C%22device_lat%22%3A%22%22%2C%22device_address%22%3A%22%22%2C%22browser_type%22%3A%22Chrome%22%2C%22browser_version%22%3A%2275.0.3770.100%22%7D","_ga":"GA1.2.1440572823.1669812475","ISSUPPORTPANGGE":"true","_ati":"3492520473736","countlyIp":"113.100.179.109","userLoginAuto":"0","city":"gz","SSGUIDE":"1","sensorsdata2015jssdkcross":"%7B%22distinct_id%22%3A%22779312%22%2C%22first_id%22%3A%22184c8943d80b8-0290ae2da6cdc88-404b032d-1049088-184c8943d8280%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22https%3A%2F%2Fwww.vvic.com%2Fmain%2FsameStyle%3FitemVid%3D643b96f141fa9a00080edbfb%26searchCity%3Dgz%22%2C%22page_attr%22%3A%22spot_list%22%7D%2C%22%24device_id%22%3A%22184c8943d80b8-0290ae2da6cdc88-404b032d-1049088-184c8943d8280%22%7D","vvic_token":"9910e138-9508-4eef-aa9e-e6f8789734a9","ut":"0","uid":"779312","userName":"vvic9200776044","umc":"1","mobile":"187****8068","pn":"0","defaultShopId":"","shopId":"","uno":"0","generateToken":"eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJ2dmljLmNvbSIsInN1YiI6Ijc3OTMxMnwyMDIzMDQyMjEyMzg1NzIwNHxhMTQxYWE2NTkxMjY0ZTBkOWM0MGMwZjkxMjYzOGNlZCJ9.txpdPp1YozE4fjPSG1dlMMul1p5LyUwflpNAHfDBLl8sgH8RDf9HKVWgyWiztokUlaf83CNM_0nVCeGeltjL6Q","ipCity":"183.24.177.75%2C%E5%B9%BF%E4%B8%9C%E7%9C%81%20%E6%A2%85%E5%B7%9E%E5%B8%82","ocity":"gz","hasCityMarket":"\"\"","Hm_lvt_fbb512d824c082a8ddae7951feb7e0e5":"1682238925,1682261748,1682303368,1682309637","Hm_lvt_fdffeb50b7ea8a86ab0c9576372b2b8c":"1682238925,1682261748,1682303368,1682309638","acw_sc__v2":"64463f2838c70e2f7b3796fec614249b0d35d6d5","algo4Uid":"0","itemAlgo":"%7B%22algoId%22%3A0%2C%22isLandingPage%22%3A0%7D","algo4Cu":"0","acw_tc":"2f624a0f16823271086652519e41177f62bb930875285ebcbff2c43c148acf","Hm_lpvt_fbb512d824c082a8ddae7951feb7e0e5":"1682327744","Hm_lpvt_fdffeb50b7ea8a86ab0c9576372b2b8c":"1682327744","ssxmod_itna":"YqAx0DcDBQiQK7K40dbk9D90Gq0=zFObT37DlcGQxA5D8D6DQeGTT0e3KTqKqYKWBgeiY7GmouoNkFSx2EmitOGSmaDU4i8DCLTEoD4+KGwD0eG+DD4DWDmeHDnxAQDj2KGWDbr=DmDim8mxGCDeKD0g+FDQKDuEKeKYE8VEcGu67Cil5DgGKDBEKD9cYDsxrEKA9hI+fxS14ODlIjDCF1uEKCd4Gdli0oPQ2tMQi3CbDRYjDoflrbfi0DT0Oq3NiKCRoKqu1qDDc3TyGDD=","ssxmod_itna2":"YqAx0DcDBQiQK7K40dbk9D90Gq0=zFObT3D6O+Gm=D0v+hx03i3Rfj6D6D=3Ly0FIKM8G7IUxuKDYvFi7SrIb4R4fGiLOdk8407G3nShj=aE3dC9K=3w1fhfeiQD08DeuGD="}

    url = "https://www.vvic.com/shop/list/58837/content_all"
    url  = "https://www.vvic.com/shop/75354"
    url  = "https://www.vvic.com/shop/14848"
    if m_cookies is not None:
        for key in m_cookies:
            jar.set(key, m_cookies[key])

    if m_method is not None and m_method == "GET":

        response = requests.get(url, cookies=jar, headers=header)
        ret['code'] = "1000"
        ret['message'] = " "
        ret['data'] = response.text

    elif m_method is not None and m_method == "POST":
        parms = m_parms
        response = requests.post(url, data=parms, cookies=jar, headers=header)
        ret['code'] = "1000"
        ret['message'] = " "
        ret['data'] = response.text

except:
    traceback.print_exc()

    ret['code'] = "1001"
    ret['message'] = " 查询异常"
