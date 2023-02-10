
import requests
import json
res = requests.get(
    url="http://192.168.0.109:5000/create/task/v1",
    json={
        "param_url": "https://i.snssdk.com/api/neptune/v3/sdk/PackLiveSDK?webcast_sdk_version=2710&webcast_language=zh&webcast_locale=zh_CN&webcast_gps_access=1&current_network_quality_info=%7B%7D&address_book_access=1&user_id=79639465442446&is_pad=false&is_android_pad=0&is_landscape=false&carrier_region=CN&sec_user_id=MS4wLjABAAAAzyt8T4e0iV4qnoGIeKzPzfbS7rDIag9WR0YOeZ_ETw4&iid=3549674933861079&device_id=1297875039959271&ac=wifi&channel=wandoujia_1128_0413&aid=1128&app_name=aweme&version_code=230000&version_name=23.0.0&device_platform=android&os=android&ssmix=a&device_type=MI+5s&device_brand=Xiaomi&language=zh&os_api=23&os_version=6.0.1&manifest_version_code=230001&resolution=1600*900&dpi=300&update_version_code=23009900&_rticket=1670584333638&package=com.ss.android.ugc.aweme&cpu_support64=false&host_abi=armeabi-v7a&ts=1670584332&appTheme=light&app_type=normal&need_personal_recommend=1&is_guest_mode=0&minor_status=0&cdid=3982995e-4db6-42d7-92ab-029e09d62a30&md=0",
        # "param_cookie": "accept-encoding,gzip,activity_now_client,1670584335082,passport-sdk-version,20374,sdk-version,2,user-agent,com.ss.android.ugc.aweme/230001 (Linux; U; Android 6.0.1; zh_CN; MI 5s; Build/V417IR;tt-ok/3.12.13.1),x-bd-client-key,aa5e8cc6a8395307f016908c6df5aacbc116b7e13f46be4bb176c82dc3eacc1584609486196db2930052c33d23c14e2f7ff21463cb983c77898fe100b34a3cd8,x-bd-kmsv,1,x-ss-req-ticket,1670584333696,x-ss-stub,219DB0AD9DC6EAD560F2696505B92BE3,x-tt-dt,AAAQMM7VBOCBHR2MFC5W76T34FNUIYAH6QIU3LSTOPSBCA3EYW6GY6BHFKGMQ5KYMUXTQC4TSR3X5FB7RPSIYPIEZ6VA3AJGOY7KMWPKLTBT6CD2XSEQWLW7G5EZCVDPPWXQ67UHMFHMT5CHLKVNTCY,x-tt-token,00bf7e24dcfdb28b2a53ae64dc7bbb40ab03ecc4bcd60959d0acfd6f74a26670de97423373144937cccc02c871684b68b2b6e6fd10f3ad6bef8b763e6ea14bff452ebe21b48be07d44e17c98b92e71019c2a608b7f9b9f62205cba0110b33637a3870-1.0.1,x-vc-bdturing-sdk-version,3.1.0.cn"
        "param_cookie":["x-bd-client-key","aa5e8cc6a8395307f016908c6df5aacbc116b7e13f46be4bb176c82dc3eacc1584609486196db2930052c33d23c14e2f7ff21463cb983c77898fe100b34a3cd8","x-bd-kmsv","1"],
    }
)
task_id1 = res.text.strip()
print("get->task_id1=", task_id1)
res2 = requests.get(url="http://192.168.0.109:5000/get/result/v1?tid="+task_id1)
json_data = json.loads(json.loads(res2.text).get("data"))
print(res2.text)