
import os


def get_file_list(dir_path):
    file_list = []
    dirs = os.listdir(dir_path)
    for file in dirs:
        file_list.append(file)

    return file_list


# 删除一个文件
def delete_file(file_path):
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
            return True
        except:
            return False


# 创建一个新文件
def create_file(file_path):
    if not os.path.exists(file_path):
        try:
            f = open(file_path, 'w')
            f.close()
            return True
        except:
            return False


# 创建一个新文件夹
def create_dir(dir_path):
    is_exists = os.path.exists(dir_path)
    print(is_exists)
    try:
        if not is_exists:
            # 如果不存在则创建目录
            # 创建目录操作函数
            os.makedirs(dir_path)

    except:
        return False
    return True


if __name__ == '__main__':
    print(create_dir("E:\\pythonprojects\\xiaoEdaifa\\static\\nh\\03\\"))
