

import requests
import json
import time
import traceback
import random
import frida

def get_url_params(url):
    return_obj   = {}
    indextem  = url.index("?")
    sum_length  =  len(url)
    params_str  = url[url.index("?")+1:len(url)]
    print("params_str:"+params_str)
    params_arr = params_str.split("&")
    print(params_arr)
    for item_ in params_arr:
        item_key_value= item_.split("=")
        key1 = item_key_value[0]
        value1 = item_key_value[1]
        return_obj[key1] = value1
    return  return_obj
def red_file_data():
    file  = open("D:\\2022工作盘\\ce.txt",mode="r",encoding='gbk')
    content =  file.read()
    print(content)
    file.close()
    return content

# frida
def on_message(message, data):
    print(message)


def get_douyin_params2(url):
    result = {}
    session = frida.get_remote_device().attach("抖音")
    with open("E://pythonprojects//fridaporjects//douyifrida_rpc.js") as f:
        script = session.create_script(f.read())
        script.on("message", on_message)
        script.load()
        result = script.exports.getliz(url)
        print("获取参数结果:")
        print( result)
    return result



def get_douyin_params(url,cookieslist):
    return_data  = {
        "code":1000

    }
    res = requests.get(
        url="http://192.168.0.109:5000/create/task/v1",
        json={
            # "param_url": "https://i.snssdk.com/api/neptune/v3/sdk/PackLiveSDK?webcast_sdk_version=2710&webcast_language=zh&webcast_locale=zh_CN&webcast_gps_access=1&current_network_quality_info=%7B%7D&address_book_access=1&user_id=79639465442446&is_pad=false&is_android_pad=0&is_landscape=false&carrier_region=CN&sec_user_id=MS4wLjABAAAAzyt8T4e0iV4qnoGIeKzPzfbS7rDIag9WR0YOeZ_ETw4&iid=3549674933861079&device_id=1297875039959271&ac=wifi&channel=wandoujia_1128_0413&aid=1128&app_name=aweme&version_code=230000&version_name=23.0.0&device_platform=android&os=android&ssmix=a&device_type=MI+5s&device_brand=Xiaomi&language=zh&os_api=23&os_version=6.0.1&manifest_version_code=230001&resolution=1600*900&dpi=300&update_version_code=23009900&_rticket=1670584333638&package=com.ss.android.ugc.aweme&cpu_support64=false&host_abi=armeabi-v7a&ts=1670584332&appTheme=light&app_type=normal&need_personal_recommend=1&is_guest_mode=0&minor_status=0&cdid=3982995e-4db6-42d7-92ab-029e09d62a30&md=0",
            "param_url": url,
            # "param_cookie": "accept-encoding,gzip,activity_now_client,1670584335082,passport-sdk-version,20374,sdk-version,2,user-agent,com.ss.android.ugc.aweme/230001 (Linux; U; Android 6.0.1; zh_CN; MI 5s; Build/V417IR;tt-ok/3.12.13.1),x-bd-client-key,aa5e8cc6a8395307f016908c6df5aacbc116b7e13f46be4bb176c82dc3eacc1584609486196db2930052c33d23c14e2f7ff21463cb983c77898fe100b34a3cd8,x-bd-kmsv,1,x-ss-req-ticket,1670584333696,x-ss-stub,219DB0AD9DC6EAD560F2696505B92BE3,x-tt-dt,AAAQMM7VBOCBHR2MFC5W76T34FNUIYAH6QIU3LSTOPSBCA3EYW6GY6BHFKGMQ5KYMUXTQC4TSR3X5FB7RPSIYPIEZ6VA3AJGOY7KMWPKLTBT6CD2XSEQWLW7G5EZCVDPPWXQ67UHMFHMT5CHLKVNTCY,x-tt-token,00bf7e24dcfdb28b2a53ae64dc7bbb40ab03ecc4bcd60959d0acfd6f74a26670de97423373144937cccc02c871684b68b2b6e6fd10f3ad6bef8b763e6ea14bff452ebe21b48be07d44e17c98b92e71019c2a608b7f9b9f62205cba0110b33637a3870-1.0.1,x-vc-bdturing-sdk-version,3.1.0.cn"
            "param_cookie": cookieslist,
        }
    )
    task_id1 = res.text.strip()
    print("get->task_id1=", task_id1)
    res2 = requests.get(url="http://192.168.0.109:5000/get/result/v1?tid=" + task_id1)
    json_data = json.loads(json.loads(res2.text).get("data"))
    return_data["data"] = json_data
    print(res2.text)
    return return_data


def write_file_data(str):
    file  = open("D:\\2022工作盘\\ce.txt",mode="w",encoding='gbk')
    file.write(str)
    
    file.close()


