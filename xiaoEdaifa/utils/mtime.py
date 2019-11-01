
import datetime
import threading


# 等到当天0点的时间戳
def get_time_0clock_of_today():
    import time
    # 当天0点时间戳
    zero_point = int(time.time()) - int(time.time() - time.timezone) % 86400
    return zero_point


def get_time_0clock_of_yestoday():
    import time
    # 当天0点时间戳
    zero_point = int(time.time()) - int(time.time() - time.timezone) % 86400
    # 昨天0点时间戳
    yesterday_zero_point = zero_point - 86400
    return yesterday_zero_point


def format_from_time_stamp(time_stamp):
    import time
    time_array = time.localtime(time_stamp)
    other_style_time = time.strftime("%Y-%m-%d %H:%M:%S", time_array)
    return other_style_time


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

