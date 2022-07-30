//LiteLoaderScript Dev Helper
/// <reference path="c:\Users\Administrator\.vscode\extensions\moxicat.llscripthelper-1.0.1\Library/JS/Api.js" /> 



class TMLS {
    /**
     * @param {string} key 监听对象
     * @param {Function} func 监听触发之后运行的函数
     * @returns {string} 监听唯一ID
     */
    static listen(key, func);

    /**
     * @param {string} id 已存在的监听唯一ID
     * @returns {boolean} 是否成功删除监听
     */
    static listenDel(id);
}

class TMCmd {
    /**
     * 注册一个玩家命令
     * @param {string} cmd 命令
     * @param {string} de 描述
     * @param {Function} callback 回调，function
     * @param {?number} perm 权限，不填为0，1为op，0为普通玩家
     */
    static regPlayerCmd(cmd, de, callback, perm);
    /**
     * 注册一个控制台命令
     * @param {string} cmd 命令
     * @param {string} de 描述
     * @param {Function} callback 回调，function
     */
    static regConsoleCmd(cmd, de, callback);
}

/**
 * 错误处理
 * @param {Error} err 错误对象
 */
export const ErrorMsg = (err) => { }

/**
 * 检查字符串是否为数字
 * @param {*} any 任何对象
 * @returns {boolean} 是否为数字
 */
export const checkNumber = (any) => { }

/**
 * 将是数字的字符串转换为数字
 * 错误将回调传入对象
 * @param {any} all 任何对象
 * @returns {number} 转换完成的数字
 * @if(Error)
 * @returns {any} 传入对象
 */
export const getNumber = (any) => { }

/**
 * TMET统一向玩家发送信息
 * 【带前缀】
 * @param {Player} pl 玩家对象
 * @param {string} text 消息
 * @returns {null} 不返回结果
 */
export const ST = (pl, text) => { }

/**
 * 获取转账税率
 * 0~1
 */
export const getPayTax = ()=>{}

/**
 * 获取玩家的经济
 * 【如果玩家从没进入服务器或者出错将返回null，模块关闭返回0】
 * @param {string} realName 玩家真实名称
 * @returns {number} 玩家经济
 * @if(NotData||Error)
 * @returns {null} 无数据
 * @if(!moneyEnable)
 * @returns {0} 0
 */
export const getmoney = (realName) => { }

/**
 * 设置玩家经济
 * 【如果玩家从没进入服务器或者出错返回null，模块关闭返回true】
 * @param {string} realName 玩家真实名称
 * @param {number} Num 设置的经济
 * @param {string} type 模式，平时请忽略
 * @returns {boolean}
 * @if(NotData||Error)
 * @returns {null}
 * @if(!moneyEnable)
 * @returns {true}
 */
export const setmoney = (realName, Num, type) => { }


/**
 * 发起转账【支持离线】
 * 【如果玩家从没进入服务器或者出错返回null，模块关闭返回true】
 * @param {string} realName 转账玩家的真实名称
 * @param {string} toRealName 被转账玩家的真实名称
 * @param {number} val 值
 * @param {string} note 转账信息【llmoney用】
 */
export const tranmoney = (realName, toRealName, val, note) => { }

/**
 * TMETConf类
 */
export const ConfObj = class {
    /**
     * 异步保存配置文件
     */
    asyncSave();
    /**
     * 配置是否安全
     */
    isSafe();
    /**
     * 初始化配置
     * @param {string} key 关键字
     * @param {any} defaul 默认值【该对象不存在会使用此值创建一个对象】
     * @returns {any} 配置关键字对应的值【如果存在将返回已有值】
     */
    init(key, defaul);
    /**
     * 设置一个关键字对应的值
     * @param {string} key 关键字
     * @param {any} val 任意值
     * @returns {boolean} 是否执行成功
     */
    set(key, val);
    /**
     * 获取关键字对应值
     * @param {string} key 关键字
     * @param {any} defaultt 默认返回值【当配置不存在时返回的值】
     * @returns {any} 该配置对应的值
     */
    get(key, defaultt);
    /**
     * 删除一个键值
     * @param {string} key 关键字
     * @returns {boolean} 是否删除成功
     */
    delete(key);
    /**
     * 重新从磁盘读取文件
     * @returns {boolean} 是否成功
     */
    reload();
    /**
     * 关闭配置文件
     * 【无实际作用】
     * @returns {boolean} 是否关闭成功？
     */
    close();
}

/**
 * 配置文件
 */
class TMdata {
    /**
     * 开启一个配置文件
     * @param {string} path 配置文件路径
     * @param {null} none 不需传入
     * @param {string} defaultt 默认内容，配置文件不存在将使用此值创建
     * @returns {ConfObj} 配置文件对象
     */
    static openConfig(path, none, defaultt);
}


/**
 * 获取一段语言
 * @param {string} xuidordefault 玩家xuid或者default，如为xuid读取玩家设置，default自动读取TMETConf默认的
 * @param {string} funcName 位于哪个func对象
 * @param {number} num 位于func对象的哪个位置
 * @param {...string} args 附带参数，自动替换语言文件的%s
 * @returns {string} 语言字符串
 */
export const GL = (xuidordefault, funcName, num, ...args) => { }

/**
 * 异步RunCmdAs
 * @param {*} xuid 在线玩家xuid
 * @param {*} cmd 命令
 * @returns {boolean} 异步是否创建成功
 */
export const plRunCmdAs = (xuid, cmd) => { }

/**
 * 贼强大的引号过滤
 * @param {string} str 字符串
 * @returns {boolean} 过滤后的东西
 */
export const cmdFH = (str) => { }

/**
 * 匹配字符串相似度
 * @param {*} str1 字符串1
 * @param {*} str2 字符串2
 * @returns {string} 可解析为数字，百分比模式
 */
export const similar = (str1, str2) => { }

/**
 * 获取加载器加载目录
 * 不管用的什么加载器都能返回正确的路径
 */
export const getLoadPath = () => { }

/**
 * 加载器是否为PF
 */
export const IsPFLoader = () => { }

/**
 * 使用BDSperm文件判断玩家是否为OP
 * @param {string} xuid 玩家xuid
 * @returns {boolean} 是非
 */
export const fIsOP = (xuid) => { }

/**
 * 给玩家添加一个效果
 * @param {Player} pl 玩家对象
 * @param {number} id 效果ID
 * @param {number} sec 时间(秒)
 * @param {number} level 等级
 * @param {number} dis 是否对外显示
 * @returns {null} 不返回
 */
export const addEffect = (pl, id, sec, level, dis) => { }