try:
    # params_obj  = get_url_params("https://lianmengapi.snssdk.com/aweme/v1/store/product/list/?sec_shop_id=QYJcazLw&goods_type=1&sort_type=3&sort=0&cursor=0&size=20&iid=3364954170996542&device_id=2995518243341992&channel=juyouliang_douyin_and15&aid=1128&app_name=aweme&version_code=200300&version_name=20.3.0&device_platform=android&os=android&device_type=MI+6s&device_brand=Xiaomi&os_api=23&os_version=6.0.1")

    server_base_url   = "http://39.96.69.115:8089"
    # server_base_url   = "http://192.168.0.108:8009"
    m_cookies = {"sessionid": "c33dfc248f63ed33b159b87152d4a12b"}
    mheader = {


        # "x-bd-client-key": "6fb679455832a02fedf421d6021aa9f4ae002bc51af7eab2520d3f3329cfdce484609486196db2930052c33d23c14e2f7ff21463cb983c77898fe100b34a3cd8",
        # "x-bd-kmsv": "1",
        "X-Tt-Token": "00c33dfc248f63ed33b159b87152d4a12b028fc7d45062511caaabfc19bb36aecd327fd97cab03002859277832af94b195827c01bc8f0721be73c68ebf48b039fff52865261ab8d4308c2cf0a5ddc46076472fc530c8b8f6d379b416fdb8b9e4cab12-1.0.1",
        # "X-Argus": "SFtJ38D8oUApviunz+O3cJ9IQv8+se3iVt3Y/T2iTfyQ4SosapyXhkmdjf/L73KqKYawONRip9z9qqS/FALmCFMP6pjtFHH+2ZncLYl4fCbIo19huZMADLbZR8jGu360REVXiJXLU//rD85euPgdE4aJ1gW+oXzvDkQgOAwxr0rHj5hdzpbx65icaWThKRiaCGDXB377GBU2pTVfwOzvGcvT71gZ/WbXYpkyfgZBP9POu9nDCk9XqzoQ+QSC79z4U3jtWvMHv9PPaz8171jZ+/SB",
        # "X-Ladon": "nKGmTgdHXtWaAlEubEd/ZFLyHLz0K863hc8J+c8nYQnAXnD2",
        # "X-Gorgon": "040400274001f75eaeb930153ec64b0505213770220986fc4846",
        # "X-Khronos": "1673191668",

        "User-Agent": "com.ss.android.ugc.aweme/230201 (Linux; U; Android 6.0.1; zh_CN; MI 5s; Build/V417IR;tt-ok/3.12.13.1)",

        }
    payloadHeader = {

        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 UBrowser/6.2.4094.1 Safari/537.36'
    }
    from requests.cookies import RequestsCookieJar
    jar = RequestsCookieJar()

    if m_cookies is not None:
        for key in m_cookies:
            jar.set(key, m_cookies[key])
    is_run   = True
    getUrl = server_base_url+"/back/getDouYinShopForCollect/"

    post_url = server_base_url + "/back/addDouYinGoods/"
    cur_id = 0
    while is_run is True:
        content_text =  red_file_data()
        text_obj = json.loads(content_text)
        cur_id = text_obj.get("id")
        print(text_obj)

        reqUrl  = getUrl +"?id_limit="+str(cur_id)
        r = requests.get(reqUrl, data={},headers =payloadHeader,timeout=5)

        res_text = r.text
        if res_text is not None:
            result_obj = json.loads(res_text)
            shop_list = result_obj.get("results")
            counts = result_obj.get("count")
            if counts < 1 :
                is_run = False
                data = {"id": 0}
                write_file_data(json.dumps(data))
                break
            for shop_item in shop_list:
                cur_time = int(time.time()*1000)
                one_hour = 1 * 60 * 60 *1000
                expire_time  = int(shop_item.get("update_time"))+ int(one_hour)
                _id  =  shop_item.get("id")
                print("当前id:"+str(+_id))
                if _id > cur_id :
                    cur_id = _id
                    data  = {"id":cur_id}
                    write_file_data( json.dumps(data))
                expire_time = 0
                if  expire_time < cur_time :
                    if shop_item.get("monitor_url") is not None and  shop_item.get("monitor_url") !="" and shop_item.get("is_monitor") is True:
                        print("start-----------")
                        # response = requests.get(shop_item.get("monitor_url"), cookies=jar, headers=mheader, timeout=3)
                        monitor_url = shop_item.get("monitor_url")
                        base_url = monitor_url.split("?")[0]

                        base_url = "https://lianmengapi.snssdk.com/aweme/v1/store/product/list/"
                        params_obj = get_url_params(monitor_url)
                        params_obj['cursor'] = 0
                        params_obj['iid'] =1684913818703181
                        params_obj['device_id'] =1174740423166814
                        params_obj['channel'] = "wandoujia_1128_0413"

                        params_obj['sort_type'] = 2    # sort_type   0综合排序 1销量排序  2新品 3价格
                        str_  = ""
                        for key in params_obj.keys():
                            str_ = str_+str(key) + "=" + str(params_obj[key])+"&"
                        str_ = str_[0:len(str_)-1]
                        new_monitor_url = base_url +"?" +str_

                        # new_monitor_url  = "https://lianmengapi5-core-lf.ecombdapi.com/aweme/v1/store/product/list/?sec_shop_id=gaqlsDgi&goods_type=1&sort_type=2&sort=0&size=20&iid=3549674933861079&device_id=1297875039959271&channel=wandoujia_1128_0413&aid=1128&app_name=aweme&version_code=230000&device_platform=android&os=android&device_type=MI+5s&device_brand=Xiaomi&os_api=23&os_version=6.0.1"
                        # new_monitor_url  = 'https://lianmengapi.snssdk.com/aweme/v1/store/product/list/?sec_shop_id=HsOKGVed&goods_type=1&sort_type=1&sort=0&cursor=10&size=10&click_products&iid=1684913818703181&device_id=1174740423166814&ac=wifi&channel=wandoujia_1128_0413&aid=1128&app_name=aweme&version_code=230000&version_name=23.0.0&device_platform=android&os=android&ssmix=a&device_type=MI+5s&device_brand=Xiaomi&language=zh&os_api=23&os_version=6.0.1&manifest_version_code=230001&resolution=576*1024&dpi=192&update_version_code=23009900&_rticket=1673191158579&package=com.ss.android.ugc.aweme&mcc_mnc=46002&cpu_support64=false&host_abi=armeabi-v7a&ts=1673191247&appTheme=light&app_type=normal&need_personal_recommend=1&is_guest_mode=0&minor_status=0&is_android_pad=0&cdid=5c653458-4c2b-46f9-a80b-60891d8f7c19&md=0'
                        # ******************************************************11111111111111111111****************************
                        # cookies_list  = ["x-bd-client-key",
                        #      "aa5e8cc6a8395307f016908c6df5aacbc116b7e13f46be4bb176c82dc3eacc1584609486196db2930052c33d23c14e2f7ff21463cb983c77898fe100b34a3cd8",
                        #      "x-bd-kmsv", "1"]
                        # douyin_params = get_douyin_params(new_monitor_url,cookies_list).get("data")
                        # mheader = dict(mheader, **douyin_params)
                        # ******************************************************11111111111111111111****************************

                        douyin_params = get_douyin_params2(new_monitor_url)
                        mheader = dict(mheader, **douyin_params)
                        print("访问地址:"+new_monitor_url)
                        range_sleep_time = random.randint(1,3)
                        print("休眠"+str(range_sleep_time)+"秒")
                        time.sleep(range_sleep_time)

                        response = requests.get(new_monitor_url, cookies=jar, headers=mheader, timeout=10)

                        print("响应数据："+response.text)
                        if response.text == "":
                            continue
                        products_data = json.loads(response.text).get("products")

                        if products_data is None:
                            continue
                        douyin_goods_list = products_data
                        shop_id = shop_item.get("shop_id")

                        post_shop_data = {}
                        raw_goods_list = []
                        print("共有" + str(len(douyin_goods_list)) + "条商品")
                        if douyin_goods_list is not None and len(douyin_goods_list) > 0:
                            for goods_item in douyin_goods_list:
                                m_goods_obj = {}
                                m_goods_obj['shop_id'] = shop_id
                                if goods_item['img_url_list'] is not None:
                                    img_url_list = []
                                    img_url_list.append(goods_item['img_url_list'][0])
                                    m_goods_obj['img_url_list'] = img_url_list


                                if goods_item['price'] is not None:
                                    m_goods_obj['discount_price'] = goods_item['price']
                                    m_goods_obj['goods_price'] = goods_item['price']
                                    m_goods_obj['show_price'] = goods_item['price']
                                    m_goods_obj['price'] = goods_item['price']
                                    m_goods_obj['market_price'] = goods_item['price']
                                if goods_item.get("market_price") is not None:
                                    m_goods_obj['market_price'] = goods_item['market_price']

                                if goods_item['product_id'] is not None:
                                    m_goods_obj['goods_id'] = goods_item['product_id']
                                    m_goods_obj['product_id'] = goods_item['product_id']
                                if goods_item['name'] is not None:
                                    m_goods_obj['goods_name'] = goods_item['name']
                                    m_goods_obj['name'] = goods_item['name']

                                if goods_item['sell_num'] is not None:
                                    m_goods_obj['sell_num'] = str(goods_item['sell_num']).replace("+", "")
                                    if m_goods_obj['sell_num'].find("万") != -1:
                                        m_goods_obj['sell_num'] = m_goods_obj['sell_num'].replace("万", "").strip()

                                        m_goods_obj['sell_num'] = float(m_goods_obj['sell_num']) * 10000
                                raw_goods_list.append(m_goods_obj)

                            post_shop_data  = {"is_ignore_shop_update_time":True,"shop_id":shop_id,"douyin_goods_list":raw_goods_list}



                            print("提交数据："+json.dumps(post_shop_data))
                            r = requests.post(post_url, json=post_shop_data, headers=payloadHeader, timeout=50)
                            print(r.text)
                        print("end-----------")

        else:
            is_run = False
    print("结束:"+time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()))
except:
    traceback.print_exc()
    print()





