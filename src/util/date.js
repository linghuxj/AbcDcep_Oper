import dayjs from 'dayjs'

export const calcDate = (date1, date2) => {
  var date3 = date2 - date1

  var days = Math.floor(date3 / (24 * 3600 * 1000))

  var leave1 = date3 % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000))

  var leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000))

  var leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
  var seconds = Math.round(date3 / 1000)
  return {
    leave1,
    leave2,
    leave3,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  }
}

/**
 * 日期格式化
 */
export function dateFormat(date) {
  let format = 'yyyy-MM-dd hh:mm:ss'
  if (date !== 'Invalid Date') {
    var o = {
      'M+': date.getMonth() + 1, // month
      'd+': date.getDate(), // day
      'h+': date.getHours(), // hour
      'm+': date.getMinutes(), // minute
      's+': date.getSeconds(), // second
      'q+': Math.floor((date.getMonth() + 3) / 3), // quarter
      'S': date.getMilliseconds() // millisecond
    }
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1,
        (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(RegExp.$1,
          RegExp.$1.length === 1 ? o[k]
            : ('00' + o[k]).substr(('' + o[k]).length))
      }
    }
    return format
  }
  return ''
}

/** **通用常量****/

// 日期时间
export const DATE_TIME_FMT = 'YYYY-MM-DD HH:mm:ss'

// 日期时间，不包含秒
export const DATE_TIME_MINUTE_FMT = 'YYYY-MM-DD HH:mm'

// 日期
export const DATE_FMT = 'YYYY-MM-DD'

/**
 * 获取当前时间戳
 */
export const now = () => Date.now()

const isNumber = num => typeof num === 'number'

const getDate = date => {
  if (isNumber(date)) {
    return dayjs(date)
  }
  return dayjs(date, DATE_TIME_FMT)
}

/**
 * 格式化日期
 * @param {string, number} date
 * @param {*} fmt
 */
export const format = (date, fmt = DATE_FMT) => {
  if (!date) {
    return date
  }
  return getDate(date).format(fmt)
}

/**
 * 获取日期时间戳
 * @param {*} date
 */
export const getTimestamp = date => {
  if (isNumber(date)) {
    return date
  }
  return getDate(date).valueOf()
}

/**
 * 获取秒 如果不传值获取当前秒值
 * @param {*} date
 */
export const getSecond = (date = Date.now()) => getDate(date).second()

/**
 * 获取分钟, 如果不传值获取当前分钟值
 * @param {*} date
 */
export const getMinute = (date = Date.now()) => getDate(date).minute()

/**
 *  获取小时, 如果不传值获取当前分钟值
 * @param {*} date
 */
export const getHour = (date = Date.now()) => getDate(date).hour()

/**
 * 获取当前是本月第几天
 * @param {*} date
 */
export const getDay = (date = Date.now()) => getDate(date).date()

/**
 * 获取当前月份
 * @param {*} date
 */
export const getMonth = (date = Date.now()) => getDate(date).month() + 1

/**
 * 获取当前年份
 * @param {*} date
 */
export const getYear = (date = Date.now()) => getDate(date).year()

/**
 * 用于表格格式化单元格
 * @param {*} row
 * @param {*} column
 * @param {*} cellValue
 */
export const formatCell = (fmt = 'YYYY-MM-DD') => {
  return (row, column, cellValue) => {
    return format(cellValue, fmt)
  }
}

/**
 * 获取当前属于本周周几
 * @param {*} date
 */
export const getWeekDay = (date = Date.now()) => getDate(date).day()

/**
 * 获取中文星期几
 * @param {*} date
 * @param {*} prefix
 */
export const getWeekDayChinese = (date = Date.now(), prefix = '星期') => {
  const weekday = getWeekDay(date)
  return prefix + ['日', '一', '二', '三', '四', '五', '六'][weekday]
}

// 时间格式yyyy/MM/dd
export const formatStartTime = () => {
  const year = getYear()
  const month = getMonth()
  const day = getDay()
  return year + '/' + month + '/' + day
}
