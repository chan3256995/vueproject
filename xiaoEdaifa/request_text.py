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

        "Host": "h5api.m.taobao.com",
        "Connection": "keep-alive",
        "Content-Length": "188",
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36",
    "Content-type": "application/x-www-form-urlencoded",
    "Origin": "https://myseller.taobao.com",

    "Referer": "https://myseller.taobao.com/home.htm/trade-platform/refund-list/detail?spm=a21dvs.24040009.0.0.5b8c645ekTX9iN&disputeId=116779515865179980&type=3",
    "Accept-Encoding": "gzip,deflate,br",
    "Accept-Language": "zh-CN,h;q=0.9",
    }
    m_parms = {"params":{"disputeId":"116779515865179980","type":"3","isQnNew":True,"isHideNick":True}}
    m_parms2 = json.dumps(m_parms)
    print(m_parms2)
    m_method  = "POST"
    m_cookies = {
            "hng":"CN%7Czh-CN%7CCNY%7C156",
                "enc":"AX4T5fu%2FvPp3AAAAAHFBIWwBbTT9%2Ff39d%2F1I%2FUn9JVQBc5lPvhPnYUfDL23Rc26TStDZNLBN%2FVpiTjUS07aJe5G6",

                "tracknick":"moonlight539",

                "xlly_s":"1",
                "lgc":"moonlight539",
            "_cc_":"VT5L2FSpdA%3D%3D",

            "_samesite_flag_":"True",


            "unb":"467630318",

            "csg":"fd5223ae",
            "cancelledSubSites":"empty",
            "cookie17":"VypX6SrwnB2D",
            "dnk":"moonlight539",

            "existShop":"MTY3MjM3NTMxNw%3D%3D",

            "_l_g_":"Ug%3D%3D",
            "sg":"982",
            "_nk_":"moonlight539",
            "cookie1":"UojUVLRQa87pXVPPGSFD6QOf%2F%2Fm0wWOHAeNIbLq7vI4%3D",
        "l": "fBEPx5nuLMIJeGj1BOfwFurza77OsIRAguPzaNbMi9fP9iC95lmRB6SEboLpCnGVFsZvR3R4FBTTBeYBqgI-nxvOhsrjo2kmnmOk-Wf..",


            "isg":"BO7uMEw9AXdlW3UURuOZl6M8P0Sw77Lp8n7a1hi3WvGs-45VgH8C-ZT5s2cXI6oB",

            "tfstk":"c3EOBv9nD6fGSMfmYcQH0mdZByaOZE_ti6cyDuGBkjsv2bKAiGZu4vxexYeSI9C..",
        "uc1": "cookie21=U%2BGCWk%2F7pun3YdLXQQ%3D%3D&cookie14=UoezTU0fRRVKLg%3D%3D&existShop=true&cookie16=U%2BGCWk%2F74Mx5tgzv3dWpnhjPaQ%3D%3D&cookie15=UIHiLt3xD8xYTw%3D%3D&pas=0",
        "uc3": "vt3=F8dCvjETFLOnx%2FxiRf8%3D&nk2=Dl9OSr7zuFtrsHxW&id2=VypX6SrwnB2D&lg2=V32FPkk%2Fw0dUvg%3D%3D",
        "uc4": "id4=0%40VX09oVN3jNtOEoQ0BT8fMxjOb88%3D&nk4=0%40DDrLLMRjgg0NBiw%2B4kn4zU7rvDxWrHA%3D",
        "_m_h5_tk": "332d9f084a3df230128a8bddabcf3922_1672394621417",
        "_m_h5_tk_enc": "57f13dfe643aa7d8973c1c498277afa6",
        "_tb_token_": "ee48e1e61b975",
        "skt": "f0ea7c6a4625c2ac",
        "sgcookie": "E100HK0IwDXhIh%2Bl71rsoU0MH6A3N6mK6%2Bc2f0DiqkPpeleNMaGvknTpb2mZu9xLiwFjPmwE467p%2B8QAZ8w9qEOOWFFMQ%2FO7i45o3xlRh7IpkW0%3D",
        "cookie2": "1bc1f1823793e02be234213fed1d6bd3",
        "t": "be4bf00551e2a176cffd3d845d9aeea1",
        "cna": "9joOHNdx+UECAXd9bpwTKMdT",
    }

    url  = "https://h5api.m.taobao.com/h5/mtop.alibaba.refundface2.disputeservice.qianniu.pc.disputedetail/1.0/?jsv=2.6.1&appKey=12574478&t=1672384886962&sign=f2b55482c91620ee6e53dcd104317563&api=mtop.alibaba.refundface2.disputeservice.qianniu.pc.disputedetail&v=1.0&ttid=11320%40taobao_WEB_9.9.99&type=originaljson&dataType=json"
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
