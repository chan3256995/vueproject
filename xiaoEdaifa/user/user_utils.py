import logging
logger = logging.getLogger('stu')
from utils import encryptions
import traceback


# 检查密码是否正确
def check_pay_password(self,user, pwd):
    pay_pwd = pwd
    print("pay_pwd", pay_pwd)
    pay_pwd_ = encryptions.get_sha_encryptions(pay_pwd)
    if  user.pay_password != pay_pwd_:
        logger.info('%s url:%s method:%s' % (traceback.format_exc(), self.request.path, self.request.method))
        return False
    return True

