
# 获取本地ip地址 比如 192.168.1.100
def get_windows_local_ip():
    import socket
    # 获取本机电脑名
    myname = socket.getfqdn(socket.gethostname())
    # 获取本机ip
    myaddr = socket.gethostbyname(myname)
    return myaddr


if __name__ == '__main__':
    get_windows_local_ip()
