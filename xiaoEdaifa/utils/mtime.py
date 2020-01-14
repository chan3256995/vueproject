
import datetime
import threading
import time

# 等到当天0点的时间戳
def get_time_0clock_of_today():

    # 当天0点时间戳
    zero_point = int(time.time()) - int(time.time() - time.timezone) % 86400
    return zero_point


def get_time_0clock_of_yestoday():

    # 当天0点时间戳
    zero_point = int(time.time()) - int(time.time() - time.timezone) % 86400
    # 昨天0点时间戳
    yesterday_zero_point = zero_point - 86400
    return yesterday_zero_point


def stamp_to_time(time_stamp,time_format):
    mformat = "%Y-%m-%d %H:%M:%S"
    if time_format is not None:
        mformat = time_format
    time_array = time.localtime(time_stamp)
    other_style_time = time.strftime(mformat, time_array)
    return other_style_time

# -*- coding: utf-8 -*-


def get_time_stamp13(datetime_str):
    import datetime, time
    # 生成13时间戳   eg:1557842280000
    datetime_obj = datetime.datetime.strptime(datetime_str, "%Y-%m-%d %H:%M:%S.%f")

    # 10位，时间点相当于从1.1开始的当年时间编号
    date_stamp = str(int(time.mktime(datetime_obj.timetuple())))
    # 3位，微秒
    data_microsecond = str("%06d" % datetime_obj.microsecond)[0:3]
    date_stamp = date_stamp + data_microsecond
    return int(date_stamp)


def get_time_stamp10(time_sj):
    # 传入单个时间比如'2019-8-01 00:00:00'，类型为str
    data_sj = time.strptime(time_sj,"%Y-%m-%d %H:%M:%S")       # 定义格式
    time_int = int(time.mktime(data_sj))
    return time_int             # 返回传入时间的时间戳，类型为int


# 得到距离第二天某一时刻的时间长度 单位为秒
def get_duration(time_str):
    # time_str 为要计算的某一时刻 如 '03:00:00'
    # 获取现在 时间
    now_time = datetime.datetime.now()
    # 获取明天时间
    next_time = now_time + datetime.timedelta(days=+1)
    next_year = next_time.date().year
    next_month = next_time.date().month
    next_day = next_time.date().day
    # 获取明天time_str点时间
    next_time = datetime.datetime.strptime(str(next_year) + "-" + str(next_month) + "-" + str(next_day) +" "+time_str,
                                           "%Y-%m-%d %H:%M:%S")
    # # 获取昨天时间
    # last_time = now_time + datetime.timedelta(days=-1)

    # 获取距离明天time_str点时间，单位为秒
    timer_start_time = (next_time - now_time).total_seconds()
    print(timer_start_time)
    return timer_start_time

if __name__ == "__main__":
    get_duration('23:00:00')

