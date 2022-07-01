

# 根据一个字符串 返回特定的MD5加密字符
def md5(str_):
    import  hashlib
    import time
    ctime  = str(time.time())
    m = hashlib.md5(bytes(str_,encoding='utf-8'))
    m.update(bytes(ctime,encoding='utf-8'))
    return m.hexdigest()


# 返回url地址里的参数
def get_url_params(url_str):
    index1 = url_str.find("?")
    start =index1 + 1
    end =len(url_str)
    print(start)
    print(end)
    params_str = url_str[start: end]

    params_obj = {}

    params_arr = params_str.split("&")
    for item in params_arr:
        params_item_arr = item.split("=")
        params_obj[params_item_arr[0]] = params_item_arr[1]

    return params_obj

