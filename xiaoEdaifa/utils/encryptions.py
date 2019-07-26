from hashlib import sha1


# 返回加密后的密码
def get_sha_encryptions(str):
    # 1.加盐,SECRET_KEY为加盐字符串,from ads.settings import SECRET_KEY
    SECRET_KEY = "2019"
    password = SECRET_KEY + str
    # 2.开始加密
    sha1_obj = sha1()
    sha1_obj.update(password.encode())
    ret = sha1_obj.hexdigest()
    print(ret)  # 437e35e364430921430c063aaba4e993934e6169
    print(len(ret))  # 40

    # sha1,md5两种加密算法类似,sha1加密后40位,md5加密后32位,sha1相对安全,但速度慢
    # md5_obj = md5()
    # md5_obj.update(password.encode())
    # ret = md5_obj.hexdigest()
    # print(ret)  # 201812424099946c9c5590be9754b94b
    # print(len(ret))  # 32
    return ret
