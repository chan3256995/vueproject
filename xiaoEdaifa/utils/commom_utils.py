

# 根据一个字符串 返回特定的MD5加密字符
def md5(str_):
    import  hashlib
    import time
    ctime  = str(time.time())
    m = hashlib.md5(bytes(str_,encoding='utf-8'))
    m.update(bytes(ctime,encoding='utf-8'))
    return m.hexdigest()