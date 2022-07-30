/*--------------------------------
  _______ __  __ ______                    _   _       _ 
 |__   __|  \/  |  ____|                  | | (_)     | |
    | |  | \  / | |__   ___ ___  ___ _ __ | |_ _  __ _| |
    | |  | |\/| |  __| / __/ __|/ _ \ '_ \| __| |/ _` | |
    | |  | |  | | |____\__ \__ \  __/ | | | |_| | (_| | |
    |_|  |_|  |_|______|___/___/\___|_| |_|\__|_|\__,_|_|
                  Produced by Timiya
    TMEssential is distributed under the GPLv3 License
                                                         
该插件由提米吖创作
未经允许禁止擅自修改或者发售
该插件仅在[github,MineBBS,MCWeBBS]仓库发布
禁止二次发布!
----------------------------------*/
//LiteLoaderScript Dev Helper
//TMETHelper
/// <reference path="TMETHelper.js" /> 


let version = 2.849,
    OnlinePlayer = {},//已在线玩家
    fs = {},//文件
    tmp = {},//临时数据
    oldscore = "",//防抖
    configExample = {//预释放配置文件（勿改）
        "Enable": true,
        "AutoUpdate": true,
        "SelectForm": {
            "Subsection": 40
        },
        "LANGUAGE": {
            "Default": "zh_CN",
            "Cmd": "language"
        },
        "TPA": {
            "Enable": true,
            "ExpirationTime": 40,
            "ConsumeMoney": 0
        },
        "WARP": {
            "Enable": true,
            "ConsumeMoney": 0
        },
        "BACK": {
            "Enable": true,
            "MaxSave": 5,
            "SaveToFile": true,
            "InvincibleTime": 5,
            "ConsumeMoney": 0
        },
        "HOME": {
            "Enable": true,
            "MaxHome": 3,
            "SaveRequiredMoney": 0,
            "GoHomeRequiredMoney": 0,
            "DelHomeBackOffMoney": 0
        },
        "Money": {
            "Enable": true,
            "MoneyType": "score",
            "MoneyName": "money",
            "PayTaxRate": 0.0,
            "MoneyChangeMsg": true,
            "PlayerInitialMoney": 0
        },
        "NOTICE": {
            "Enable": true,
            "JoinOpenNotice": true,
            "NoticeTitle": "hello",
            "NoticeText": "test"
        },
        "SHOP": {
            "Enable": true
        },
        "DYNAMICMOTD": {
            "Enable": true,
            "Time": 5,
            "Motds": [
                "test",
                "test2"
            ]
        },
        "TPR": {
            "Enable": true,
            "MaxXZCoordinate": 10000,
            "MinXZCoordinate": -10000,
            "ConsumeMoney": 0
        },
        "ReloadChuck": {
            "Enable": true,
            "ConsumeMoney": 0
        },
        "FarmLandProtect": {
            "Enable": true,
            "Type": 0
        },
        "UseLog": {
            "Enable": true,
            "Conf": {
                "API": false,
                "LANGUAGE": true,
                "TPA": true,
                "WARP": true,
                "BACK": true,
                "HOME": true,
                "Money": true,
                "NOTICE": true,
                "SHOP": true,
                "DYNAMICMOTD": false,
                "TPR": true,
                "ReloadChuck": true,
                "FarmLandProtect": false
            }
        }
    },
    defaultLangPack = {//预释放语言文件（勿改）
        "ErrorMsg": [
            "捕获到异常:",
            "文件:\" %s \" 无法从字符串正常转换为JSON格式",
            "请检查格式是否正确或编码是否为UTF8",
            "错误堆栈信息已输出至\" %s \",请将此文件发送至此插件开发者"
        ],
        "sendSelectForm": [
            "§l§a请输入关键词进行搜索",
            "§l§b我选好了(开启之后提交可选择完成)",
            "§l§e请选择页码",
            "§l§b已选择: %s"
        ],
        "Moneyload": [
            "经济系统",
            "经济GUI",
            "/money pay <input:playername> <input:Num> 向某人转账(从总金额扣除%s/100税率)",
            "/money add <input:playername> <input:Num> 给某人添加经济",
            "/money set <input:playername> <input:Num> 设置某人的经济",
            "/money reduce <input:playername> <input:Num> 扣除某人的经济",
            "/money query [input:playername] 查询自己的经济或者别人的经济",
            "检测到记分板不存在,已自动创建",
            "未知经济类型!"
        ],
        "moneygui": [
            "§c命令异常,请检测后重试",
            "[\"§l§a转账\", \"§l§e查看排行榜\", \"§l§dOP快捷管理\"]",
            "[\"§l§a转账\", \"§l§e查看排行榜\"]",
            "§l§b请选择...",
            "§b表单已放弃",
            "§l§b请选择转账类型",
            "§l§a请划动",
            "[\"§l§a在线转账\", \"§l§b离线转账\"]",
            "§b表单已放弃",
            "§l§b请选择一位玩家进行转账",
            "§b表单已放弃",
            "§c只能选择一个玩家进行转账!",
            "§c无法正确操作数据缺失玩家的经济",
            "§l§b被转账人:%s,\n§aTA的余额:%s\n§a你的余额:%s,\n§b货币名称:%s,\n§e转账税率:%s",
            "§l§a请输入正整数(不含零)",
            "§b表单已放弃",
            "§c请输入正整数",
            "§c你的余额不足!",
            "§b转账完成,剩余余额:%s",
            "§c转账失败,原因未知",
            "§l§b请选择从哪里获取玩家对象",
            "§l§a请划动",
            "[\"§l§a在线玩家\", \"§l§b离线玩家\"]",
            "§b表单已放弃",
            "§l§b请选择一个玩家进行管理",
            "§b表单已放弃",
            "§c只能选择一个玩家进行操作!",
            "§c无法正确操作数据缺失玩家的经济",
            "§l§b当前选择玩家:§e %s,\n§bTA的§f %s为: §e %s",
            "§l§a开启为添加(减少)模式,关闭为设置模式",
            "§l§b请务必输入数字",
            "§b表单已放弃",
            "§c请输入数字哦亲",
            "§a操作成功",
            "§c操作失败,原因未知",
            "§c请输入数字哦亲",
            "§a操作成功",
            "§c操作失败,原因未知"
        ],
        "setmoney": [
            "§b经济变动:您现在拥有: §e%s §f%s,§b变动值: %s",
            "§b初始经济： %s 已发放",
            "§b经济变动:您现在拥有: §e%s §f%s,§b变动值: %s",
            "§b初始经济： %s 已发放",
            "§b经济变动:您现在拥有: §e%s §f%s,§b变动值: %s"
        ],
        "tranmoney": [
            "§b经济变动:您现在拥有: §e%s §f%s,§b变动值: %s",
            "§b经济变动:您现在拥有: §e%s §f%s,§b变动值: %s"
        ],
        "moneyset": [
            "§a操作成功!TA现在拥有 §f%s §b为 §e%s",
            "§c操作失败!原因未知!",
            "§c操作失败,原因:玩家对象不存在或者设置的参数为负数",
            "§c命令输入错误,请检查后重试"
        ],
        "moneyquery": [
            "§b你还剩余: §e%s §f%s",
            "§a玩家: §e%s §b还剩余: §e%s §f%s",
            "§c该玩家对象不存在"
        ],
        "moneypay": [
            "§c请输入正整数!",
            "§b转账成功!剩余余额: §e%s §f%s",
            "§c余额不足!剩余: §e%s §f%s",
            "§c对方的数据不存在!",
            "§c命令输入错误，请检查后重试"
        ],
        "moneyadd": [
            "§a操作成功!TA现在拥有 §f%s §b为 §e%s",
            "§c操作失败!原因未知!",
            "§c操作失败,原因:玩家对象不存在或者得出货币为负数",
            "§c命令异常，请检查后重试"
        ],
        "moneyreduce": [
            "§c命令异常,请检查后重试"
        ],
        "TPAload": [
            "/tpa <input:playername> 向某人发起tpa请求(消耗%s经济)",
            "打开TPA总GUI",
            "/tpahere <input:playername> 向某人发起TPAHERE请求(消耗%s经济)",
            "同意某玩家的TPA(HERE)请求(消耗对方%s经济)",
            "拒绝某玩家的TPA(HERE)请求/取消自己的TPA(HERE)请求",
            "开启或者关闭别人向你发tpa(here)所弹出的ui"
        ],
        "DELTPA": [
            "§c你发给玩家 §e%s §c的TPA请求已过期",
            "§c玩家 §e%s §c发给你的TPA请求已过期",
            "§c你发给玩家 §e%s §c的TPAHERE请求已过期",
            "§c玩家 §e%s §c发给你的TPAHERE请求已过期"
        ],
        "tpaui": [
            "§b请求UI已关闭",
            "§b请求UI已开启"
        ],
        "tpagui": [
            "§l§b请选择一个玩家",
            "§l§a请选择TPA类型",
            "[\"我传送过去\", \"TA传送过来\"]",
            "§l§b成功后消耗%s经济",
            "§l§c表单已放弃",
            "§c您输入的命令异常，请检查后再重试!"
        ],
        "tpa": [
            "§c没有找到玩家对象",
            "§b玩家 §e%s §b向你发送了一个TPA请求,/tpaaccept同意请求,/tpadeny拒绝请求",
            "§b你成功的向玩家 §e%s §b发起了TPA请求,/tpadeny取消请求",
            "§l§b玩家 §e%s §b向你发送了一个TPA请求\n(消耗对方%s经济)\n请选择:",
            "§l§dTPA请求",
            "同意请求",
            "拒绝请求",
            "§l§d请求未处理",
            "§l§b你已经发起了一个TPA(HERE)请求,但是对方没有回应,请选择:",
            "放弃上一次请求并发起这一次请求",
            "继续等待并放弃这次请求",
            "§b正在等待...",
            "§b已放弃表单",
            "§c对方有一个未处理的TPA(HERE)请求,无法发起请求",
            "§c您输入的命令异常，请检查后重试"
        ],
        "tpahere": [
            "§c没有找到玩家对象",
            "§b玩家 §e%s §b向你发送了一个TPAHERE请求,/tpaaccept同意请求,/tpadeny拒绝请求",
            "§b你成功的向玩家 §e%s §b发起了TPAHERE请求,/tpadeny取消请求",
            "§l§b玩家 §e%s §b向你发送了一个TPAHERE请求\n(消耗对方%s经济)\n请选择:",
            "§l§dTPAHERE请求",
            "同意请求",
            "拒绝请求",
            "§l§d请求未处理",
            "§l§b你已经发起了一个TPA(HERE)请求,但是对方没有回应,请选择:",
            "放弃上一次请求并发起这一次请求",
            "继续等待并放弃这次请求",
            "§b正在等待...",
            "§b已放弃表单",
            "§c对方有一个未处理的TPA(HERE)请求,无法发起请求",
            "§c您输入的命令异常，请检查后重试"
        ],
        "tpac": [
            "§b玩家 §e%s §b接受了你的TPA请求",
            "§b你接受了玩家 §e%s §b的TPA请求",
            "§cTPA失败,原因:对方经济不足",
            "§cTPA失败,请检查经济",
            "§c玩家对象丢失",
            "§b玩家 §e%s §b接受了你的TPAHERE请求",
            "§b你接受了玩家 §e%s §b的TPAHERE请求",
            "§cTPAHERE失败,原因:对方经济不足",
            "§cTPAHERE失败,请检查经济",
            "§c玩家对象丢失",
            "§c您还没有待处理的TPA(HERE)请求",
            "§c您输入的命令异常，请检查后重试"
        ],
        "tpad": [
            "§c玩家 §e%s §c拒绝了你的TPA请求",
            "§c你拒绝了玩家 §e%s §c的TPA请求",
            "§c玩家 §e%s §c拒绝了你的TPAHERE请求",
            "§c你拒绝了玩家 §e%s §c的TPAHERE请求",
            "§b对方取消了发给你的TPA(HERE)请求",
            "§b你已取消你发起的TPA(HERE)请求",
            "§c你没有待处理的TPA(HERE)请求",
            "§c您输入的命令异常，请检查后重试"
        ],
        "tpaleft": [
            "§b你发给玩家 §e%s §b的TPA(HERE)请求因为对方退出游戏而被强制取消",
            "§b你发给玩家 §e%s §b的TPA(HERE)请求因为对方退出游戏而被强制取消",
            "§b玩家 §e%s §b发给你的TPA(HERE)请求因为TA退出游戏而被强制取消"
        ],
        "HOMEload": [
            "HOME命令",
            "打开HOME总GUI",
            "/home go <input:homename> 前往某个家(需要%s经济)",
            "/home del <input:homename> 删除某个家(回退%s经济)",
            "/home add <input:homename> 添加一个家(需要%s经济)",
            "列出自己的所有家",
            "/homeas <input:playername> <add:del:go:ls> <homename:homename:homename:> 管理某个人的家",
            "打开HOMEAS总GUI"
        ],
        "HOMEtp": [
            "§b传送到家(\"%s\")成功"
        ],
        "homegui": [
            "§l§b表单选项如下,请选择一个",
            "[\"§l§b添加家\", \"§l§a前往家\", \"§l§c删除家\"]",
            "§l§b输入你要创建家的名字\n§a此过程需要消耗 §e%s §f%s §a您还剩余: §e%s §f%s",
            "§b表单已放弃",
            "§c您当前没有添加任何家",
            "§l§b表单选项如下,请选择一个\n§a此过程需要消耗 §e%s §f%s §a您还剩余 §e%s §f%s",
            "§b表单已放弃",
            "§l§c选择一个家进行删除\n§a此过程可以回退 §e%s §f%s §a您还剩余: §e%s §f%s",
            "§b表单已放弃",
            "§b您还没有添加任何家",
            "§b表单已放弃"
        ],
        "homego": [
            "§b请输入至少一个字符",
            "§b你目前还没有这个名字的家",
            "§c传送失败,请检查经济",
            "§c命令输入有误,请检查后重试"
        ],
        "homeadd": [
            "§b请输入至少一个字符",
            "§c你已经有这个家了,不能重复添加相同名字的家",
            "§b添加家(\"%s\")成功",
            "§c添加失败,请检查经济",
            "§c添加失败,您的家数量满 %s 个了!",
            "§c命令输入有误，请检查后重试"
        ],
        "homedel": [
            "§b请输入至少一个字符",
            "§b已成功删除家(\"%s\")",
            "§c删除家失败,原因未知",
            "§c家(\"%s\")不存在",
            "§c命令输入有误，请检查后重试"
        ],
        "homels": [
            "§c您还没有添加任何家",
            "§a你现在拥有家: %s",
            "§c您输入的命令有误,请检查后重新输入"
        ],
        "homeasgui": [
            "§l§c选择一个玩家进行管理",
            "§c只能选择一个玩家进行管理",
            "§l§b表单选项如下,请选择一个",
            "[\"§l§b添加TA的家\", \"§l§a前往TA的家\", \"§l§c删除TA的家\"]",
            "§l§b输入你要创建的家名字:",
            "§b表单已放弃",
            "§cTA当前没有添加任何家",
            "§l§b表单选项如下,请选择一个",
            "§b表单已放弃",
            "§l§c选择一个TA的家进行删除",
            "§b表单已放弃",
            "§bTA还没有添加任何家",
            "§b表单已放弃",
            "§b表单已放弃",
            "§c命令错误，请检查后重试"
        ],
        "homeas": [
            "§cTA的家数量已经满 %s 个了,请删除一些后再试",
            "§a修改成功",
            "§cTA已经有这个家了,不能重复添加,请尝试换一个名字",
            "§cTA的这个家不存在",
            "§b删除TA家(\"%s\")成功",
            "§cTA的这个家不存在",
            "§cTA还没添加任何家",
            "§aTA现在拥有家: %s",
            "§c您输入的命令有误,请检查后再重试",
            "§c您输入的命令有误,请检查后再重试"
        ],
        "WARPload": [
            "WARP命令",
            "打开WARP总表单",
            "/warp go <input:warpname>前往某传送点(需要%s经济)",
            "/warp add <input:warpname>增加某传送点",
            "/warp del <input:warpname>删除某传送点",
            "列出所有传送点"
        ],
        "WARPtp": [
            "§b传送到传送点(\"%s\")成功"
        ],
        "warpgui": [
            "§l§b表单选项如下，请选择一个\n§a此过程需要消耗 §e%s §f%s §a您还剩余 §e%s §f%s",
            "§b表单已放弃",
            "§b传送点列表为空",
            "§l§b表单选项如下，请选择一个:",
            "[\"§l§b添加传送点\", \"§l§a前往传送点\", \"§l§c删除传送点\"]",
            "§l§a输入你想创建的WARP名字",
            "§b表单已放弃",
            "§l§b表单选项如下，请选择一个\n§a此过程需要消耗 §e%s §f%s §a您还剩余 §e%s §f%s",
            "§b表单已放弃",
            "§b传送点列表为空",
            "§l§c选择一个WARP名字进行删除",
            "§b表单已放弃",
            "§b传送点列表为空",
            "§b表单已放弃"
        ],
        "warpgo": [
            "§b请输入至少一个字符",
            "§c传送点(\"%s\")不存在",
            "§c传送失败,请检查经济!",
            "§c您输入的指令有误,请检查后重试"
        ],
        "warpadd": [
            "§b请输入至少一个字符",
            "§b传送点(\"%s\")创建成功",
            "§c添加失败,已经有这个传送点了",
            "§c您输入的指令有误,请检查后重试"
        ],
        "warpdel": [
            "§b请输入至少一个字符",
            "§c删除失败,该传送点不存在",
            "§b传送点(\"%s\")删除成功",
            "§c您输入的指令有误,请检查后重试"
        ],
        "warpls": [
            "§b当前没有可用传送点",
            "§b当前传送点有:%s",
            "§c您输入的指令有误,请检查后重试"
        ],
        "BACKload": [
            "回到上一次暴毙点(消耗%s经济)",
            "查询死亡记录"
        ],
        "BACKtp": [
            "§b传送到暴毙点成功"
        ],
        "backto": [
            "主世界",
            "地狱",
            "末地",
            "§l§b你最近的暴毙信息:%s %s %s %s,时间:%s\n§a返回死亡点需要§a %s §f%s,§a你还拥有 §e%s §f%s §b确定要继续吗？",
            "前往暴毙点",
            "退出界面",
            "§c暴毙点传送失败,请检查余额",
            "§b已关闭表单",
            "§b已放弃表单",
            "§c无死亡记录"
        ],
        "BACKPlDie": [
            "主世界",
            "地狱",
            "末地",
            "§b你暴毙了,你的暴毙点:%s %s %s %s,时间:%s 使用/back可返回死亡地点"
        ],
        "death": [
            "主世界",
            "地狱",
            "末地",
            "%s/%s: 地点:%s 时间:%s",
            "§b你没有死亡记录"
        ],
        "NOTICEload": [
            "查看公告",
            "设置公告"
        ],
        "doneform": [
            "继续设置",
            "退出设置",
            "§b已关闭公告设置",
            "§b已放弃表单"
        ],
        "setNotice": [
            "§l§a请选择一项:",
            "[\"§l§a设置标题\", \"§l§b设置内容\"]",
            "§b表单已放弃"
        ],
        "settitle": [
            "§l§b请输入公告标题",
            "§l§a设置完成\n§b请选择:",
            "§l§b表单已放弃"
        ],
        "setcontent": [
            "§l§b增加一行",
            "§l§c删除一行",
            "§l§b请选择要编辑的行数",
            "请修改成你想要的样子",
            "§l§a操作完成\n§b请选择:",
            "§b表单已放弃",
            "无内容",
            "§l§a操作完成\n§b请选择:",
            "§l§c选择一行进行删除",
            "§l§a操作完成\n§b请选择:",
            "§b表单已放弃",
            "§b表单已放弃"
        ],
        "Shopload": [
            "打开总商店GUI",
            "打开购入商店GUI",
            "打开回收商店GUI"
        ],
        "shopgui": [
            "[\"买入\", \"卖出\"]",
            "§l§b请做出选择",
            "§b表单已放弃"
        ],
        "shopBuy": [
            "§l§b选择一个项目",
            "§l§b详情信息:\n物品:§a%s§b,\n特殊值:§a%s§b,\n花费经济:§a%s/一个§b,\n拥有经济:§a%s§b,\n备注:%s,\nTips:请输入正数",
            "请输入需要购买的个数",
            "§b购买成功",
            "§c购买失败,无法给予不存在的物品",
            "§c购买失败,请检查经济",
            "§c请输入大于零的数字",
            "§c请输入数字",
            "§b表单已放弃",
            "§c商店类型越界",
            "§b表单已放弃",
            "§c商店配置错误"
        ],
        "shopSell": [
            "§l§b选择一个项目",
            "§l§b详情信息:\n物品:§a%s§b,\n特殊值:§a%s§b,\n获得经济:§a%s/一个§b,\n拥有经济:§a%s§b,\n备注:%s\nTips:请输入正数",
            "请输入需要回收的个数",
            "§b回收成功",
            "§c回收失败,无法回收不存在于物品栏的物品",
            "§c回收失败,您的物品数量不足",
            "§c请输入大于零的数字",
            "§c请输入数字",
            "§b表单已放弃",
            "§c商店类型越界",
            "§b表单已放弃",
            "§c商店配置错误"
        ],
        "TPRload": [
            "随机传送置世界某处(消耗%s经济)"
        ],
        "tpr": [
            "§b请等待区块加载...",
            "§b正在寻找安全坐标...",
            "§c未能tpr成功!未能找到安全坐标!请重试!",
            "§a已将您传送置§e(%s,%s,%s,%s)",
            "§c随机传送失败,请检查经济"
        ],
        "RELOADCHUCKload": [
            "重新载入已加载区块(消耗%s经济)"
        ],
        "rc": [
            "§b已成功加载区块",
            "§c刷新区块失败,请检查经济"
        ],
        "WriteUseLog": [
            "时间,维度,主体,XYZ,事件,数据"
        ],
        "load": [
            "重新从文件加载数据"
        ]
    },
    defaultShopdata = {//预释放商店实例文件（勿改）
        "Buy": [
            {
                "name": "xx分类",
                "type": "group",
                "image": "textures/items/book_portfolio.png",
                "data": [
                    {
                        "name": "空气",
                        "type": "exam",
                        "image": "",
                        "data": {
                            "type": "minecraft:air",
                            "aux": 0,
                            "remark": "test",
                            "money": 11
                        }
                    },
                    {
                        "name": "bread",
                        "type": "exam",
                        "image": "textures/items/bread.png",
                        "data": {
                            "type": "minecraft:bread",
                            "aux": 0,
                            "remark": "a bread",
                            "money": 2
                        }
                    }
                ]
            },
            {
                "name": "air",
                "type": "exam",
                "data": {
                    "type": "minecraft:air",
                    "aux": 0,
                    "remark": "air",
                    "money": 11
                }
            }
        ],
        "Sell": [
            {
                "name": "xx分类",
                "type": "group",
                "image": "textures/items/book_portfolio.png",
                "data": [
                    {
                        "name": "空气",
                        "type": "exam",
                        "image": "",
                        "data": {
                            "type": "minecraft:air",
                            "aux": 0,
                            "remark": "111",
                            "money": 11
                        }
                    },
                    {
                        "name": "bread",
                        "type": "exam",
                        "image": "textures/items/bread.png",
                        "data": {
                            "type": "minecraft:bread",
                            "aux": 0,
                            "remark": "bread",
                            "money": 1
                        }
                    }
                ]
            },
            {
                "name": "redstone",
                "type": "exam",
                "image": "textures/items/redstone_dust.png",
                "data": {
                    "type": "minecraft:redstone",
                    "aux": 0,
                    "remark": "readstone",
                    "money": 11
                }
            }
        ]
    },
    TickTask = new function () {//重要操作应发送至下个Tick运行
        this.tasks = [];
        this.add = (code) => {
            this.tasks.push(code);
        };
    }(),
    TMdata = new function () {//配置文件系统重写版
        this.openConfig = function (path, none, defaultt = "{}") {
            if (typeof (path) !== "string") {
                throw new Error("Path should be a string!!!");
            } else if (typeof (defaultt) != "string") {
                throw new Error("Default should be a string!!!");
            } else {
                let jsontmp = JSON.parse(defaultt), Tpath = path.replace(/[/]/g, '\\'), newData = file.readFrom(path), TMParr = Tpath.split('\\');
                TMParr.pop();
                let dir = TMParr.join('\\');
                if (newData == null) {
                    file.mkdir(dir);
                    newData = JSON.stringify(jsontmp, null, 2);
                    file.writeTo(path, newData);
                }
                return new function (data, path, dir) {
                    let time = Date.now(),
                        nowOBJ = null, saveTask = false;//使用缓存
                    function getOBJ() {
                        let Time = Date.now();
                        if ((Time - time) >= 1000 || nowOBJ == null) {
                            nowOBJ = JSON.parse(data);
                            time = Time;
                        }
                        return nowOBJ;/*删除 DeepCopy*/
                    }
                    function setOBJ(da) {
                        nowOBJ = da;
                        asyncSave();
                        return true;
                    }
                    function asyncSave() {
                        if (!saveTask) {
                            saveTask = true;
                            let Tpath = path.replace(/[/]/g, '\\'),
                                Path = path;
                            TickTask.add(() => {
                                try {
                                    data = JSON.stringify(nowOBJ, null, 2);
                                    let TMParr = Tpath.split('\\');
                                    TMParr.pop();
                                    let dir = TMParr.join('\\');
                                    file.mkdir(dir);
                                    file.writeTo(Path, data);
                                    saveTask = false;
                                } catch (e) {
                                    ErrorMsg(e);
                                }
                            });
                        }
                    }
                    this.asyncSave = asyncSave;
                    this.isSafe = function () {
                        try { JSON.parse(data); return true; }
                        catch (_) { return false; };
                    };
                    this.init = function (name, defaul) {
                        try {
                            let Data = getOBJ();
                            if (Data[name] == null) {
                                Data[name] = defaul;
                                setOBJ(Data);
                                return defaul;
                            } else {
                                return Data[name];
                            }
                        } catch (e) {
                            ErrorMsg(e);
                            return null;
                        }
                    };
                    this.set = function (name, aata) {
                        try {
                            let Data = getOBJ();
                            Data[name] = aata;
                            setOBJ(Data);
                            return true;
                        } catch (e) {
                            ErrorMsg(e);
                            return false;
                        }
                    };
                    this.get = function (name, defaul = null) {
                        try {
                            let Data = getOBJ();
                            if (Data[name] == null) {
                                return defaul;
                            } else {
                                return Data[name];
                            }
                        } catch (e) {
                            ErrorMsg(e);
                            return null;
                        }
                    };
                    this.delete = function (name) {
                        try {
                            let Data = getOBJ();
                            delete Data[name];
                            setOBJ(Data);
                            return true;
                        } catch (e) {
                            ErrorMsg(e);
                            return false;
                        }
                    };
                    this.reload = function () {
                        try {
                            file.mkdir(dir);
                            let newData = file.readFrom(path);
                            data = newData;
                            time -= 8000;
                            return true;
                        } catch (e) {
                            ErrorMsg(e);
                            return false;
                        }
                    };
                    this.close = function () {
                        try {
                            let ks = Object.keys(this),
                                i = 0,
                                l = ks.length;
                            while (i < l) {
                                delete this[ks[i]];
                                i++;
                            }
                            return true;
                        } catch (e) {
                            ErrorMsg(e);
                            return false;
                        }
                    };
                    this.getPath = function () {
                        return path;
                    };
                    this.read = function () {
                        return JSON.stringify(getOBJ(), null, 2);
                    };
                    this.write = function (content) {
                        try {
                            if (typeof (content) == "string") {
                                file.mkdir(dir);
                                file.writeTo(path, content);
                                data = content;
                                time -= 8000;
                                return true;
                            } else {
                                throw new Error("content should be a string!!!");
                            }
                        } catch (e) {
                            ErrorMsg(e);
                            return false;
                        }
                    };
                }(newData, path, dir);
            }
        }
    }(),
    TMLS = new function () {//TMET虚拟监听
        this.listenList = {};
        this.listen = function (key, func) {
            try {
                let id = system.randomGuid();
                if (TMLS.listenList[key] == null) {
                    TMLS.listenList[key] = {};
                }
                TMLS.listenList[key][id] = func;
                logger.debug("虚拟监听", '"' + key + '"', "创建:", id);
                return id;
            } catch (err) {
                ErrorMsg(err);
            }
        };
        this.listenDel = function (id) {
            try {
                let i = 0,
                    k = Object.keys(TMLS.listenList),
                    l = k.length;
                while (i < l) {
                    let ii = 0,
                        kk = Object.keys(TMLS.listenList[k[i]]),
                        ll = kk.length;
                    while (ii < ll) {
                        if (ii == id) {
                            delete TMLS.listenList[k[i]][kk[ii]];
                            logger.debug("虚拟监听", '"' + i + '"', "删除:", id);
                            return true;
                        }
                        ii++;
                    }
                    i++;
                }
                return false;
            } catch (err) {
                ErrorMsg(err);
            }
        };
    }(),
    TMCmd = new function () {
        this.PlCmds = {};
        this.CoCmds = {};
        this.regPlayerCmd = (cmd, de, func, perm) => {
            if (TMCmd.PlCmds[cmd] != null) {
                throw new Error("Player command repeat registration!");
            }
            TMCmd.PlCmds[cmd] = {
                "func": func,
                "perm": perm
            };
            if (mc.setCmdDescribe != null) {
                mc.setCmdDescribe(cmd, de, perm);
            } else {
                mc.regPlayerCmd(cmd, de, (_) => { return false; }, perm);
            }
        };
        this.regConsoleCmd = (cmd, de, func) => {
            if (TMCmd.CoCmds[cmd] != null) {
                throw new Error("Console command repeated registration!");
            }
            TMCmd.CoCmds[cmd] = {
                "func": func,
            };
            if (mc.setCmdDescribe != null) {
                mc.setCmdDescribe(cmd, de, 4);
            } else {
                mc.regConsoleCmd(cmd, de, (_) => { return false; });
            }
        };
    }(),
    ISNJS = false;

//错误信息处理
function ErrorMsg(err) {
    try {
        file.mkdir('.\\logs\\Error');
        logger.error("\033[1;31m" + GL("default", "ErrorMsg", 0) + (!IsPFLoader() ? err.stack : err) + "\033[0m\033[1m");
        let Errmsg = {
            "time": system.getTimeStr(),
            "version": version,
            "stack": (!IsPFLoader() ? err.stack : err),
            "fs": {},
            "langPacks": {},
            "TMET": file.readFrom(`${getLoadPath()}\\TMEssential.js`)
        },
            isError = true;
        try {
            let i = 0,
                k = Object.keys(fs),
                l = k.length;
            while (i < l) {
                if (!fs[k[i]].isSafe()) {
                    throw fs[k[i]].getPath();
                }
                Errmsg.fs[k[i]] = JSON.parse(fs[k[i]].read());
                i++;
            }
            if (isObject(tmp.language)) {
                i = 0, k = Object.keys(tmp.language), l = k.length;
                while (i < l) {
                    if (!tmp.language[k[i]].isSafe()) {
                        throw tmp.language[k[i]].getPath();
                    }
                    Errmsg.langPacks[k[i]] = JSON.parse(tmp.language[k[i]].read());
                    i++;
                }
            }
        } catch (err) {
            if (typeof (err.message) != "string") {
                isError = false;
                logger.error("\033[1;31m" + GL("default", "ErrorMsg", 1, err) + "\033[0m\033[1m");
                logger.error("\033[1;31m" + GL("default", "ErrorMsg", 2) + "\033[0m\033[1m");
            }
        }
        if (err.message.search("SystemCmd") != -1) {
            isError = false;
        }
        if (isError) {
            let TO = system.getTimeObj(),
                fiid = `${TO.Y}-${TO.M}-${TO.D}-${TO.h}-${TO.m}-${TO.s}-${TO.ms}.TMETERROR`,
                ErPath = `.\\logs\\Error\\${fiid}`;
            file.writeTo(ErPath, JSON.stringify(Errmsg, null, 2));
            logger.info("\033[1;32m" + GL("default", "ErrorMsg", 3, ErPath) + "\033[0m\033[1m");
        }
    } catch (e) {
        let log_ = (typeof (log) != "function" ? console.log : log);
        log_('\033[1;31m[Error]TMET不支持此加载器!!!\033[0m\033[1m');
    }
}

function listenExample(key, a, b, c, d, e, f, g, h) {
    try {
        if (TMLS.listenList[key] != null) {
            let retu = true,
                i = 0,
                k = Object.keys(TMLS.listenList[key]),
                l = k.length;
            while (i < l) {
                let jie = null;
                try {
                    jie = TMLS.listenList[key][k[i]](a, b, c, d, e, f, g, h);
                } catch (e) {
                    ErrorMsg(e);
                }
                if (jie != null && !jie && retu) {
                    retu = false;
                }
                i++;
            }
            return retu;
        }
    } catch (err) {
        ErrorMsg(err);
    }
}

//异步RunCmdAs
function plRunCmdAs(xuid, cmd) {
    TickTask.add(() => {
        let pl = mc.getPlayer(xuid);
        if (pl != null) {
            pl.runcmd(cmd);
        }
    });
    return true;
}

//引号过滤！！！！！！！！
function cmdFH(str = "") {
    let re = /[#]*"([^"]+)"|([^#]+)/g;
    let match;
    str = str.replace(/[ ]/g, '#');
    let arr = [];
    while (match = re.exec(str)) {
        let val = (match[1] || match[2]).replace(/[#]/g, ' '),
            index = (val.indexOf("\"")),
            lastIndex = (val.lastIndexOf("\"") + 1);
        if (index == -1 || (index == (lastIndex - 1))) {
            arr.push(val);
            continue;
        }
        let value = val.slice(index, lastIndex).replace(/"/g, '\\\"');
        value = value.replace("\\", "");
        let va = value.split(""), tmp;
        va[(va.length - 2)] = "";
        try {
            tmp = JSON.parse(`{"key": ${va.join("")}}`);
        } catch (_) {
            tmp = { "key": va.join("") };
        }
        arr.push(tmp.key);
    }
    return arr;
}

/**
 * 2022/3/31 14:52
 * 不需要用到了
 * 更换命令匹配方式
//匹配相似度
function similar(s, t, f) {
    if (typeof (s) != "string" || typeof (t) != "string") {
        return 0;
    }
    let l = (s.length > t.length ? s.length : t.length),
        n = s.length, m = t.length, d = [],
        min = function (a, b, c) {
            return a < b ? (a < c ? a : c) : (b < c ? b : c);
        };
    f = (f || 3);
    let i, j, si, tj, cost;
    if (n === 0) return m;
    if (m === 0) return n;
    for (i = 0; i <= n; i++) {
        d[i] = [];
        d[i][0] = i;
    }
    for (j = 0; j <= m; j++) {
        d[0][j] = j;
    }
    for (i = 1; i <= n; i++) {
        si = s.charAt(i - 1);
        for (j = 1; j <= m; j++) {
            tj = t.charAt(j - 1);
            if (si === tj) {
                cost = 0;
            } else {
                cost = 1;
            }
            d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        }
    }
    let res = (1 - d[n][m] / l);
    return res.toFixed(f);
}
 */

//是否为obj
function isObject(exp) {
    return Object.prototype.toString.call(exp) == '[object Object]'
}

//是否为arr
function isArray(arr) {
    return Object.prototype.toString.call(arr) == '[object Array]';
}

//floor
function floor1(num) {
    return Math.floor(num * 10) / 10;
}

function giveSlow_falling(pl) {
    runcmdEx(`/effect "${pl.name}" slow_falling 2 1 true`);
    return true;
}

function sendSelectForm(pl, title, content, oriButtons, pageNum, cb, nowButtons, nowPage = 0, nowInput = "", nowSels = []) {
    nowButtons = (nowButtons || oriButtons);
    let buts = splitArr(nowButtons, pageNum);
    let nf = mc.newCustomForm();
    nf.setTitle(title);
    nf.addLabel(content);
    nf.addInput(GL(pl.xuid, "sendSelectForm", 0), "(String)", nowInput);
    nf.addSwitch(GL(pl.xuid, "sendSelectForm", 1), false);
    nf.addSlider(GL(pl.xuid, "sendSelectForm", 2), 0, (buts.length - 1), 1, nowPage);
    nf.addLabel(GL(pl.xuid, "sendSelectForm", 3, nowSels.join(",")));
    let i = 0, l = buts[nowPage].length;
    while (i < l) {
        let bu = buts[nowPage][i];
        nf.addSwitch(bu, (nowSels.indexOf(bu) != -1));
        i++;
    }
    pl.sendForm(nf, (pl, args) => {
        if (args == null) { cb(pl, null); return; }
        args.shift();
        let [keyWord, isOK, Page] = [args.shift(), args.shift(), args.shift()];
        keyWord = keyWord.trim();
        if (Page < 0) { Page = 0; }
        if (Page == 1 && buts.length == 1) { Page = 0; }
        args.shift();
        let l = args.length, i = 0;
        while (i < l) {
            let bu = buts[nowPage][i];
            if (args[i]) {
                if (nowSels.indexOf(bu) == -1) {
                    nowSels.push(bu);
                }
            } else {
                let index = nowSels.indexOf(bu);
                if (index != -1) {
                    nowSels.splice(index, 1);
                }
            }
            i++
        }
        if (!isOK) {
            let butts = nowButtons;
            if (nowInput != keyWord) {//serach
                if (keyWord == "") { butts = oriButtons; }
                else {
                    let kw = keyWord.toLowerCase();
                    let obj = [], l = oriButtons.length, i = 0;
                    while (i < l) {
                        let bu = oriButtons[i];
                        let index = (bu.toLowerCase()).indexOf(kw);
                        if (index != -1) {
                            obj.push({ "button": bu, "Index": index });
                        }
                        i++;
                    }
                    obj.sort((a, b) => { return (a.Index - b.Index) });
                    butts = [];
                    l = obj.length, i = 0;
                    while (i < l) {
                        butts.push(obj[i++].button);
                    }
                }
            }
            sendSelectForm(pl, title, content, oriButtons, pageNum, cb, butts, Page, keyWord, nowSels);
        } else {
            let ids = [], l = nowSels.length, i = 0;
            while (i < l) {
                ids.push(oriButtons.indexOf(nowSels[i++]));
            }
            cb(pl, ids);
        }
    });
}

function splitArr(arr, num) {
    let newArr = [];
    let i = 0, l = arr.length;
    while (i < l) {
        newArr.push(arr.slice(i, i += num));
    }
    return (newArr.length != 0 ? newArr : [[]]);
}

let isExCmding = false;
let output = null;

function runcmdEx(cmd) {
    isExCmding = true;
    mc.runcmd(cmd);
    isExCmding = false;
    let o = output;
    output = null;
    return o;
}

/*
    2022/2/9 13:09
    emmm，提升性能，注释了））
//深拷贝
function DeepCopy(obj) {
    if (typeof (obj) != "object") { return obj; };
    if (isObject(obj)) {
        let newObj = {}, keys = Object.keys(obj),
            l = keys.length, i = 0;
        while (i < l) {
            let key = keys[i++];
            if (isObject(obj[key]) || isArray(obj[key])) {
                newObj[key] = DeepCopy(obj[key]);
            } else {
                newObj[key] = obj[key];
            }
        }
        return newObj;
    } else {
        let newArr = [], l = obj.length, i = 0;
        while (i < l) {
            let val = obj[i++];
            if (isObject(val) || isArray(val)) {
                newArr.push(DeepCopy(val));
            } else {
                newArr.push(val);
            }
        }
        return newArr;
    }
}
*/

//获取加载器加载路径
function getLoadPath() {
    if (!ISNJS) {
        return ".\\plugins";
    }
    let dir = "",
        ISPF = IsPFLoader();
    if (ISPF) {
        PFConf = TMdata.openConfig(".\\plugins\\PFJSR\\config.json", "");
        dir = PFConf.get("JSR")["Path"];
    } else {
        NetConf = data.openConfig(".\\plugins\\settings\\netjs.ini", "ini");
        dir = NetConf.getStr("NETJS", "jsdir");
    }
    return dir;
}

function IsPFLoader() {
    let ISPF = false;
    if (!ISNJS) {
        return ISNJS;
    }
    try {
        aaa();
    } catch (e) {
        ISPF = (e.stack == null);
    }
    return ISPF;
}

//使用文件判断OP
function fIsOP(xuid) {
    let pl = mc.getPlayer(xuid);
    if (pl != null) {
        return pl.isOP();
    }
    /*
        2022/2/9 13:06
        换了，hhh
    let perms = JSON.parse(file.readFrom(".\\permissions.json")),
        i = 0,
        l = perms.length;
    while (i < l) {
        let plPerm = perms[i];
        if (plPerm.xuid == xuid) {
            if (plPerm.permission == "operator") {
                return true;
            } else {
                return false;
            }
        }
        i++;
    }
    */
    return false;
}

//是否为数字
function checkNumber(theObj) {
    try {
        if (typeof (JSON.parse(theObj)) == "number") {
            return true;
        }
        return false;
    } catch (_) {
        return false;
    }
}

//返回数字
function getNumber(val) {
    try {
        return JSON.parse(val);
    } catch (_) {
        return val;
    }
}

function ST(pl, text) {
    pl.tell(`§l§6[TMET] ${text}`, 0);//请不要改我的标识!
}

/* 
 * 2022/2/4 21:35
 * 暂不需要
 */
//添加效果
// function addEffect(pl, id, sec, level, dis) {
//     try {
//         let PN = pl.getNbt(),
//             eff = PN.getTag('ActiveEffects') || new NbtList(),
//             Tag = new NbtList(),
//             i = 0,
//             len = eff.getSize();
//         while (len > i) {
//             let ef = eff.getTag(i);
//             Tag.addTag(new NbtCompound({
//                 "Ambient": ef.getTag('Ambient'),
//                 "Amplifier": ef.getTag('Amplifier'),
//                 "DisplayOnScreenTextureAnimation": ef.getTag('DisplayOnScreenTextureAnimation'),
//                 "Duration": ef.getTag('Duration'),
//                 "DurationEasy": ef.getTag('DurationEasy'),
//                 "DurationHard": ef.getTag('DurationHard'),
//                 "DurationNormal": ef.getTag('DurationNormal'),
//                 "Id": ef.getTag('Id'),
//                 "ShowParticles": ef.getTag('ShowParticles')
//             }))
//             i++;
//         }
//         Tag.addTag(new NbtCompound({
//             "Ambient": new NbtByte(0),
//             "Amplifier": new NbtByte(level),
//             "DisplayOnScreenTextureAnimation": new NbtByte(0),
//             "Duration": new NbtInt(sec * 20),
//             "DurationEasy": new NbtInt(sec * 20),
//             "DurationHard": new NbtInt(sec * 20),
//             "DurationNormal": new NbtInt(sec * 20),
//             "Id": new NbtByte(id),
//             "ShowParticles": new NbtByte(dis)
//         }))
//         PN.setTag('ActiveEffects', Tag);
//         pl.setNbt(PN);
//     } catch (e) {
//         ErrorMsg(e);
//     }
// }

//language
function LANGUAGEload() {
    try {
        logger.debug('load Language...');
        fs["LANGUAGE"] = TMdata.openConfig(".\\plugins\\Timiya\\data\\langsetting.json", "", '{}');
        try {
            tmp.language["zh_CN"] = TMdata.openConfig('.\\plugins\\Timiya\\lang\\zh_CN.json', '', JSON.stringify(defaultLangPack, null, 2));
        } catch (_) {
            logger.error("zh_CN LangPack is damaged!");
            logger.info("Auto fix zh_CN LangPack...");
            file.writeTo('.\\plugins\\Timiya\\lang\\zh_CN.json', JSON.stringify(defaultLangPack, null, 2));
            tmp.language["zh_CN"] = TMdata.openConfig('.\\plugins\\Timiya\\lang\\zh_CN.json', '', JSON.stringify(defaultLangPack, null, 2));
        }
        UpdateDefaultLangPack();
        logger.info("Standard LangPack: zh_CN Read");
        TMCmd.regPlayerCmd(fs.TMET.get("LANGUAGE")["Cmd"], `/${fs.TMET.get("LANGUAGE")["Cmd"]} [input:LangPackName] language`, SLanguage, 0);
        let files = file.getFilesList('.\\plugins\\Timiya\\lang'),
            i = 0,
            l = files.length;
        while (i < l) {
            let fi = files[i],
                fina = fi.split('.')[0],
                path = `.\\plugins\\Timiya\\lang\\${fi}`;
            if (!file.checkIsDir(path) && fi.split('.')[1] == "json" && fina != "zh_CN") {
                tmp.language[fina] = TMdata.openConfig(path, '', '{}');
                let iss = isStandardLangPack(fina);
                if (iss !== null && iss) {
                    logger.info("Standard LangPack: ", fina, " Read");
                } else if (iss !== null && !iss) {
                    logger.info("Non-Standard LangPack: ", fina, " Read");
                } else {
                    logger.error("The LangPack: ", fina, " Failed To Read");
                }
            }
            i++;
        }
    } catch (e) {
        ErrorMsg(e);
    }
}

function SLanguage(pl, cmd) {
    try {
        if (cmd.length == 1) {
            if (tmp.language[cmd[0]] == null) {
                ST(pl, '§cThe langPack does\'t exist!');
            } else {
                WriteUseLog("LANGUAGE-CHANGE", pl, pn);
                fs.LANGUAGE.set(pl.xuid, cmd[0]);
                ST(pl, '§aLangPack switch complete!');
            }
        } else {
            let newform = mc.newCustomForm(),
                lans = Object.keys(tmp.language);
            newform.setTitle("§l§dLANGUAGE");
            newform.addDropdown("§l§bPLS seltct a LangPack...", lans);
            pl.sendForm(newform, function (pl, s) {
                SLPcallback(pl, s, lans);
            });
        }
    } catch (e) {
        ErrorMsg(e);
    }
}

function SLPcallback(pl, sel, la) {
    try {
        if (sel != null) {
            let pn = la[sel[0]];
            if (tmp.language[pn] == null) {
                ST(pl, '§cThe LangPack Obj is missing!!!');
            } else {
                WriteUseLog("LANGUAGE-CHANGE", pl, pn);
                fs.LANGUAGE.set(pl.xuid, pn);
                ST(pl, '§aLangPack switch complete!');
            }
        } else {
            ST(pl, '§bThe form has been discorded')
        }
    } catch (e) {
        ErrorMsg(e);
    }
}

function UpdateDefaultLangPack() {
    let Temp = Object.keys(defaultLangPack),
        i = 0,
        l = Temp.length;
    try {
        JSON.parse(tmp.language.zh_CN.read());
    } catch (_) {
        logger.info("Auto repair zh_CN langPack cannot be resolved...");
        file.writeTo(tmp.language.zh_CN.getPath(), JSON.stringify(defaultLangPack, null, 2));
        tmp.language.zh_CN.reload();
        logger.info("Repair complete!");
    }
    while (i < l) {
        let key = Temp[i],
            da1 = tmp.language.zh_CN.get(key, []);
        if (key == "moneygui") {//热修改区
            if (da1[12] == "§l§b被转账人:%s,\n§aTA的余额:%s\n§a你的余额:%s,\n§b货币名称:%s") {
                da1.length = 0;
            }
        }
        if (key == "Moneyload") {
            if (da1[2] == "/money pay <input:playername> <input:Num> 向某人转账") {
                da1.length = 0;
            }
        }
        if (Array.isArray(da1)) {
            if (da1.length != defaultLangPack[key].length) {
                logger.info("zh_CN LangPack auto repair:", key);
                tmp.language.zh_CN.set(key, defaultLangPack[key]);
            }
        } else {
            logger.info("zh_CN LangPack auto repair:", key);
            tmp.language.zh_CN.set(key, defaultLangPack[key]);
        }
        i++;
    }
}

function isStandardLangPack(fi) {
    try {
        let AllObj = JSON.parse(tmp.language[fi].read()),
            ks = Object.keys(AllObj),
            i = 0,
            l = ks.length;
        while (i < l) {
            let key = ks[i];
            if (Array.isArray(AllObj[key])) {
                let aa = AllObj[key],
                    ii = 0,
                    ll = aa.length;
                if (defaultLangPack[key] != null && defaultLangPack[key].length == aa.length) {
                    while (ii < ll) {
                        let ar = aa[ii];
                        if (typeof (ar) != "string") {
                            logger.error(`LangPack: ${fi} object: ${key} array element: ${ii} should be a string!`)
                            delete tmp.language[fi];
                            return null;
                        }
                        ii++;
                    }
                } else if (defaultLangPack[key] != null) {
                    logger.error(`LangPack: ${fi} object: ${key} array elements do not conform to the length, correct should be ${defaultLangPack[key].length} is not ${aa.length}!`);
                    delete tmp.language[fi];
                    return null;
                } else {
                    logger.error(`LangPack: ${fi} object: ${key} should not exist!`);
                    delete tmp.language[fi];
                    return null;
                }
            } else {
                logger.debug(`LangPack: ${fi} object: ${key} should be a array!`);
                delete tmp.language[fi];
                return null;
            }
            i++;
        }
        if (l != Object.keys(defaultLangPack).length) {
            return false;
        } else {
            return true;
        }
    } catch (e) {
        ErrorMsg(e);
        delete tmp.language[fi];
        return null;
    }
}

function GetLangExam(xuid, type, Num) {
    if (xuid == "default") {
        if (type == "ErrorMsg") {
            let haveTMETConf = (!!fs.TMET.isSafe());
            if (!haveTMETConf) { return defaultLangPack[type][Num]; }//配置文件受到破坏，返回内置数据
            let lan = fs.TMET.get("LANGUAGE")["Default"];
            if (tmp.language[lan] == null) {
                let lang = tmp.language.zh_CN;
                return (lang.get(type, null) || defaultLangPack[type])[Num];
            }
            return (tmp.language[lan].get(type, null) || defaultLangPack[type])[Num];
        }
        let lan = fs.TMET.get("LANGUAGE")["Default"];
        if (tmp.language[lan] == null) {
            return tmp.language.zh_CN.get(type)[Num];
        }//默认语言包不存在，使用zh_CN
        return (tmp.language[lan] != null ? tmp.language[lan].get(type) : tmp.language.zh_CN.get(type))[Num];
    } else {
        let dat = fs.LANGUAGE.get(xuid);
        if (dat == null) {
            return GetLangExam("default", type, Num);
        }
        return (tmp.language[dat] == null || tmp.language[dat].get(type, null) == null ?
            tmp.language.zh_CN.get(type) : tmp.language[dat].get(type))[Num];
    }
}

function GL(lan, type, Num, ...arg) {
    try {
        let lang = GetLangExam(lan, type, Num),
            i = 0, l = arg.length,
            DefaultLan = (fs.TMET.isSafe() ? fs.TMET.get("LANGUAGE")["Default"] : "zh_CN");
        while (i < l) {
            lang = lang.replace('%s', arg[i++]);
        }
        if (lang.indexOf('%s') == -1 && lang[0] != "[") { return lang; }//默认过滤
        try {
            JSON.parse(lang);
            return lang;
        } catch (_) { }
        logger.error(`Error in LangPack:<${(lan == "default" ? DefaultLan : fs.LANGUAGE.get(lan, DefaultLan))}>
    at lang:<${lang}>
    at Obj:<${type}>
    at Num:<${Num}>`);
        return "[\"LangPackError\"]";
    } catch (e) {
        ErrorMsg(e);
        return "[\"LangPackError\"]";
    }
}

//money
function Moneyload() {
    try {
        logger.debug('load Money...');
        fs["moneydata"] = TMdata.openConfig('.\\plugins\\Timiya\\data\\offlineMoney.json', 'json', '{}');
        if (ll.export(exportinfo, 'MONEY')) {
            logger.info("Money API Export successful");
        } else {
            logger.fatal("Money API Export FAIL");
        }
        TMLS.listen("onJoin", moneyjoin);
        TMLS.listen("onLeft", moneyleft);
        TMCmd.regPlayerCmd('money', GL("default", "Moneyload", 0), (pl, args) => { if (args.length == 0) { moneygui(pl, args); } else { return true; } }, 0);
        TMCmd.regPlayerCmd('money gui', GL("default", "Moneyload", 1), moneygui, 0);
        if (fs.TMET.get("Money")["MoneyType"] == "score") {
            TMLS.listen("onScoreChanged", scorechang);
            TMCmd.regPlayerCmd('money pay', GL("default", "Moneyload", 2, (getPayTax() * 100)), moneypay, 0);
            TMCmd.regPlayerCmd('money add', GL("default", "Moneyload", 3), moneyadd, 1);
            TMCmd.regPlayerCmd('money set', GL("default", "Moneyload", 4), moneyset, 1);
            TMCmd.regPlayerCmd('money reduce', GL("default", "Moneyload", 5), moneyreduce, 1)
            TMCmd.regPlayerCmd('money query', GL("default", "Moneyload", 6), moneyquery, 0);
            if (!ISNJS) {
                setTimeout(function () {
                    let score = mc.getScoreObjective('money');
                    if (score == null) {
                        mc.newScoreObjective('money', 'money');
                        logger.info(GL("default", "Moneyload", 7));
                    }
                }, 3000);
            }
        } else if (fs.TMET.get("Money")["MoneyType"] == "llmoney") {
            fs["llmoneyconf"] = TMdata.openConfig(".\\plugins\\LLMoney\\money.json", "json", "{}");
            setInterval(function () {
                llmoneychange();
            }, 3000);
        } else {
            logger.error(GL("default", "Moneyload", 8));
        }
    } catch (e) {
        ErrorMsg(e);
    }
}

function getPayTax() {
    let tax = 0.0;
    switch (fs.TMET.get("Money")["MoneyType"]) {
        case "score":
            tax = fs.TMET.get("Money")["PayTaxRate"];
            break;
        case "llmoney":
            tax = fs.llmoneyconf.get("pay_tax", 0.0);
            let conf = fs.TMET.get("Money");
            if (conf.PayTaxRate != tax) {
                conf.PayTaxRate = tax;
                fs.TMET.set("Money", conf);
            }
            break;
    }
    return Number(tax);
}

function scorechang(pl, num, name, disname) {
    try {
        let scorehh = `${pl.realName}_${num}_${disname}_${name}`;
        if (pl != null && name == 'money' && oldscore != scorehh && OnlinePlayer[pl.realName]) {
            let name = pl.realName;
            WriteUseLog("MONEY-CHANGE-SCORE", pl, num);
            setmoney(name, num);
        } else {
            oldscore = scorehh;
        }
    } catch (e) {
        ErrorMsg(e);
    }
}

function llmoneychange() {
    try {
        let list = Object.keys(OnlinePlayer),
            i = 0, l = list.length;
        while (i < l) {
            let pl = mc.getPlayer(list[i++]);
            if (pl != null) {
                let YMon = money.get(pl.xuid);
                if (YMon != fs.moneydata.get(pl.xuid) && OnlinePlayer[pl.realName]) {
                    WriteUseLog("MONEY-CHANGE-LLMONEY", pl, YMon);
                    setmoney(pl.realName, YMon);
                }
            }
        }
    } catch (e) {
        ErrorMsg(e);
    }
}

function moneygui(pl, args) {
    try {
        if (args.length != 0) {
            ST(pl, GL(pl.xuid, "moneygui", 0));
            return;
        }
        let buttons = JSON.parse(fIsOP(pl.xuid) ?
            GL(pl.xuid, "moneygui", 1) :
            GL(pl.xuid, "moneygui", 2)
        );
        pl.sendSimpleForm("§l§dMONEYGUI", GL(pl.xuid, "moneygui", 3), buttons, new Array(buttons.length).fill(""), MONEYGUICallBack);
    } catch (e) {
        ErrorMsg(e);
    }
    function MONEYGUICallBack(pl, id) {
        try {
            if (id == null) {
                ST(pl, GL(pl.xuid, "moneygui", 4));
                return;
            }
            if (id == 0) {
                let newForm = mc.newCustomForm();
                newForm.setTitle("§l§dMONEYPAY");
                newForm.addLabel(GL(pl.xuid, "moneygui", 5));
                newForm.addStepSlider(GL(pl.xuid, "moneygui", 6), JSON.parse(GL(pl.xuid, "moneygui", 7)), 0);
                pl.sendForm(newForm, (pl, id) => {
                    try {
                        let plDatas = [];
                        if (id == null) {
                            ST(pl, GL(pl.xuid, "moneygui", 8));
                            return;
                        }
                        if (id[1] == 0) {//在线模式
                            plDatas = (() => {
                                let rt = [],
                                    pls = mc.getOnlinePlayers(),
                                    l = pls.length,
                                    i = 0;
                                while (i < l) {
                                    let pl = pls[i];
                                    rt.push({
                                        "name": pl.realName,
                                        "loss": false
                                    });
                                    i++;
                                }
                                return rt;
                            })();
                        } else {//离线模式
                            plDatas = (() => {
                                let rt = [],
                                    offlineList = JSON.parse(fs.moneydata.read()),
                                    keys = Object.keys(offlineList),
                                    l = keys.length,
                                    i = 0;
                                while (i < l) {
                                    let xuid = keys[i],
                                        plName = data.xuid2name(xuid);
                                    rt.push({
                                        "name": (plName != "" ? plName : xuid),
                                        "loss": (plName != "" ? false : true)
                                    });
                                    i++;
                                }
                                return rt;
                            })();
                        }
                        let buts = (() => {
                            let azzzzz = [],
                                l = plDatas.length,
                                i = 0;
                            while (i < l) {
                                let obj = plDatas[i];
                                azzzzz.push(obj.name);
                                i++;
                            }
                            return azzzzz;
                        })();
                        sendSelectForm(pl, "§l§dMONEYPAY", GL(pl.xuid, "moneygui", 9),
                            buts, fs.TMET.get("SelectForm").Subsection, (pl, args) => {
                                try {
                                    if (args == null) {
                                        ST(pl, GL(pl.xuid, "moneygui", 10));//form Giveup
                                        return;
                                    } else if (args.length == 0) { return; }
                                    if (args.length > 1) {
                                        ST(pl, GL(pl.xuid, "moneygui", 11));
                                        return;
                                    }
                                    let plData = plDatas[args[0]];
                                    if (plData.loss) {
                                        ST(pl, GL(pl.xuid, "moneygui", 12));
                                        return;
                                    }
                                    let newForm = mc.newCustomForm();
                                    newForm.setTitle("§l§dMONEYPAY");
                                    newForm.addLabel(GL(pl.xuid, "moneygui", 13, plData.name, getmoney(plData.name), getmoney(pl.realName), fs.TMET.get("Money")["MoneyName"], `${(getPayTax() * 100)}/100`));
                                    newForm.addInput(GL(pl.xuid, "moneygui", 14), "number", "");
                                    pl.sendForm(newForm, (pl, args) => {
                                        try {
                                            if (args == null) {
                                                ST(pl, GL(pl.xuid, "moneygui", 15));
                                                return;
                                            }
                                            let Num = Number(args[1]);
                                            if (Num == NaN || !(/(^[1-9]\d*$)/.test(args[1]))) {
                                                ST(pl, GL(pl.xuid, "moneygui", 16));
                                                return;
                                            }
                                            if (getmoney(pl.realName) < Num) {
                                                ST(pl, GL(pl.xuid, "moneygui", 17));
                                                return;
                                            }
                                            WriteUseLog("MONEY-PAY", pl, `->${plData.name}(${Num}-${Math.floor(Num * getPayTax())})`);
                                            let isTrue = tranmoney(pl.realName, plData.name, Num, "money pay");
                                            if (isTrue) {
                                                ST(pl, GL(pl.xuid, "moneygui", 18, getmoney(pl.realName)));
                                            } else {
                                                ST(pl, GL(pl.xuid, "moneygui", 19));
                                            }
                                        } catch (e) {
                                            ErrorMsg(e);
                                        }
                                    });
                                } catch (e) {
                                    ErrorMsg(e);
                                }
                            }
                        );
                    } catch (e) {
                        ErrorMsg(e);
                    }
                });
            } else if (id == 1) {
                let newform = mc.newCustomForm(),
                    newArray = [],
                    olm = JSON.parse(fs.moneydata.read()),
                    k = Object.keys(olm), l = k.length, i = 0,
                    textArr = [];
                newform.setTitle('§l§dRANKINGLIST');
                while (i < l) {
                    let plname = data.xuid2name(k[i]),
                        mon = getmoney(plname);
                    newArray.push({ "name": (plname != "" ? plname : k[i]), "val": (plname != "" ? mon : olm[k[i]]) });
                    i++;
                }
                newArray.sort((a, b) => { return b.val - a.val; });
                i = 0; l = newArray.length;
                while (i < l) {
                    let plDa = newArray[i];
                    textArr.push(`§l§a${++i}.§e${plDa.name}-§b${plDa.val}§f(${fs.TMET.get("Money")["MoneyName"]}§l§f)`);
                }
                newform.addLabel(textArr.join("\n"));
                pl.sendForm(newform, function (_) { });
            } else if (id == 2 && fIsOP(pl.xuid)) {
                let newForm = mc.newCustomForm();
                newForm.setTitle("§l§dMONEYADMINI");
                newForm.addLabel(GL(pl.xuid, "moneygui", 20));
                newForm.addStepSlider(GL(pl.xuid, "moneygui", 21), JSON.parse(GL(pl.xuid, "moneygui", 22)), 0);
                pl.sendForm(newForm, (pl, id) => {
                    try {
                        let plDatas = [];
                        if (id == null) {
                            ST(pl, GL(pl.xuid, "moneygui", 23));
                            return;
                        }
                        if (id[1] == 0) {//在线列表
                            plDatas = (() => {
                                let rt = [],
                                    pls = mc.getOnlinePlayers(),
                                    l = pls.length,
                                    i = 0;
                                while (i < l) {
                                    let pl = pls[i];
                                    rt.push({
                                        "name": pl.realName,
                                        "loss": false
                                    });
                                    i++;
                                }
                                return rt;
                            })();
                        } else {//离线列表
                            plDatas = (() => {
                                let rt = [],
                                    offlineList = JSON.parse(fs.moneydata.read()),
                                    keys = Object.keys(offlineList),
                                    l = keys.length,
                                    i = 0;
                                while (i < l) {
                                    let xuid = keys[i],
                                        plName = data.xuid2name(xuid);
                                    rt.push({
                                        "name": (plName != "" ? plName : xuid),
                                        "loss": (plName != "" ? false : true)
                                    });
                                    i++;
                                }
                                return rt;
                            })();
                        }
                        let buts = (() => {//获取按钮
                            let azzzzz = [],
                                l = plDatas.length,
                                i = 0;
                            while (i < l) {
                                let obj = plDatas[i];
                                azzzzz.push(obj.name);
                                i++;
                            }
                            return azzzzz;
                        })();
                        sendSelectForm(pl, "§l§dMONEYADMINI", GL(pl.xuid, "moneygui", 24), buts, fs.TMET.get("SelectForm").Subsection, (pl, args) => {
                            try {
                                if (args == null) {
                                    ST(pl, GL(pl.xuid, "moneygui", 25));
                                    return;
                                } else if (args.length == 0) { return; }
                                if (args.length > 1) {
                                    ST(pl, GL(pl.xuid, "moneygui", 26));
                                    return;
                                }
                                let selPl = plDatas[args[0]];
                                if (selPl.loss) {
                                    ST(pl, GL(pl.xuid, "moneygui", 27));
                                    return;
                                }
                                let newform = mc.newCustomForm();
                                newform.setTitle("§l§dMONEYADMINI");
                                newform.addLabel(GL(pl.xuid, "moneygui", 28, selPl.name, fs.TMET.get("Money")["MoneyName"], getmoney(selPl.name)));
                                newform.addSwitch(GL(pl.xuid, "moneygui", 29), true);
                                newform.addInput(GL(pl.xuid, "moneygui", 30), "number", "");
                                pl.sendForm(newform, (pl, args) => {
                                    try {
                                        if (args == null) {
                                            ST(pl, GL(pl.xuid, "moneygui", 31));
                                            return;
                                        }
                                        let mode = args[1],/* true-addMode / false-setMode */
                                            inputText = args[2];
                                        if (mode) {
                                            if (!(/^-?\d+$/).test(inputText)) {
                                                ST(pl, GL(pl.xuid, "moneygui", 32));
                                                return;
                                            }
                                            if (setmoney(selPl.name, (getmoney(selPl.name) + Number(inputText)))) {
                                                WriteUseLog("MONEY-ADD", pl, `->${selPl.name}(${inputText})`);
                                                ST(pl, GL(pl.xuid, "moneygui", 33));
                                            } else {
                                                ST(pl, GL(pl.xuid, "moneygui", 34));
                                            }
                                        } else {
                                            if (!(/^-?\d+$/).test(inputText)) {
                                                ST(pl, GL(pl.xuid, "moneygui", 35));
                                                return;
                                            }
                                            if (setmoney(selPl.name, Number(inputText))) {
                                                WriteUseLog("MONEY-SET", pl, `->${selPl.name}(${inputText})`);
                                                ST(pl, GL(pl.xuid, "moneygui", 36));
                                            } else {
                                                ST(pl, GL(pl.xuid, "moneygui", 37));
                                            }
                                        }
                                    } catch (e) {
                                        ErrorMsg(e);
                                    }
                                });
                            } catch (e) {
                                ErrorMsg(e);
                            }
                        });
                    } catch (e) {
                        ErrorMsg(e);
                    }
                });
            }
        } catch (e) {
            ErrorMsg(e);
        }
    }
}

function getmoney(name) {
    try {
        if (fs.TMET.get("Money")["Enable"]) {
            if (typeof (name) == "string") {
                let xuid = data.name2xuid(name),
                    pl = mc.getPlayer(xuid);
                if (pl != null) {
                    if (fs.TMET.get("Money")["MoneyType"] == 'score') {
                        return pl.getScore("money");
                    } else {
                        if (money.get(pl.xuid) == null) {
                            money.set(pl.xuid, 0);
                        }
                        return money.get(pl.xuid);
                    }
                } else {
                    if (xuid != "") {
                        if (fs.TMET.get("Money")["MoneyType"] == 'score') {
                            if (fs.moneydata.get(xuid) == null) {
                                fs.moneydata.set(xuid, 0);
                            }
                            return fs.moneydata.get(xuid);
                        } else {
                            if (money.get(xuid) == null) {
                                money.set(xuid, 0);
                            }
                            return money.get(xuid);
                        }
                    } else {
                        return null;
                    }
                }
            } else {
                return null;
            }
        } else {
            return 0;
        }
    } catch (e) {
        ErrorMsg(e);
        return null;
    }
}

function setmoney(name, val, type) {
    try {
        if (fs.TMET.get("Money")["Enable"]) {
            let xuid = data.name2xuid(name);
            if (typeof (name) == "string" && checkNumber(val) && xuid != '') {
                val = getNumber(val);
                if (val != fs.moneydata.get(data.name2xuid(name)) || type == 'join' || type == 'initial') {
                    let old = fs.moneydata.get(xuid),
                        pl = mc.getPlayer(xuid);
                    if (pl != null) {
                        fs.moneydata.set(xuid, val);
                        if (fs.TMET.get("Money")["MoneyType"] == 'score') {
                            let old1 = pl.getScore('money');
                            pl.setScore('money', val);//NJS一定会成功
                            if (val != 0 && pl.getScore('money') != val) {//ll补丁
                                let ScoreObj = mc.getScoreObjective("money");//计分板是否存在
                                if (ScoreObj == null) {//判断是否存在
                                    mc.newScoreObjective("money", "money");//创建
                                    logger.info(GL("default", "Moneyload", 7));//暂时使用Moneyload GL地址啦
                                }
                                runcmdEx(`scoreboard players set "${pl.name}" money ${val}`);//建立计分板追踪目标
                            }
                            logger.debug(name, " score setmoney ", val, " ", type);
                            if (fs.TMET.get("Money")["MoneyChangeMsg"]) {
                                if (type != 'join' && type != 'initial') {
                                    ST(pl, GL(pl.xuid, "setmoney", 0, getmoney(pl.realName), fs.TMET.get("Money")["MoneyName"], (val - old)));
                                } else if (type == 'initial') {
                                    ST(pl, GL(pl.xuid, "setmoney", 1, val));
                                } else {
                                    ST(pl, GL(pl.xuid, "setmoney", 2, getmoney(pl.realName), fs.TMET.get("Money")["MoneyName"], (val - old1)));
                                }
                            }
                            return true;
                        } else {
                            money.set(pl.xuid, val);
                            logger.debug(name, " llmoney setmoney ", val, " ", type);
                            if (fs.TMET.get("Money")["MoneyChangeMsg"]) {
                                if (type == 'initial') {
                                    ST(pl, GL(pl.xuid, "setmoney", 3, getmoney(pl.realName), fs.TMET.get("Money")["MoneyName"], (val)));
                                } else {
                                    ST(pl, GL(pl.xuid, "setmoney", 4, getmoney(pl.realName), fs.TMET.get("Money")["MoneyName"], (val - old)));
                                }
                            }
                            return true;
                        }
                    } else {
                        if (fs.TMET.get("Money")["MoneyType"] == 'score') {
                            return fs.moneydata.set(xuid, val);
                        } else {
                            return money.set(xuid, val);
                        }
                    }
                } else {
                    return true;
                }
            } else {
                return null;
            }
        } else {
            return true;
        }
    } catch (e) {
        ErrorMsg(e);
        return null;
    }
}

function tranmoney(name, jname, val, note) {
    try {
        if (fs.TMET.get("Money")["Enable"]) {
            if (typeof (note) != "string") {
                note = '';
            }
            if (typeof (name) == "string" && typeof (jname) == "string" && typeof (val) == "number" && data.name2xuid(name) != null && data.name2xuid(jname) != null) {
                let pl1xuid = data.name2xuid(name),
                    pl2xuid = data.name2xuid(jname),
                    fee = Math.floor(val * getPayTax());//税率
                if ((/(^[1-9]\d*$)/.test(val))) {
                    if (fs.TMET.get("Money")["MoneyType"] == 'score') {
                        let nmo = getmoney(name);
                        if (nmo >= val) {
                            setmoney(name, nmo - val);
                            setmoney(jname, getmoney(jname) + val - fee);
                            logger.debug(name, " ", jname, " score tranmoney ", val, "-", fee);
                            return true;
                        }
                    } else {
                        let nmo = getmoney(name);
                        if (nmo >= val) {
                            fs.moneydata.set(data.name2xuid(name), nmo - val);
                            fs.moneydata.set(data.name2xuid(jname), getmoney(jname) + val - fee);
                            let pl1 = mc.getPlayer(pl1xuid),
                                pl2 = mc.getPlayer(pl2xuid);
                            money.trans(pl1xuid, pl2xuid, val, note);
                            if (!!fee) {
                                money.trans(pl2xuid, "", fee, "money pay fee");
                            }
                            logger.debug(name, " ", jname, " llmoney tranmoney ", val, "-", fee, note);
                            if (fs.TMET.get("Money")["MoneyChangeMsg"]) {
                                if (pl1 != null) {
                                    ST(pl1, GL(pl1.xuid, "tranmoney", 0, getmoney(pl1.realName), fs.TMET.get("Money")["MoneyName"], (-val)));
                                }
                                if (pl2 != null) {
                                    ST(pl2, GL(pl2.xuid, "tranmoney", 1, getmoney(pl1.realName), fs.TMET.get("Money")["MoneyName"], (val - fee)));
                                }
                            }
                            return true;
                        }
                    }
                }
                return false;
            } else {
                return false;
            }
        } else {
            return true;
        }
    } catch (e) {
        ErrorMsg(e);
        return null;
    }
}

function moneyset(pl, cmd) {
    try {
        if (cmd.length == 2 && checkNumber(cmd[1])) {
            let player = cmd[0],
                val = JSON.parse(cmd[1]),
                playermon = getmoney(player);
            if (playermon != null && val > -1) {
                WriteUseLog("MONEY-SET", pl, `->${player}(${val})`);
                let sec = setmoney(player, val);
                logger.debug(player, " setmoney ", val);
                if (sec) {
                    ST(pl, GL(pl.xuid, "moneyset", 0, fs.TMET.get("Money")["MoneyName"], getmoney(player)));
                } else {
                    ST(pl, GL(pl.xuid, "moneyset", 1));
                }
            } else {
                ST(pl, GL(pl.xuid, "moneyset", 2));
            }
        } else {
            ST(pl, GL(pl.xuid, "moneyset", 3));
        }
    } catch (e) {
        ErrorMsg(e);
    }
}

function moneyquery(pl, cmd) {
    try {
        if (cmd.length < 2) {
            if (cmd.length == 0) {
                WriteUseLog("MONEY-QUERY", pl, `->${pl.realName}(${getmoney(pl.realName)})`);
                ST(pl, GL(pl.xuid, "moneyquery", 0, getmoney(pl.realName), fs.TMET.get("Money")["MoneyName"]));
            } else {
                let moneyg = getmoney(cmd[0]);
                if (moneyg != null) {
                    WriteUseLog("MONEY-QUERY", pl, `->${cmd[0]}(${moneyg})`);
                    ST(pl, GL(pl.xuid, "moneyquery", 1, cmd[0], moneyg, fs.TMET.get("Money")["MoneyName"]));
                } else {
                    ST(pl, GL(pl.xuid, "moneyquery", 2));
                }
            }
        }
    } catch (e) {
        ErrorMsg(e);
    }
}

function moneypay(pl, cmd) {
    try {
        if (cmd.length == 2 && checkNumber(cmd[1])) {
            let player = cmd[0],
                val = Number(cmd[1]),
                plmon = getmoney(pl.realName),
                playermon = getmoney(player);
            if (plmon != null && playermon != null) {
                if (!(/(^[1-9]\d*$)/.test(cmd[1]))) {
                    ST(pl, GL(pl.xuid, "moneypay", 0));
                    return;
                }
                let fee = Math.floor(val * getPayTax());
                if (plmon >= val) {
                    WriteUseLog("MONEY-PAY", pl, `->${player}(${val}-${fee})`);
                    tranmoney(pl.realName, player, val, pl.realName + '转账');
                    logger.debug(pl.realName, " ", player, " pay ", val);
                    ST(pl, GL(pl.xuid, "moneypay", 1, getmoney(pl.realName), fs.TMET.get("Money")["MoneyName"]));
                } else {
                    ST(pl, GL(pl.xuid, "moneypay", 2, plmon, fs.TMET.get("Money")["MoneyName"]));
                }
            } else {
                ST(pl, GL(pl.xuid, "moneypay", 3));
            }
        } else {
            ST(pl, GL(pl.xuid, "moneypay", 4));
        }
    } catch (e) {
        ErrorMsg(e);
    }
}

function moneyadd(pl, cmd) {
    try {
        if (cmd.length == 2 && checkNumber(cmd[1])) {
            let player = cmd[0],
                val = JSON.parse(cmd[1]),
                playermon = getmoney(player);
            if (playermon != null && (playermon + val) > -1) {
                WriteUseLog("MONEY-ADD", pl, `->${player}(${val})`);
                let sec = setmoney(player, playermon + val);
                logger.debug(player, " Money add ", val);
                if (sec) {
                    ST(pl, GL(pl.xuid, "moneyadd", 0, fs.TMET.get("Money")["MoneyName"], getmoney(player)));
                } else {
                    ST(pl, GL(pl.xuid, "moneyadd", 1));
                }
            } else {
                ST(pl, GL(pl.xuid, "moneyadd", 2));
            }
        } else {
            ST(pl, GL(pl.xuid, "moneyadd", 3));
        }
    } catch (e) {
        ErrorMsg(e);
    }
}

function moneyreduce(pl, cmd) {
    try {
        if (cmd.length == 2 && checkNumber(cmd[1])) {
            moneyadd(pl, [cmd[0], -cmd[1]]);
        } else {
            ST(pl, GL(pl.xuid, "moneyreduce", 0));
        }
    } catch (e) {
        ErrorMsg(e);
    }
}

function moneyjoin(pl) {
    try {
        if (fs.TMET.get("Money")["MoneyType"] == 'score') {
            if (fs.moneydata.get(pl.xuid) == null) {
                if (pl.getScore("money") == 0) {
                    WriteUseLog("MONEY-INIT", pl, fs.TMET.get("Money")["PlayerInitialMoney"]);
                    setmoney(pl.realName, fs.TMET.get("Money")["PlayerInitialMoney"], 'initial');
                    logger.debug(pl.realName, " Initial money:", fs.TMET.get("Money")["PlayerInitialMoney"]);
                } else {
                    fs.moneydata.set(pl.xuid, pl.getScore("money"));
                    logger.debug(pl.realName, " Score Money Soft change");
                }
            }
            if (pl.getScore('money') != fs.moneydata.get(pl.xuid)) {
                WriteUseLog("MONEY-SYNC-SCORE", pl, fs.moneydata.get(pl.xuid));
                setmoney(pl.realName, fs.moneydata.get(pl.xuid), 'join');
                logger.debug(pl.realName, " Score Money change");
            }
        } else {
            if (fs.moneydata.get(pl.xuid) != money.get(pl.xuid)) {
                let yy = money.get(pl.xuid),
                    old = fs.moneydata.get(pl.xuid);
                if (yy != old) {
                    WriteUseLog("MONEY-SYNC-LLMONEY", pl, yy);
                    setmoney(pl.realName, yy, 'join');
                    logger.debug(pl.realName, " llmoney change");
                }
            }
        }
    } catch (e) {
        ErrorMsg(e);
    }
    OnlinePlayer[pl.realName] = true;
}

function moneyleft(pl) {
    if (OnlinePlayer[pl.realName]) {
        delete OnlinePlayer[pl.realName];
    }
}

//TPA
function TPAload() {
    try {
        logger.debug("load TPA...");
        TMLS.listen("onLeft", tpaleft);
        fs["tpaset"] = TMdata.openConfig('.\\plugins\\Timiya\\data\\tpasetting.json', 'json', '{}');
        tmp["tpa"] = {};
        TMCmd.regPlayerCmd('tpa', GL("default", "TPAload", 0, fs.TMET.get("TPA")["ConsumeMoney"]), tpa, 0);
        TMCmd.regPlayerCmd('tpa gui', GL("default", "TPAload", 1), tpagui, 0);
        TMCmd.regPlayerCmd('tpahere', GL("default", "TPAload", 2, fs.TMET.get("TPA")["ConsumeMoney"]), tpahere, 0);
        TMCmd.regPlayerCmd('tpaaccept', GL("default", "TPAload", 3, fs.TMET.get("TPA")["ConsumeMoney"]), tpac, 0);
        TMCmd.regPlayerCmd('tpadeny', GL("default", "TPAload", 4), tpad, 0);
        TMCmd.regPlayerCmd('tpa ui', GL("default", "TPAload", 5), tpaui, 0);
        setInterval(DELTPA, 500)
    } catch (e) {
        ErrorMsg(e);
    }
}

function gettpa(xuid) {
    try {
        let i = 0,
            k = Object.keys(tmp.tpa),
            l = k.length;
        while (i < l) {
            let key = k[i];
            if (tmp.tpa[key].xuid == xuid) {
                return key;
            }
            i++;
        }
        return null;
    } catch (e) {
        ErrorMsg(e);
    }
}

function DELTPA() {
    try {
        let NowTime = Date.now(), i = 0,
            k = Object.keys(tmp.tpa), l = k.length,
            ET = (fs.TMET.get("TPA")["ExpirationTime"] * 1000);
        while (i < l) {
            let key = k[i], obj = tmp.tpa[key];
            if ((NowTime - obj.time) >= ET) {
                let pl1 = mc.getPlayer(key), pl2 = mc.getPlayer(obj.xuid),
                    pl1Name = data.xuid2name(key), pl2Name = data.xuid2name(obj.xuid);
                logger.debug(obj.type.toUpperCase(), "_", pl2Name, "-TPA过期");
                if (obj.type == "tpa") {
                    WriteUseLog("TPA-TIMEOUT", pl1, pl2Name);
                    ST(pl1, GL(pl1.xuid, "DELTPA", 0, pl2Name));
                    ST(pl2, GL(pl2.xuid, "DELTPA", 1, pl1Name));
                } else if (obj.type == "tpahere") {
                    WriteUseLog("TPA-HERE-TIMEOUT", pl1, pl2Name);
                    ST(pl1, GL(pl1.xuid, "DELTPA", 2, pl2Name));
                    ST(pl2, GL(pl2.xuid, "DELTPA", 3, pl1Name));
                }
                delete tmp.tpa[key];
            }
            i++;
        }
    } catch (e) {
        ErrorMsg(e);
    }
}

function tpaui(pl, cmd) {
    try {
        if (cmd.length == 0) {
            if (fs.tpaset.get(pl.realName) == null || fs.tpaset.get(pl.realName)) {
                fs.tpaset.set(pl.realName, false);
                WriteUseLog("TPA-UI", pl, "false");
                ST(pl, GL(pl.xuid, "tpaui", 0));
            } else if (!fs.tpaset.get(pl.realName)) {
                fs.tpaset.set(pl.realName, true);
                WriteUseLog("TPA-UI", pl, "true");
                ST(pl, GL(pl.xuid, "tpaui", 1));
            }
        }
    } catch (e) {
        ErrorMsg(e);
    }
}

function tpagui(pl, cmd) {
    try {
        if (cmd.length == 0) {
            let newform = mc.newCustomForm(),
                pls = [], ls = mc.getOnlinePlayers(),
                i = 0, l = ls.length;
            newform.setTitle("§l§dTPAGUI");
            while (i < l) {
                pls.push(ls[i].realName);
                i++;
            }
            newform.addDropdown(GL(pl.xuid, "tpagui", 0), pls, 0);
            newform.addDropdown(GL(pl.xuid, "tpagui", 1), JSON.parse(GL(pl.xuid, "tpagui", 2)), 0);
            newform.addLabel(GL(pl.xuid, "tpagui", 3, fs.TMET.get("TPA")["ConsumeMoney"]));
            pl.sendForm(newform, function (pl, selected) {
                try {
                    if (selected == null) {
                        ST(pl, GL(pl.xuid, "tpagui", 4));
                    } else {
                        if (selected[1] == 0) {
                            plRunCmdAs(pl.xuid, `/tpa "${pls[selected[0]]}"`);
                        } else if (selected[1] == 1) {
                            plRunCmdAs(pl.xuid, `/tpahere "${pls[selected[0]]}"`);
                        }
                    }
                } catch (e) {
                    ErrorMsg(e);
                }
            })
        } else
            ST(pl, GL(pl.xuid, "tpagui", 5));
    } catch (e) {
        ErrorMsg(e);
    }
}

function tpa(pl, cmd) {
    try {
        if (cmd.length == 1) {
            let player = mc.getPlayer(cmd[0]);
            if (player == null) {
                ST(pl, GL(pl.xuid, "tpa", 0));
            } else {
                if (gettpa(player.xuid) == null) {
                    if (tmp.tpa[pl.xuid] == null) {
                        ST(player, GL(player.xuid, "tpa", 1, pl.realName));
                        ST(pl, GL(pl.xuid, "tpa", 2, player.realName));
                        WriteUseLog("TPA", pl, player.realName);
                        if (fs.tpaset.get(player.realName, true)) {
                            let con = GL(player.xuid, "tpa", 3, pl.realName, fs.TMET.get("TPA")["ConsumeMoney"]);
                            player.sendModalForm(GL(player.xuid, "tpa", 4), con, GL(player.xuid, "tpa", 5), GL(player.xuid, "tpa", 6), function (pl2, selected) {
                                try {
                                    if (selected) {
                                        plRunCmdAs(pl2.xuid, "/tpaaccept");
                                    } else {
                                        plRunCmdAs(pl2.xuid, "/tpadeny");
                                    }
                                } catch (e) {
                                    ErrorMsg(e);
                                }
                            });
                        }
                        tmp.tpa[pl.xuid] = { "xuid": player.xuid, "type": "tpa", "time": Date.now() };
                        logger.debug("TPA_" + player.realName, "==>>", JSON.stringify(pl.xuid), "TPA创建");
                    } else {
                        let playerName = player.realName;
                        pl.sendModalForm(GL(pl.xuid, "tpa", 7), GL(pl.xuid, "tpa", 8), GL(pl.xuid, "tpa", 9), GL(pl.xuid, "tpa", 10), function (pl1, selected) {
                            try {
                                if (selected != null) {
                                    if (selected) {
                                        plRunCmdAs(pl1.xuid, "/tpadeny");
                                        plRunCmdAs(pl1.xuid, `/tpa "${playerName}"`);
                                    } else if (!selected) {
                                        ST(pl1, GL(pl1.xuid, "tpa", 11));
                                    }
                                } else {
                                    ST(pl1, GL(pl1.xuid, "tpa", 12));
                                }
                            } catch (e) {
                                ErrorMsg(e);
                            }
                        });
                    }
                } else {
                    ST(pl, GL(pl.xuid, "tpa", 13));
                }
            }
        } else if (cmd.length == 0) {
            tpagui(pl, []);
        } else {
            ST(pl, GL(pl.xuid, "tpa", 14));
        }
    } catch (e) {
        ErrorMsg(e);
    }
}

function tpahere(pl, cmd) {
    try {
        if (cmd.length == 1) {
            let player = mc.getPlayer(cmd[0]);
            if (player == null) {
                ST(pl, GL(pl.xuid, "tpahere", 0));
            } else {
                if (gettpa(player.xuid) == null) {
                    if (tmp.tpa[pl.xuid] == null) {
                        ST(player, GL(player.xuid, "tpahere", 1, pl.realName));
                        ST(pl, GL(pl.xuid, "tpahere", 2, player.realName));
                        WriteUseLog("TPA", pl, player.realName);
                        if (fs.tpaset.get(player.realName, true)) {
                            let con = GL(player.xuid, "tpahere", 3, pl.realName, fs.TMET.get("TPA")["ConsumeMoney"]);
                            player.sendModalForm(GL(player.xuid, "tpahere", 4), con, GL(player.xuid, "tpahere", 5), GL(player.xuid, "tpahere", 6), function (pl2, selected) {
                                try {
                                    if (selected) {
                                        plRunCmdAs(pl2.xuid, "/tpaaccept");
                                    } else {
                                        plRunCmdAs(pl2.xuid, "/tpadeny");
                                    }
                                } catch (e) {
                                    ErrorMsg(e);
                                }
                            });
                        }
                        tmp.tpa[pl.xuid] = { "xuid": player.xuid, "type": "tpahere", "time": Date.now() };
                        logger.debug("TPAHERE_" + player.realName, "==>>", JSON.stringify(pl.xuid), "TPA创建");
                    } else {
                        let playerName = player.realName;
                        pl.sendModalForm(GL(pl.xuid, "tpahere", 7), GL(pl.xuid, "tpahere", 8), GL(pl.xuid, "tpahere", 9), GL(pl.xuid, "tpahere", 10), function (pl1, selected) {
                            try {
                                if (selected != null) {
                                    if (selected) {
                                        plRunCmdAs(pl1.xuid, "/tpadeny");
                                        plRunCmdAs(pl1.xuid, `/tpa "${playerName}"`);
                                    } else if (!selected) {
                                        ST(pl1, GL(pl1.xuid, "tpahere", 11));
                                    }
                                } else {
                                    ST(pl1, GL(pl1.xuid, "tpahere", 12));
                                }
                            } catch (e) {
                                ErrorMsg(e);
                            }
                        });
                    }
                } else {
                    ST(pl, GL(pl.xuid, "tpahere", 13));
                }
            }
        } else if (cmd.length == 0) {
            tpagui(pl, []);
        } else {
            ST(pl, GL(pl.xuid, "tpahere", 14));
        }
    } catch (e) {
        ErrorMsg(e);
    }
}

function tpac(pl, cmd) {
    try {
        if (cmd.length == 0) {
            let pl1Xuid = gettpa(pl.xuid);//发起者xuid
            if (pl1Xuid != null) {
                let obj = tmp.tpa[pl1Xuid],
                    pl1 = mc.getPlayer(pl1Xuid);
                if (pl1 != null) {
                    if (obj.type == "tpa") {
                        if (getmoney(pl1.realName) >= fs.TMET.get("TPA")["ConsumeMoney"] && setmoney(pl1.realName, (getmoney(pl1.realName) - fs.TMET.get("TPA")["ConsumeMoney"]))) {
                            pl1.teleport(pl.pos);
                            ST(pl1, GL(pl1.xuid, "tpac", 0, pl.realName));
                            ST(pl, GL(pl.xuid, "tpac", 1, pl1.realName));
                            delete tmp.tpa[pl1Xuid];
                            logger.debug("TPA_" + pl.realName, "==>>", JSON.stringify(obj), "TPA接受");
                            WriteUseLog("TPA-AC", pl, pl1.realName);
                        } else {
                            ST(pl, GL(pl1.xuid, "tpac", 2));
                            ST(pl1, GL(pl1.xuid, "tpac", 3));
                        }
                    } else if (obj.type == "tpahere") {
                        if (getmoney(pl1.realName) >= fs.TMET.get("TPA")["ConsumeMoney"] && setmoney(pl1.realName, (getmoney(pl1.realName) - fs.TMET.get("TPA")["ConsumeMoney"]))) {
                            pl.teleport(pl1.pos);
                            ST(pl1, GL(pl1.xuid, "tpac", 5, pl.realName));
                            ST(pl, GL(pl.xuid, "tpac", 6, pl1.realName));
                            delete tmp.tpa[pl1Xuid];
                            logger.debug("TPAHERE_" + pl.realName, "==>>", JSON.stringify(obj), "TPAHERE接受");
                            WriteUseLog("TPA-HERE-AC", pl, pl1.realName);
                        } else {
                            ST(pl, GL(pl.xuid, "tpac", 7));
                            ST(pl1, GL(pl1.xuid, "tpac", 8));
                        }
                    } else {
                        delete tmp.tpa[pl1Xuid];
                    }
                } else {
                    ST(pl, GL(pl.xuid, "tpac", 9));
                    delete tmp.tpa[pl1Xuid];
                }
            } else {
                ST(pl, GL(pl.xuid, "tpac", 10));
            }
        } else {
            ST(pl, GL(pl.xuid, "tpac", 11));
        }
    } catch (e) {
        ErrorMsg(e);
    }
}

function tpad(pl, cmd) {
    try {
        if (cmd.length == 0) {
            let pl1Xuid = gettpa(pl.xuid);
            if (pl1Xuid != null) {
                let obj = tmp.tpa[pl1Xuid], pl1Name = data.xuid2name(pl1Xuid),
                    pl1 = mc.getPlayer(pl1Xuid);
                if (obj.type == "tpa") {
                    if (pl1 != null) {
                        ST(pl1, GL(pl1.xuid, "tpad", 0, pl.realName));
                    }
                    ST(pl, GL(pl.xuid, "tpad", 1, pl1Name));
                    delete tmp.tpa[pl1Xuid];
                    logger.debug("TPA_" + pl.realName, "==>>", JSON.stringify(obj), "TPA拒绝");
                    WriteUseLog("TPA-DE", pl, pl1Name);
                } else if (obj.type == "tpahere") {
                    if (pl1 != null) {
                        ST(pl1, GL(pl1.xuid, "tpad", 2, pl.realName));
                    }
                    ST(pl, GL(pl.xuid, "tpad", 3, pl1Name));
                    delete tmp.tpa[pl1Xuid];
                    logger.debug("TPAHERE_" + pl.realName, "==>>", JSON.stringify(obj), "TPA拒绝");
                    WriteUseLog("TPA-HERE-DE", pl, pl1Name);
                } else {
                    delete tmp.tpa[pl1Xuid];
                }
            } else if (tmp.tpa[pl.xuid] != null) {//主动发起
                let obj = tmp.tpa[pl.xuid], pl2 = mc.getPlayer(obj.xuid);
                if (pl2 != null) {
                    ST(pl2, GL(pl2.xuid, "tpad", 4));
                }
                ST(pl, GL(pl.xuid, "tpad", 5));
                delete tmp.tpa[pl.xuid];
            } else {
                ST(pl, GL(pl.xuid, "tpad", 6));
            }
        } else {
            ST(pl, GL(pl.xuid, "tpad", 7));
        }
    } catch (e) {
        ErrorMsg(e);
    }
}

function tpaleft(pl) {
    try {
        let xuid = pl.xuid,
            name = pl.realName,
            pl1Xuid = gettpa(xuid);
        if (pl1Xuid != null) {
            let pl1 = mc.getPlayer(pl1Xuid), pl1Name = data.xuid2name(pl1Xuid),
                obj = tmp.tpa[pl1Xuid];
            if (obj.type == "tpa") {
                if (pl1 != null) {
                    ST(pl1, GL(pl1.xuid, "tpaleft", 0, name));
                }
                delete tmp.tpa[pl1Xuid];
                logger.debug("TPA_" + name, "==>>", JSON.stringify(obj), "TPA强制取消");
                WriteUseLog("TPA-LEFT", pl, pl1Name);
            } else if (obj.type == "tpahere") {
                if (pl1 != null) {
                    ST(pl1, GL(pl1.xuid, "tpaleft", 1, name));
                }
                delete tmp.tpa[pl1Xuid];
                logger.debug("TPAHERE_" + name, "==>>", JSON.stringify(obj), "TPA强制取消");
                WriteUseLog("TPA-HERE-LEFT", pl, pl1Name);
            } else {
                delete tmp.tpa[pl1Xuid];
            }
        } else if (tmp.tpa[xuid] != null) {
            let obj = tmp.tpa[xuid], pl1Name = data.xuid2name(obj.xuid),
                pl2 = mc.getPlayer(obj.xuid);
            if (pl2 != null) {
                ST(pl2, GL(pl2.xuid, "tpaleft", 2, name));
            }
            delete tmp.tpa[xuid];
            logger.debug(`TPA${(obj.type == "tpahere" ? "HERE" : "")}_` + pl1Name, "==>>", JSON.stringify(obj), "TPA强制取消");
            WriteUseLog("TPA-(HERE)-LEFT", pl, pl1Name);
        }
    } catch (e) {
        ErrorMsg(e);
    }
}

//HOME
function HOMEload() {
    try {
        logger.debug("load HOME...");
        fs["HOME"] = TMdata.openConfig('.\\plugins\\Timiya\\data\\homelist.json', 'json', '{}');
        TMCmd.regPlayerCmd('home', GL("default", "HOMEload", 0), homegui, 0);
        TMCmd.regPlayerCmd('home gui', GL("default", "HOMEload", 1), homegui, 0);
        TMCmd.regPlayerCmd('home go', GL("default", "HOMEload", 2, fs.TMET.get("HOME")["GoHomeRequiredMoney"]), homego, 0);
        TMCmd.regPlayerCmd('home del', GL("default", "HOMEload", 3, fs.TMET.get("HOME")["DelHomeBackOffMoney"]), homedel, 0);
        TMCmd.regPlayerCmd('home add', GL("default", "HOMEload", 4, fs.TMET.get("HOME")["SaveRequiredMoney"]), homeadd, 0);
        TMCmd.regPlayerCmd('home ls', GL("default", "HOMEload", 5), homels, 0);
        TMCmd.regPlayerCmd('homeas', GL("default", "HOMEload", 6), homeas, 1);
        TMCmd.regPlayerCmd('homeas gui', GL("default", "HOMEload", 7), homeasgui, 1);
    } catch (e) {
        ErrorMsg(e);
    }
}

function HOMEtp(pl, x, y, z, dimid, home) {
    try {
        giveSlow_falling(pl);
        pl.teleport(new FloatPos(x, y, z, dimid));
        ST(pl, GL(pl.xuid, "HOMEtp", 0, home));
    } catch (e) {
        ErrorMsg(e);
    }
};

function homegui(pl, cmd) {
    try {
        if (cmd.length == 0) {
            let gui = JSON.parse(GL(pl.xuid, "homegui", 1));
            pl.sendSimpleForm('§l§dHOME', GL(pl.xuid, "homegui", 0), gui, new Array(gui.length).fill(""), function (pl, selected) {
                try {
                    if (selected == 0) {
                        let newform = mc.newCustomForm(),
                            tit = GL(pl.xuid, "homegui", 2, fs.TMET.get("HOME")["SaveRequiredMoney"], fs.TMET.get("Money")["MoneyName"], getmoney(pl.realName), fs.TMET.get("Money")["MoneyName"]);
                        newform.setTitle("§l§dHOMEADD");
                        newform.addInput(tit, "home", "");
                        pl.sendForm(newform, function (pl1, selected1) {
                            try {
                                if (selected1 != null) {
                                    plRunCmdAs(pl1.xuid, `/home add "${selected1[0]}"`);
                                } else {
                                    ST(pl1, GL(pl1.xuid, "homegui", 3));
                                }
                            } catch (e) {
                                ErrorMsg(e);
                            }
                        });
                    } else if (selected == 1) {
                        let homelist = Object.keys(fs.HOME.get(pl.realName, {})),
                            image = new Array(homelist.length).fill("");
                        if (homelist.length == 0) {
                            ST(pl, GL(pl.xuid, "homegui", 4));
                        } else {
                            let sonc = GL(pl.xuid, "homegui", 5, fs.TMET.get("HOME")["GoHomeRequiredMoney"], fs.TMET.get("Money")["MoneyName"], getmoney(pl.realName), fs.TMET.get("Money")["MoneyName"]);
                            pl.sendSimpleForm('§l§dHOMEGO', sonc, homelist, image, function (pl1, selected1) {
                                try {
                                    if (selected1 != null) {
                                        plRunCmdAs(pl1.xuid, `/home go "${homelist[selected1]}"`);
                                    } else {
                                        ST(pl1, GL(pl1.xuid, "homegui", 6));
                                    }
                                } catch (e) {
                                    ErrorMsg(e);
                                }
                            })
                        }
                    } else if (selected == 2) {
                        let newform = mc.newCustomForm(),
                            homelist = Object.keys(fs.HOME.get(pl.realName, {})),
                            titl = GL(pl.xuid, "homegui", 7, fs.TMET.get("HOME")["DelHomeBackOffMoney"], fs.TMET.get("Money")["MoneyName"], getmoney(pl.realName), fs.TMET.get("Money")["MoneyName"]);
                        newform.setTitle("§l§dHOMEDEL");
                        newform.addDropdown(titl, homelist, 0);
                        if (homelist.length != 0) {
                            pl.sendForm(newform, function (pl1, selected1) {
                                try {
                                    if (selected1 != null) {
                                        plRunCmdAs(pl1.xuid, `/home del "${homelist[selected1[0]]}"`);
                                    } else {
                                        ST(pl1, GL(pl1.xuid, "homegui", 8));
                                    }
                                } catch (e) {
                                    ErrorMsg(e);
                                }
                            })
                        } else {
                            ST(pl, GL(pl.xuid, "homegui", 9));
                        }
                    } else {
                        ST(pl, GL(pl.xuid, "homegui", 10));
                    }
                } catch (e) {
                    ErrorMsg(e);
                }
            })
        }
    } catch (e) {
        ErrorMsg(e);
    }
}

function homego(pl, cmd) {
    try {
        if (cmd.length == 1) {
            let home = cmd[0],
                xmon = fs.TMET.get("HOME")["GoHomeRequiredMoney"],
                mon = getmoney(pl.realName);
            if (home == '') {
                ST(pl, GL(pl.xuid, "homego", 0));
            } else if (fs.HOME.get(pl.realName, {})[home] == null) {
                ST(pl, GL(pl.xuid, "homego", 1));
            } else {
                if (mon >= xmon && setmoney(pl.realName, (mon - xmon))) {
                    let homeStr = JSON.stringify(fs.HOME.get(pl.realName)[home]);
                    WriteUseLog("HOME-GO", pl, `${home}:${homeStr}`);
                    logger.debug(pl.realName, " home go ", home, ':', homeStr);
                    HOMEtp(pl, fs.HOME.get(pl.realName)[home]['x'], fs.HOME.get(pl.realName)[home]['y'], fs.HOME.get(pl.realName)[home]['z'], fs.HOME.get(pl.realName)[home]['dimid'], home);
                } else {
                    ST(pl, GL(pl.xuid, "homego", 2));
                }
            }
        } else {
            ST(pl, GL(pl.xuid, "homego", 3));
        }
    } catch (e) {
        ErrorMsg(e);
    }
}

function homeadd(pl, cmd) {
    try {
        if (cmd.length == 1) {
            let home = cmd[0],
                xmon = fs.TMET.get("HOME")["SaveRequiredMoney"],
                mon = getmoney(pl.realName);
            if (home == '') {
                ST(pl, GL(pl.xuid, "homeadd", 0));
            } else {
                let homeNum = Object.keys(fs.HOME.get(pl.realName, {})).length;
                if (fs.HOME.get(pl.realName, {})[home] != null) {
                    ST(pl, GL(pl.xuid, "homeadd", 1));
                } else if (fs.TMET.get("HOME")["MaxHome"] > homeNum) {
                    if (mon >= xmon && setmoney(pl.realName, (mon - xmon))) {
                        let homes = fs.HOME.get(pl.realName, {});
                        homes[home] = { "x": floor1(pl.pos.x), "y": floor1(pl.pos.y), "z": floor1(pl.pos.z), "dimid": pl.pos.dimid };
                        let homeStr = JSON.stringify(homes[home]);
                        WriteUseLog("HOME-ADD", pl, `${home}:${homeStr}`);
                        logger.debug(pl.realName, " home add ", home, ':', homeStr);
                        fs.HOME.set(pl.realName, homes);
                        ST(pl, GL(pl.xuid, "homeadd", 2, home));
                    } else {
                        ST(pl, GL(pl.xuid, "homeadd", 3));
                    }
                } else {
                    ST(pl, GL(pl.xuid, "homeadd", 4, fs.TMET.get("HOME")["MaxHome"]));
                }
            }
        } else {
            ST(pl, GL(pl.xuid, "homeadd", 5));
        }
    } catch (e) {
        ErrorMsg(e);
    }
}

function homedel(pl, cmd) {
    try {
        if (cmd.length == 1) {
            let home = cmd[0],
                xmon = fs.TMET.get("HOME")["DelHomeBackOffMoney"],
                mon = getmoney(pl.realName);
            if (home == '') {
                ST(pl, GL(pl.xuid, "homedel", 0));
            } else {
                if (fs.HOME.get(pl.realName, {})[home] != null) {
                    if (mon >= xmon && setmoney(pl.realName, (mon + xmon))) {
                        let homes = fs.HOME.get(pl.realName),
                            homeStr = JSON.stringify(homes[home]);
                        WriteUseLog("HOME-DEL", pl, `${home}:${homeStr}`);
                        logger.debug(pl.realName, ' home del ', ':', home, homeStr);
                        delete homes[home];
                        fs.HOME.set(pl.realName, homes);
                        ST(pl, GL(pl.xuid, "homedel", 1, home));
                    } else {
                        ST(pl, GL(pl.xuid, "homedel", 2));
                    }
                } else {
                    ST(pl, GL(pl.xuid, "homedel", 3, home));
                }
            }
        } else {
            ST(pl, GL(pl.xuid, "homedel", 4));
        }
    } catch (e) {
        ErrorMsg(e);
    }
}

function homels(pl, cmd) {
    try {
        if (cmd.length == 0) {
            homes = Object.keys(fs.HOME.get(pl.realName, {}));
            if (homes.length == 0) {
                ST(pl, GL(pl.xuid, "homels", 0));
            } else {
                let homelist1 = homes.join(',');
                WriteUseLog("HOME-LIST", pl, homelist1);
                ST(pl, GL(pl.xuid, "homels", 1, homelist1));
            }
        } else {
            ST(pl, GL(pl.xuid, "homels", 2));
        }
    } catch (e) {
        ErrorMsg(e);
    }
}

function homeasgui(pl, cmd) {
    try {
        if (cmd.length == 0) {
            let plslist = Object.keys(JSON.parse(fs.HOME.read()));
            sendSelectForm(pl, "§l§dHOMEAS", GL(pl.xuid, "homeasgui", 0), plslist, fs.TMET.get("SelectForm").Subsection, (pl, args) => {
                if (args != null) {
                    if (args.length > 1) {
                        ST(pl, GL(pl.xuid, "homeasgui", 1));
                        return;
                    }
                    let selected = [args[0]];
                    let gui = JSON.parse(GL(pl.xuid, "homeasgui", 3));
                    pl.sendSimpleForm('§l§dHOMEAS', GL(pl.xuid, "homeasgui", 2), gui, new Array(gui.length).fill(""), function (pl1, selected1) {
                        try {
                            if (selected1 == 0) {
                                let newform = mc.newCustomForm();
                                newform.setTitle("§l§dHOMEASADD");
                                newform.addInput(GL(pl1.xuid, "homeasgui", 4), "home", "");
                                pl1.sendForm(newform, function (pl2, selected2) {
                                    try {
                                        if (selected2 != null) {
                                            plRunCmdAs(pl2.xuid, `/homeas "${plslist[selected[0]]}" add "${selected2[0]}"`);
                                        } else {
                                            ST(pl2, GL(pl2.xuid, "homeasgui", 5));
                                        }
                                    } catch (e) {
                                        ErrorMsg(e);
                                    }
                                });
                            } else if (selected1 == 1) {
                                let homelist = Object.keys(fs.HOME.get(plslist[selected[0]], {})),
                                    image = new Array(homelist.length).fill('');
                                if (homelist.length == 0) {
                                    ST(pl1, GL(pl1.xuid, "homeasgui", 6));
                                } else {
                                    pl1.sendSimpleForm('§l§dHOMEASGO', GL(pl1.xuid, "homeasgui", 7), homelist, image, function (pl2, selected2) {
                                        try {
                                            if (selected2 != null) {
                                                plRunCmdAs(pl2.xuid, `/homeas "${plslist[selected[0]]}" go "${homelist[selected2]}"`);
                                            } else {
                                                ST(pl2, GL(pl2.xuid, "homeasgui", 8));
                                            }
                                        } catch (e) {
                                            ErrorMsg(e);
                                        }
                                    })
                                }
                            } else if (selected1 == 2) {
                                let newform = mc.newCustomForm(),
                                    homelist = Object.keys(fs.HOME.get(plslist[selected[0]], {}));
                                newform.setTitle("§l§dHOMEASDEL");
                                newform.addDropdown(GL(pl1.xuid, "homeasgui", 9), homelist, 0);
                                if (homelist.length != 0) {
                                    pl1.sendForm(newform, function (pl2, selected2) {
                                        try {
                                            if (selected2 != null) {
                                                plRunCmdAs(pl2.xuid, `/homeas "${plslist[selected[0]]}" del "${homelist[selected2[0]]}"`);
                                            } else {
                                                ST(pl2, GL(pl2.xuid, "homeasgui", 10));
                                            }
                                        } catch (e) {
                                            ErrorMsg(e);
                                        }
                                    })
                                } else {
                                    ST(pl1, GL(pl1.xuid, "homeasgui", 11));
                                }
                            } else {
                                ST(pl1, GL(pl1.xuid, "homeasgui", 12));
                            }
                        } catch (e) {
                            ErrorMsg(e);
                        }
                    })
                } else {
                    ST(pl, GL(pl.xuid, "homeasgui", 13));
                }
            });
        }
    } catch (e) {
        ErrorMsg(e);
    }
}

function homeas(pl, cmd) {
    try {
        if (cmd.length == 3) {
            let plname = cmd[0],
                operation = cmd[1],
                home = cmd[2];
            if (operation == 'add') {
                let homelist = Object.keys(fs.HOME.get(plname, {}));
                if (homelist.length >= fs.TMET.get("HOME")["MaxHome"]) {
                    ST(pl, GL(pl.xuid, "homeas", 0, fs.TMET.get("HOME")["MaxHome"]));
                } else if (fs.HOME.get(plname)[home] == null) {
                    let homes = fs.HOME.get(plname);
                    homes[home] = { "x": floor1(pl.pos.x), "y": floor1(pl.pos.y), "z": floor1(pl.pos.z), "dimid": pl.pos.dimid };
                    fs.HOME.set(plname, homes);
                    let homeStr = JSON.stringify(homes[home]);
                    WriteUseLog("HOME-AS-ADD", pl, `${plname}:${home}:${homeStr}`);
                    logger.debug(pl.realName, " homeas ", plname, " add ", home, ':', homeStr);
                    ST(pl, GL(pl.xuid, "homeas", 1));
                } else {
                    ST(pl, GL(pl.xuid, "homeas", 2));
                }
            } else if (operation == 'go') {
                let homes = fs.HOME.get(plname)[home],
                    homeStr = JSON.stringify(homes);
                if (homes != null) {
                    bool = false;
                    WriteUseLog("HOME-AS-GO", pl, `${plname}:${home}:${homeStr}`);
                    logger.debug(pl.realName, " homeas ", plname, " go ", home, ':', homeStr);
                    HOMEtp(pl, homes.x, homes.y, homes.z, homes.dimid, home);
                } else {
                    ST(pl, GL(pl.xuid, "homeas", 3));
                }
            } else if (operation == 'del') {
                let homes = fs.HOME.get(plname),
                    homeStr = JSON.stringify(homes[home]);
                if (homes[home] != null) {
                    WriteUseLog("HOME-AS-DEL", pl, `${plname}:${home}:${homeStr}`);
                    logger.debug(pl.realName, " homeas ", plname, " del ", home, ':', homeStr);
                    delete homes[home];
                    fs.HOME.set(plname, homes);
                    ST(pl, GL(pl.xuid, "homeas", 4, home));
                } else if (!homeyn) {
                    ST(pl, GL(pl.xuid, "homeas", 5));
                }
            }
        } else if (cmd.length == 2) {
            let plname = cmd[0],
                operation = cmd[1];
            if (operation == 'ls') {
                let homes = Object.keys(fs.HOME.get(plname, {}));
                if (homes.length == 0) {
                    ST(pl, GL(pl.xuid, "homeas", 6));
                } else {
                    let homelist1 = homes.join(',');
                    WriteUseLog("HOME-AS-DEL", pl, `${plname}:${homelist1}`);
                    ST(pl, GL(pl.xuid, "homeas", 7, homelist1));
                }
            } else {
                ST(pl, GL(pl.xuid, "homeas", 8));
            }
        } else if (cmd.length == 0) {
            homeasgui(pl, []);
        } else {
            ST(pl, GL(pl.xuid, "homeas", 9));
        }
    } catch (e) {
        ErrorMsg(e);
    }
}

//WARP
function WARPload() {
    try {
        logger.debug("load WARP...");
        fs["WARP"] = TMdata.openConfig('.\\plugins\\Timiya\\data\\warplist.json', 'json', '{}');
        TMCmd.regPlayerCmd('warp', GL("default", "WARPload", 0), warpgui, 0);
        TMCmd.regPlayerCmd('warp gui', GL("default", "WARPload", 1), warpgui, 0);
        TMCmd.regPlayerCmd('warp go', GL("default", "WARPload", 2, fs.TMET.get("WARP")["ConsumeMoney"]), warpgo, 0);
        TMCmd.regPlayerCmd('warp add', GL("default", "WARPload", 3), warpadd, 1);
        TMCmd.regPlayerCmd('warp del', GL("default", "WARPload", 4), warpdel, 1);
        TMCmd.regPlayerCmd('warp ls', GL("default", "WARPload", 5), warpls, 0);
    } catch (e) {
        ErrorMsg(e);
    }
}

function WARPtp(pl, x, y, z, dimid, warp) {
    try {
        giveSlow_falling(pl);
        pl.teleport(new FloatPos(x, y, z, dimid));
        ST(pl, GL(pl.xuid, "WARPtp", 0, warp));
    } catch (e) {
        ErrorMsg(e);
    }
}

function warpgui(pl, cmd) {
    try {
        if (cmd.length == 0) {
            let consume = fs.TMET.get("WARP")["ConsumeMoney"];
            if (!fIsOP(pl.xuid)) {
                let warplist = Object.keys(JSON.parse(fs.WARP.read())),
                    image = new Array(warplist.length).fill("");
                if (warplist.length != 0) {
                    pl.sendSimpleForm('§l§dWARPGO', GL(pl.xuid, "warpgui", 0, consume, fs.TMET.get("Money")["MoneyName"], getmoney(pl.realName), fs.TMET.get("Money")["MoneyName"]), warplist, image, function (pl1, selected) {
                        try {
                            if (selected != null) {
                                plRunCmdAs(pl1.xuid, `/warp go "${warplist[selected]}"`);
                            } else {
                                ST(pl1, GL(pl1.xuid, "warpgui", 1));
                            }
                        } catch (e) {
                            ErrorMsg(e);
                        }
                    })
                } else {
                    ST(pl, GL(pl.xuid, "warpgui", 2));
                }
            } else {
                let gui = JSON.parse(GL(pl.xuid, "warpgui", 4));
                pl.sendSimpleForm('§l§dWARPGUI', GL(pl.xuid, "warpgui", 3), gui, new Array(gui.length).fill(""), function (pl, selected) {
                    try {
                        if (selected != null) {
                            if (selected == 0) {
                                let newform = mc.newCustomForm();
                                newform.setTitle('§l§dWARPADD');
                                newform.addInput(GL(pl.xuid, "warpgui", 5), 'warp', '');
                                pl.sendForm(newform, function (pl1, selected1) {
                                    try {
                                        if (selected1 != null) {
                                            plRunCmdAs(pl1.xuid, `/warp add "${selected1[0]}"`);
                                        } else {
                                            ST(pl1, GL(pl1.xuid, "warpgui", 6));
                                        }
                                    } catch (e) {
                                        ErrorMsg(e);
                                    }
                                })
                            } else if (selected == 1) {
                                let warplist = Object.keys(JSON.parse(fs.WARP.read())),
                                    image = new Array(warplist.length).fill('');
                                if (warplist.length != 0) {
                                    pl.sendSimpleForm('§l§dWARPGO', GL(pl.xuid, "warpgui", 7, consume, fs.TMET.get("Money")["MoneyName"], getmoney(pl.realName), fs.TMET.get("Money")["MoneyName"]), warplist, image, function (pl1, selected1) {
                                        try {
                                            if (selected1 != null) {
                                                plRunCmdAs(pl1.xuid, `/warp go "${warplist[selected1]}"`);
                                            } else {
                                                ST(pl1, GL(pl1.xuid, "warpgui", 8));
                                            }
                                        } catch (e) {
                                            ErrorMsg(e);
                                        }
                                    })
                                } else {
                                    ST(pl, GL(pl.xuid, "warpgui", 9));
                                }
                            } else if (selected == 2) {
                                let warplist = Object.keys(JSON.parse(fs.WARP.read()));
                                if (warplist.length != 0) {
                                    let newform = mc.newCustomForm();
                                    newform.setTitle('§l§dWARPDEL');
                                    newform.addDropdown(GL(pl.xuid, "warpgui", 10), warplist, 0);
                                    pl.sendForm(newform, function (pl1, selected1) {
                                        try {
                                            if (selected1 != null) {
                                                plRunCmdAs(pl1.xuid, `/warp del "${warplist[selected1[0]]}"`);
                                            } else {
                                                ST(pl1, GL(pl1.xuid, "warpgui", 11));
                                            }
                                        } catch (e) {
                                            ErrorMsg(e);
                                        }
                                    })
                                } else {
                                    ST(pl, GL(pl.xuid, "warpgui", 12));
                                }
                            }
                        } else {
                            ST(pl, GL(pl.xuid, "warpgui", 13));
                        }
                    } catch (e) {
                        ErrorMsg(e);
                    }
                })
            }
        }
    } catch (e) {
        ErrorMsg(e);
    }
}

function warpgo(pl, cmd) {
    try {
        if (cmd.length == 1) {
            let warp = cmd[0];
            if (warp == '') {
                ST(pl, GL(pl.xuid, "warpgo", 0));
            } else {
                if (fs.WARP.get(warp, null) == null) {
                    ST(pl, GL(pl.xuid, "warpgo", 1, warp));
                } else {
                    if (getmoney(pl.realName) >= fs.TMET.get("WARP")["ConsumeMoney"] && setmoney(pl.realName, (getmoney(pl.realName) - fs.TMET.get("WARP")["ConsumeMoney"]))) {
                        let warpStr = JSON.stringify(fs.WARP.get(warp));
                        WriteUseLog("WARP-GO", pl, `${warp}:${warpStr}`);
                        logger.debug(pl.realName, " warp go ", warp, ':', warpStr);
                        WARPtp(pl, fs.WARP.get(warp)["x"], fs.WARP.get(warp)["y"], fs.WARP.get(warp)["z"], fs.WARP.get(warp)["dimid"], warp);
                    } else {
                        ST(pl, GL(pl.xuid, "warpgo", 2));
                    }
                }
            }
        } else {
            ST(pl, GL(pl.xuid, "warpgo", 3));
        }
    } catch (e) {
        ErrorMsg(e);
    }
}

function warpadd(pl, cmd) {
    try {
        if (cmd.length == 1) {
            let warp = cmd[0];
            if (warp == '') {
                ST(pl, GL(pl.xuid, "warpadd", 0));
            } else {
                if (fs.WARP.get(warp, null) == null) {
                    fs.WARP.set(warp, { "x": floor1(pl.pos.x), "y": floor1(pl.pos.y), "z": floor1(pl.pos.z), "dimid": pl.pos.dimid });
                    let warpStr = JSON.stringify(fs.WARP.get(warp));
                    WriteUseLog("WARP-ADD", pl, `${warp}:${warpStr}`);
                    logger.debug(pl.realName, " warp add ", warp, ':', warpStr);
                    ST(pl, GL(pl.xuid, "warpadd", 1, warp));
                } else {
                    ST(pl, GL(pl.xuid, "warpadd", 2));
                }
            }
        } else {
            ST(pl, GL(pl.xuid, "warpadd", 3));
        }
    } catch (e) {
        ErrorMsg(e);
    }
}

function warpdel(pl, cmd) {
    try {
        if (cmd.length == 1) {
            let warp = cmd[0];
            if (warp == '') {
                ST(pl, GL(pl.xuid, "warpdel", 0));
            } else {
                if (fs.WARP.get(warp, null) == null) {
                    ST(pl, GL(pl.xuid, "warpdel", 1));
                } else {
                    let warpStr = JSON.stringify(fs.WARP.get(warp));
                    WriteUseLog("WARP-DEL", pl, `${warp}:${warpStr}`);
                    logger.debug(pl.realName, " warp del ", warp, ':', warpStr);
                    fs.WARP.delete(warp);
                    ST(pl, GL(pl.xuid, "warpdel", 2, warp));
                }
            }
        } else {
            ST(pl, GL(pl.xuid, "warpdel", 3));
        }
    } catch (e) {
        ErrorMsg(e);
    }
}

function warpls(pl, cmd) {
    if (cmd == 0) {
        let warps = Object.keys(JSON.parse(fs.WARP.read()));
        if (warps.length == 0) {
            ST(pl, GL(pl.xuid, "warpls", 0));
        } else {
            let warplist = warps.join(',');
            WriteUseLog("WARP-LIST", pl, warplist);
            ST(pl, GL(pl.xuid, "warpls", 1, warplist));
        }
    } else {
        ST(pl, GL(pl.xuid, "warpls", 2));
    }
}

//BACK
function BACKload() {
    try {
        logger.debug("load BACK...");
        tmp["backdata"] = {};
        tmp["tell"] = {};
        tmp["Invincible"] = {};
        if (fs.TMET.get("BACK")["SaveToFile"]) {
            fs["BACK"] = TMdata.openConfig('.\\plugins\\Timiya\\data\\deathlist.json', '', '{}');
            tmp["backdata"] = JSON.parse(fs.BACK.read());
        }
        TMLS.listen("onPlayerDie", BACKPlDie);
        TMLS.listen("onMobHurt", BACKhurt);
        TMLS.listen("onRespawn", BACKspawn);
        TMCmd.regPlayerCmd('back', GL("default", "BACKload", 0, fs.TMET.get("BACK")["ConsumeMoney"]), backto, 0);
        TMCmd.regPlayerCmd('death', GL("default", "BACKload", 1), death, 0);
    } catch (e) {
        ErrorMsg(e);
    }
}

function BACKtp(pl, x, y, z, dimid) {
    try {
        giveSlow_falling(pl);
        pl.teleport(new FloatPos(x, y, z, dimid));
        ST(pl, GL(pl.xuid, "BACKtp", 0));
    } catch (e) {
        ErrorMsg(e);
    }
}

function BACKhurt(mob, kill, Num) {
    try {
        let pl = mob.toPlayer();
        if (pl != null) {
            if (tmp["Invincible"][pl.realName]) {
                return false;
            }
        }
    } catch (e) {
        ErrorMsg(e);
    }
}

function backto(pl, cmd) {
    try {
        let xmon = fs.TMET.get("BACK")["ConsumeMoney"],
            mon = getmoney(pl.realName);
        if (tmp["backdata"][pl.realName] != null && JSON.stringify(tmp["backdata"]) != '[]') {
            let dim = "Unkown";
            if (tmp["backdata"][pl.realName][0].dimid == 0) {
                dim = GL(pl.xuid, "backto", 0);
            } else if (tmp["backdata"][pl.realName][0].dimid == 1) {
                dim = GL(pl.xuid, "backto", 1);
            } else if (tmp["backdata"][pl.realName][0].dimid == 2) {
                dim = GL(pl.xuid, "backto", 2);
            }
            let info = GL(pl.xuid, "backto", 3, dim, tmp["backdata"][pl.realName][0].x, tmp["backdata"][pl.realName][0].y, tmp["backdata"][pl.realName][0].z, tmp["backdata"][pl.realName][0].time, xmon, fs.TMET.get("Money")["MoneyName"], mon, fs.TMET.get("Money")["MoneyName"]);
            pl.sendModalForm('§l§dBACK', info, GL(pl.xuid, "backto", 4), GL(pl.xuid, "backto", 5), function (pl, selected) {
                try {
                    if (selected == 1) {
                        if (mon >= xmon && setmoney(pl.realName, (mon - xmon))) {
                            logger.debug(pl.realName, " go back:", JSON.stringify(tmp["backdata"][pl.realName][0]));
                            BACKtp(pl, tmp["backdata"][pl.realName][0].x, tmp["backdata"][pl.realName][0].y, tmp["backdata"][pl.realName][0].z, tmp["backdata"][pl.realName][0].dimid);
                            if (!ISNJS) {
                                tmp["Invincible"][pl.realName] = true;
                                setTimeout(function () {
                                    delete tmp["Invincible"][pl.realName];
                                }, fs.TMET.get("BACK")["InvincibleTime"] * 1000);
                            } else {
                                runcmdEx("effect \"" + pl.name + "\" resistance " + fs.TMET.get("BACK")["InvincibleTime"] + " 5 true");
                            }
                        } else {
                            ST(pl, GL(pl.xuid, "backto", 6));
                        }
                    } else if (selected == 0) {
                        ST(pl, GL(pl.xuid, "backto", 7));
                    } else if (selected == null) {
                        ST(pl, GL(pl.xuid, "backto", 8));
                    }
                } catch (e) {
                    ErrorMsg(e);
                }
            })
        } else
            ST(pl, GL(pl.xuid, "backto", 9));
    } catch (e) {
        ErrorMsg(e);
    }
}

function BACKspawn(pl) {
    try {
        if (tmp["tell"][pl.realName] != null) {
            logger.debug(pl.realName, " BACKtell");
            ST(pl, tmp["tell"][pl.realName]);
            delete tmp["tell"][pl.realName];
        }
    } catch (e) {
        ErrorMsg(e);
    }
}

function BACKPlDie(pl) {
    try {
        let time = system.getTimeStr();
        if (tmp["backdata"][pl.realName] == null) {
            tmp["backdata"][pl.realName] = [];
        }
        tmp["backdata"][pl.realName].unshift({ "time": time, "x": floor1(pl.pos.x), "y": floor1(pl.pos.y), "z": floor1(pl.pos.z), "dimid": pl.pos.dimid });
        if (tmp["backdata"][pl.realName].length > fs.TMET.get("BACK")["MaxSave"] - 1) {
            let num = tmp["backdata"][pl.realName].length - fs.TMET.get("BACK")["MaxSave"] + 1,
                i = 1;
            while (i < num) {
                tmp["backdata"][pl.realName].pop();
                i++;
            }
        }
        if (fs.TMET.get("BACK")["SaveToFile"]) {
            fs.BACK.write(JSON.stringify(tmp["backdata"]));
        }
        let dim = "";
        if (tmp["backdata"][pl.realName][0].dimid == 0) {
            dim = GL(pl.xuid, "BACKPlDie", 0);
        }
        else if (tmp["backdata"][pl.realName][0].dimid == 1) {
            dim = GL(pl.xuid, "BACKPlDie", 1);
        }
        else if (tmp["backdata"][pl.realName][0].dimid == 2) {
            dim = GL(pl.xuid, "BACKPlDie", 2);
        }
        let backStr = JSON.stringify(tmp["backdata"][pl.realName][0]);
        WriteUseLog("BACK-DIE", pl, backStr);
        logger.debug(pl.realName, " die:", backStr);
        tmp["tell"][pl.realName] = GL(pl.xuid, "BACKPlDie", 3, dim, tmp["backdata"][pl.realName][0].x, tmp["backdata"][pl.realName][0].y, tmp["backdata"][pl.realName][0].z, tmp["backdata"][pl.realName][0].time);
    } catch (e) {
        ErrorMsg(e);
    }
}

function death(pl, cmd) {
    try {
        let newform = mc.newCustomForm(),
            i = 0;
        newform.setTitle("§l§dDEATHLIST");
        if (tmp["backdata"][pl.realName] == null) {
            tmp["backdata"][pl.realName] = [];
        }
        while (i < tmp["backdata"][pl.realName].length) {
            let time = tmp["backdata"][pl.realName][i].time,
                dim = "";
            if (tmp["backdata"][pl.realName][i].dimid == 0) {
                dim = GL(pl.xuid, "death", 0);
            }
            else if (tmp["backdata"][pl.realName][i].dimid == 1) {
                dim = GL(pl.xuid, "death", 1);
            }
            else if (tmp["backdata"][pl.realName][i].dimid == 2) {
                dim = GL(pl.xuid, "death", 2);
            }
            let pos = dim + ' ' + tmp["backdata"][pl.realName][i]["x"] + ' ' + tmp["backdata"][pl.realName][i]["y"] + ' ' + tmp["backdata"][pl.realName][i]["z"],
                info = GL(pl.xuid, "death", 3, (i + 1), fs.TMET.get("BACK")["MaxSave"], pos, time);
            newform.addLabel(info);
            i++;
        }
        if (tmp["backdata"][pl.realName].length != 0) {
            WriteUseLog("BACK-CHECK", pl, "");
            pl.sendForm(newform, function () { });
            logger.debug(pl.realName, " check back data");
        } else {
            ST(pl, GL(pl.xuid, "death", 4));
        }
    } catch (e) {
        ErrorMsg(e);
    }
}

//DynamicMotd
function DynamicMotdload() {
    try {
        logger.debug("load DynamicMotd...");
        tmp["DynamicMotd"] = {
            "number": 0
        };
        setInterval(motd, fs.TMET.get("DYNAMICMOTD")["Time"] * 1000);
    } catch (err) {
        ErrorMsg(err);
    }
}

function motd() {
    try {
        let motds = fs.TMET.get("DYNAMICMOTD")["Motds"];
        WriteUseLog("DYNAMICMOTD-setMotd", null, motds[tmp.DynamicMotd.number]);
        mc.setMotd(motds[tmp.DynamicMotd.number], true);
        if (motds.length <= (tmp.DynamicMotd.number + 1)) {
            tmp.DynamicMotd.number = 0;
        } else {
            tmp.DynamicMotd.number++;
        }
    } catch (err) {
        ErrorMsg(err);
    }
}

//Notice
function NOTICEload() {
    try {
        logger.debug("load Notice...");
        TMCmd.regPlayerCmd('notice', GL("default", "NOTICEload", 0), lookNotice, 0);
        TMCmd.regPlayerCmd('notice_op', GL("default", "NOTICEload", 1), setNotice, 1);
        TMLS.listen("onJoin", function (pl) {
            if (fs.TMET.get("NOTICE")["JoinOpenNotice"]) {
                lookNotice(pl);
            }
        });
    } catch (e) {
        ErrorMsg(e);
    }
}

function lookNotice(pl) {
    try {
        let newform = mc.newCustomForm();
        newform.setTitle(fs.TMET.get("NOTICE")["NoticeTitle"]);
        newform.addLabel(fs.TMET.get("NOTICE")["NoticeText"].replace(/#&#/g, "\n§r"));
        WriteUseLog("NOTICE-LOOK", pl, "");
        logger.debug(pl.realName, " look notice");
        pl.sendForm(newform, function (pl) { });
    } catch (e) {
        ErrorMsg(e);
    }
}

function doneform(pl, str, func) {
    try {
        pl.sendModalForm('§l§dFORMDONE', str, GL(pl.xuid, "doneform", 0), GL(pl.xuid, "doneform", 1), function (pl, selected) {
            try {
                if (selected != null) {
                    if (selected) {
                        func(pl, []);
                    } else {
                        ST(pl, GL(pl.xuid, "doneform", 2));
                    }
                } else {
                    ST(pl, GL(pl.xuid, "doneform", 3));
                }
            } catch (e) {
                ErrorMsg(e);
            }
        })
    } catch (e) {
        ErrorMsg(e);
    }
}

function setNotice(pl, cmd) {
    try {
        let gui = JSON.parse(GL(pl.xuid, "setNotice", 1));
        pl.sendSimpleForm('§l§dNOTICESETTING', GL(pl.xuid, "setNotice", 0), gui, new Array(gui.length).fill(""), function (pl, selected) {
            try {
                if (selected != null) {
                    if (selected == 0) {
                        settitle(pl);
                    }
                    else {
                        setcontent(pl);
                    }
                } else {
                    ST(pl, GL(pl.xuid, "setNotice", 2));
                }
            } catch (e) {
                ErrorMsg(e);
            }
        })
    } catch (e) {
        ErrorMsg(e);
    }
}

function settitle(pl) {
    try {
        let newform = mc.newCustomForm();
        newform.setTitle("§l§dSETTITLE");
        newform.addInput(GL(pl.xuid, "settitle", 0), "title", fs.TMET.get("NOTICE")["NoticeTitle"]);
        pl.sendForm(newform, function (pl1, selected) {
            try {
                if (selected != null) {
                    let NT = fs.TMET.get("NOTICE");
                    NT.NoticeTitle = selected[0];
                    WriteUseLog("NOTICE-SETTITLE", pl, selected[0]);
                    fs.TMET.set("NOTICE", NT);
                    logger.debug(pl1.realName, " set notice Title: ", selected[0]);
                    doneform(pl1, GL(pl.xuid, "settitle", 1), setNotice);
                } else
                    ST(pl1, GL(pl.xuid, "settitle", 2));
            } catch (e) {
                ErrorMsg(e);
            }
        })
    } catch (e) {
        ErrorMsg(e);
    }
}

function setcontent(pl) {
    try {
        let newsform = mc.newSimpleForm(),
            content = fs.TMET.get("NOTICE")["NoticeText"].split('#&#'),
            line = content.length,
            i = 0,
            l = (2 + content.length);
        content.push(GL(pl.xuid, "setcontent", 0));
        content.push(GL(pl.xuid, "setcontent", 1));
        newsform.setTitle("§l§dSETCONTENT");
        newsform.setContent(GL(pl.xuid, "setcontent", 2));
        while (i < l) {
            newsform.addButton(content[i]);
            i++;
        }
        pl.sendForm(newsform, function (pl1, selected) {
            try {
                if (selected != null) {
                    if (selected < line) {
                        let newform = mc.newCustomForm();
                        newsform.setTitle("§l§dSETCONTENT");
                        newform.addInput(GL(pl1.xuid, "setcontent", 3), "content", content[selected]);
                        pl1.sendForm(newform, function (pl2, selected1) {
                            try {
                                if (selected1 != null) {
                                    content[selected] = selected1[0];
                                    let str = "",
                                        i = 0,
                                        NT = fs.TMET.get("NOTICE");
                                    while (i < line) {
                                        if (str == "") {
                                            str = content[i];
                                        } else {
                                            str = str + '#&#' + content[i];
                                        }
                                        i++;
                                    }
                                    NT.NoticeText = str;
                                    WriteUseLog("NOTICE-SETLINE", pl2, `${selected} to ${selected1[0]}`);
                                    logger.debug(pl2.realName, " set notice line:", selected, " to ", selected1[0]);
                                    fs.TMET.set("NOTICE", NT);
                                    doneform(pl2, GL(pl2.xuid, "setcontent", 4), setcontent);
                                } else {
                                    ST(pl2, GL(pl2.xuid, "setcontent", 5));
                                }
                            } catch (e) {
                                ErrorMsg(e);
                            }
                        })
                    } else if (selected == line) {
                        content.pop();
                        content.pop();
                        content.push(GL(pl1.xuid, "setcontent", 6));
                        let str = "",
                            i = 0,
                            NT = fs.TMET.get("NOTICE");
                        while (i < (line + 1)) {
                            if (str == "") {
                                str = content[i];
                            } else {
                                str = str + '#&#' + content[i];
                            }
                            i++;
                        }
                        WriteUseLog("NOTICE-ADDLINE", pl1, "");
                        NT.NoticeText = str;
                        fs.TMET.set("NOTICE", NT);
                        logger.debug(pl1.realName, " add notice line");
                        doneform(pl1, GL(pl1.xuid, "setcontent", 7), setcontent);
                    } else if (selected == (line + 1)) {
                        let newform1 = mc.newCustomForm(),
                            dataop = fs.TMET.get("NOTICE")["NoticeText"].split('#&#');
                        newform1.setTitle("§l§dDELNOTICELINE");
                        newform1.addDropdown(GL(pl1.xuid, "setcontent", 8), dataop);
                        pl1.sendForm(newform1, function (pl2, selected1) {
                            try {
                                if (selected1 != null) {
                                    dataop.splice(selected1[0], 1);
                                    let str = "",
                                        i = 0,
                                        l = dataop.length,
                                        NT = fs.TMET.get("NOTICE");
                                    while (i < l) {
                                        if (str == "") {
                                            str = dataop[i];
                                        } else {
                                            str = str + '#&#' + dataop[i];
                                        }
                                        i++;
                                    }
                                    NT.NoticeText = str;
                                    WriteUseLog("NOTICE-DELLINE", pl2, selected1[0]);
                                    logger.debug(pl2.realName, " del notice Line:", selected1[0]);
                                    fs.TMET.set("NOTICE", NT);
                                    doneform(pl2, GL(pl2.xuid, "setcontent", 9), setcontent);
                                } else
                                    ST(pl2, GL(pl2.xuid, "setcontent", 10));
                            } catch (e) {
                                ErrorMsg(e);
                            }
                        })
                    }
                } else
                    ST(pl1, GL(pl1.xuid, "setcontent", 11));
            } catch (e) {
                ErrorMsg(e);
            }
        })
    } catch (e) {
        ErrorMsg(e);
    }
}

//SHOP
function Shopload() {
    try {
        logger.debug("load Shop...");
        fs["SHOP"] = TMdata.openConfig(".\\plugins\\Timiya\\data\\shopdata.json", "", JSON.stringify(defaultShopdata, null, 2));
        TMCmd.regPlayerCmd("shop", GL("default", "Shopload", 0), shopgui, 0);
        TMCmd.regPlayerCmd("shop buy", GL("default", "Shopload", 1), (pl, cmd) => { shopBuy(pl, fs.SHOP.get("Buy", []), "Buy"); }, 0);
        TMCmd.regPlayerCmd("shop sell", GL("default", "Shopload", 2), (pl, cmd) => { shopSell(pl, fs.SHOP.get("Sell", []), "Sell"); }, 0);
    } catch (err) {
        ErrorMsg(err);
    }
}

function shopgui(pl, cmd) {
    try {
        let gui = JSON.parse(GL(pl.xuid, "shopgui", 0));
        pl.sendSimpleForm("§l§dSHOP", GL(pl.xuid, "shopgui", 1), gui, new Array(gui.length).fill(""), BuyOrShell);
        function BuyOrShell(pl, selected) {
            try {
                if (selected != null) {
                    if (selected == 0) {
                        shopBuy(pl, fs.SHOP.get("Buy", []), "Buy");
                    } else if (selected == 1) {
                        shopSell(pl, fs.SHOP.get("Sell", []), "Sell");
                    }
                } else {
                    ST(pl, GL(pl.xuid, "shopgui", 2));
                }
            } catch (err) {
                ErrorMsg(err);
            }
        }
    } catch (err) {
        ErrorMsg(err);
    }
}

function isRightStore(shop, name) {
    try {
        let i = 0, type = null,
            l = shop.length;
        while (i < l) {
            let button = shop[i];
            if (!isObject(button)) {
                type = 0;
                break;
            } else if (typeof (button.name) != "string") {
                type = 1;
                break;
            } else if (button.type != "exam" && button.type != "group") {
                type = 2;
                break;
            } else if (typeof (button.data) != "object") {
                type = 3;
                break;
            }
            if (typeof (button.type) == "string" && button.type == "exam") {
                if (!isObject(button.data)) {
                    type = 4;
                    break;
                } else {
                    if (typeof (button.data.type) != "string") {
                        type = 6;
                        break;
                    } else if (typeof (button.data.aux) != "number") {
                        type = 7;
                        break;
                    } else if (typeof (button.data.money) != "number") {
                        type = 8;
                        break;
                    }
                }
            } else if (typeof (button.type) == "string" && button.type == "group") {
                if (!isArray(button.data)) {
                    type = 5;
                    break;
                }
            }
            i++;
        }
        if (type != null) {
            logger.error("Shop error in ", name);
            logger.error(`In the ${i} of the array`);
            switch (type) {
                case 0:
                    logger.error("The whole is not an object");
                    break;
                case 1:
                    logger.error("name is not a string");
                    break;
                case 2:
                    logger.error("type is not a group or exam");
                    break;
                case 3:
                    logger.error("data is not an object or array");
                    break;
                case 4:
                    logger.error("exam => data is not an object");
                    break;
                case 5:
                    logger.error("group => data is not an array");
                    break;
                case 6:
                    logger.error("exam => data => type is not a string");
                    break;
                case 7:
                    logger.error("exam => data => aux is not a number");
                    break;
                case 8:
                    logger.error("exam => data => money is not a number");
                    break;
                default:
                    logger.error("Unkown");
                    break;
            }
            return false;
        } else {
            return true;
        }
    } catch (err) {
        ErrorMsg(err);
        return false;
    }
}

function shopBuy(pl, commodity, name) {
    try {
        if (isArray(commodity)) {
            if (isRightStore(commodity, name)) {
                let butt = [], i = 0,
                    l = commodity.length, images = [];
                while (i < l) {
                    butt.push(commodity[i].name);
                    images.push((commodity[i].image || ""));
                    i++;
                }
                pl.sendSimpleForm("§l§dSHOPBUY", GL(pl.xuid, "shopBuy", 0), butt, images, Buying);
                function Buying(pl, selected) {
                    try {
                        if (selected != null) {
                            if (commodity[selected].type == "group") {
                                shopBuy(pl, commodity[selected].data, `${name}=>${commodity[selected].name}`);
                            } else if (commodity[selected].type == "exam") {
                                let newform = mc.newCustomForm();
                                newform.setTitle("§l§dSHOPBUYING");
                                newform.addLabel(GL(pl.xuid, "shopBuy", 1, commodity[selected].data.type, commodity[selected].data.aux, commodity[selected].data.money, getmoney(pl.realName), commodity[selected].data.remark));
                                newform.addInput(GL(pl.xuid, "shopBuy", 2), "Num", "");
                                pl.sendForm(newform, (pl1, selected1) => {
                                    try {
                                        if (selected1 != null) {
                                            let input = selected1[1];
                                            if (checkNumber(input)) {
                                                let Num = getNumber(input);
                                                if (Num > 0) {
                                                    let xuMon = (Num * commodity[selected].data.money), plMon = getmoney(pl1.realName);
                                                    if (plMon >= xuMon) {
                                                        let succ = mc.runcmdEx(`give "${pl1.name}" ${commodity[selected].data.type} ${Num} ${commodity[selected].data.aux}`).success;
                                                        if (succ) {
                                                            WriteUseLog("SHOP-BUY", pl1, `${name}[${selected}]=>${commodity[selected].name}*${Num}`);
                                                            setmoney(pl1.realName, (plMon - xuMon));
                                                            ST(pl1, GL(pl1.xuid, "shopBuy", 3));
                                                        } else {
                                                            ST(pl1, GL(pl1.xuid, "shopBuy", 4));
                                                        }
                                                    } else {
                                                        ST(pl1, GL(pl1.xuid, "shopBuy", 5));
                                                    }
                                                } else {
                                                    ST(pl1, GL(pl.xuid, "shopBuy", 6));
                                                }
                                            } else {
                                                ST(pl1, GL(pl1.xuid, "shopBuy", 7));
                                            }
                                        } else {
                                            ST(pl1, GL(pl.xuid, "shopBuy", 8));
                                        }
                                    } catch (err) {
                                        ErrorMsg(err);
                                    }
                                })
                            } else {
                                ST(pl, GL(pl.xuid, "shopBuy", 9));
                            }
                        } else {
                            ST(pl, GL(pl.xuid, "shopBuy", 10));
                        }
                    } catch (err) {
                        ErrorMsg(err);
                    }
                }
            } else {
                ST(pl, GL(pl.xuid, "shopBuy", 11));
            }
        } else {
            ST(pl, GL(pl.xuid, "shopBuy", 11));
        }
    } catch (err) {
        ErrorMsg(err);
    }
}

function shopSell(pl, commodity, name) {
    try {
        if (isArray(commodity)) {
            if (isRightStore(commodity, name)) {
                let butt = [],
                    i = 0,
                    l = commodity.length,
                    images = [];
                while (i < l) {
                    butt.push(commodity[i].name);
                    images.push((commodity[i].image || ""));
                    i++;
                }
                pl.sendSimpleForm("§l§dSHOPSELL", GL(pl.xuid, "shopSell", 0), butt, images, Selling);
                function Selling(pl, selected) {
                    try {
                        if (selected != null) {
                            if (commodity[selected].type == "group") {
                                shopSell(pl, commodity[selected].data, `${name}=>${commodity[selected].name}`);
                            } else if (commodity[selected].type == "exam") {
                                let newform = mc.newCustomForm();
                                newform.setTitle("§l§dSHOPSELLING");
                                newform.addLabel(GL(pl.xuid, "shopSell", 1, commodity[selected].data.type, commodity[selected].data.aux, commodity[selected].data.money, getmoney(pl.realName), commodity[selected].data.remark));
                                newform.addInput(GL(pl.xuid, "shopSell", 2), "Num", "");
                                pl.sendForm(newform, (pl1, selected1) => {
                                    try {
                                        if (selected1 != null) {
                                            let input = selected1[1];
                                            if (checkNumber(input)) {
                                                let Num = getNumber(input);
                                                if (Num > 0) {
                                                    if (haveIt(pl1, commodity[selected].data.type, Num, commodity[selected].data.aux)) {
                                                        let xuMon = (Num * commodity[selected].data.money), plMon = getmoney(pl1.realName),
                                                            succ = mc.runcmdEx(`clear "${pl1.name}" ${commodity[selected].data.type} ${commodity[selected].data.aux} ${Num}`).success;
                                                        if (succ) {
                                                            WriteUseLog("SHOP-SELL", pl1, `${name}[${selected}]=>${commodity[selected].name}*${Num}`);
                                                            setmoney(pl1.realName, (plMon + xuMon));
                                                            ST(pl1, GL(pl1.xuid, "shopSell", 3));
                                                        } else {
                                                            ST(pl1, GL(pl1.xuid, "shopSell", 4));
                                                        }
                                                    } else {
                                                        ST(pl1, GL(pl1.xuid, "shopSell", 5));
                                                    }
                                                } else {
                                                    ST(pl1, GL(pl1.xuid, "shopSell", 6));
                                                }
                                            } else {
                                                ST(pl1, GL(pl1.xuid, "shopSell", 7));
                                            }
                                        } else {
                                            ST(pl1, GL(pl1.xuid, "shopSell", 8));
                                        }
                                    } catch (err) {
                                        ErrorMsg(err);
                                    }
                                })
                            } else {
                                ST(pl, GL(pl.xuid, "shopSell", 9));
                            }
                        } else {
                            ST(pl, GL(pl.xuid, "shopSell", 10));
                        }
                    } catch (err) {
                        ErrorMsg(err);
                    }
                }
                function haveIt(pl, type, Num, aux) {
                    let inven = pl.getInventory().getAllItems(),
                        i = 0,
                        haveNum = 0,
                        l = inven.length;
                    while (i < l) {
                        let it = inven[i];
                        if (it.type == type && it.aux == aux) {
                            haveNum += it.count;
                        }
                        i++;
                    }
                    return (haveNum >= Num);
                }
            } else {
                ST(pl, GL(pl.xuid, "shopSell", 11));
            }
        } else {
            ST(pl, GL(pl.xuid, "shopSell", 11));
        }
    } catch (err) {
        ErrorMsg(err);
    }
}

//TPR
function TPRload() {
    try {
        logger.debug("load TPR...");
        TMCmd.regPlayerCmd('tpr', GL("default", "TPRload", 0, fs.TMET.get("TPR")["ConsumeMoney"]), tpr, 0);
    } catch (e) {
        ErrorMsg(e);
    }
}

function tpr(pl, cmd) {
    try {
        if (getmoney(pl.realName) >= fs.TMET.get("TPR")["ConsumeMoney"]) {
            /* 2022/2/4 21:40
             * 修改逻辑
             * 
             * 2022/4/26 12:02
             * 修复LLSE teleport坐标值偏差
             * y轴微调
             */
            let Obj = fs.TMET.get("TPR"), min = Obj["MinXZCoordinate"],
                max = (Obj["MaxXZCoordinate"] - min), TMPX = Math.floor(Math.random() * max),
                TMPZ = Math.floor(Math.random() * max), x = (TMPX + min - 0.5),
                z = (TMPZ + min - 0.5), dim = pl.pos.dimid,
                y = (dim == 0 ? 360 : (dim == 1 ? 90 : (dim == 2 ? 200 : 0))),
                lastPos = [pl.pos.x, pl.pos.y, pl.pos.z, pl.pos.dimid];

            let FakePl = { "realName": pl.realName, "pos": { "x": pl.pos.x, "y": pl.pos.y, "z": pl.pos.z, "dimid": pl.pos.dimid, "dim": pl.pos.dim } };
            WriteUseLog("TPR", pl, `x:${x}|z:${z}`);
            if (!ISNJS) {
                // addEffect(pl, 11, 60, 5, 0);
                ST(pl, GL(pl.xuid, "tpr", 0));
                giveSlow_falling(pl);
                pl.teleport(new FloatPos(x, y, z, dim));
                y = pl.pos.y;
                let isSafe = false;
                let moveCount = 0;
                let maxMoveCount = 3;
                let isWorking = false;
                let xuid = pl.xuid,
                    sid = setInterval(() => {
                        let pl = mc.getPlayer(xuid);
                        if (pl != null) {
                            if (pl.pos.y != y) {
                                moveCount++;
                                if (maxMoveCount > moveCount) {
                                    y = pl.pos.y;
                                }
                            }
                            if (moveCount >= maxMoveCount) {
                                if (!isWorking) {
                                    ST(pl, GL(pl.xuid, "tpr", 1));//寻找安全坐标
                                }
                                if (!isSafe) {
                                    isWorking = true;
                                    while (true) {
                                        let bl = mc.getBlock(new IntPos(Math.floor(x), Math.floor(y), Math.floor(z), dim));
                                        if (bl == null) { if (moveCount > (maxMoveCount + 3)) { y = 255; } return; }
                                        if (bl == null || y <= -40 || ["minecraft:lava", "minecraft:flowing_lava"].indexOf(bl.type) != -1) {
                                            ST(pl, GL(pl.xuid, "tpr", 2));
                                            giveSlow_falling(pl);
                                            pl.teleport(new FloatPos(...lastPos));
                                            clearInterval(sid);
                                            WriteUseLog("TPR", pl, "Fail");
                                            return;
                                        }
                                        if (bl.type != "minecraft:air") {
                                            isSafe = true;
                                            return;
                                        }
                                        y--;
                                    }
                                } else {
                                    clearInterval(sid);
                                    WriteUseLog("TPR", pl, "SUCCESS");
                                    setmoney(pl.realName, (getmoney(pl.realName) - fs.TMET.get("TPR")["ConsumeMoney"]));
                                    giveSlow_falling(pl);
                                    pl.teleport(new FloatPos(x, (2 + y), z, dim));
                                    ST(pl, GL(pl.xuid, "tpr", 3, x, Math.floor(y), z, dim));
                                }
                            }
                        } else {
                            clearInterval(sid);
                            WriteUseLog("TPR", FakePl, "Fail");
                        }
                    }, 100);
            } else {
                runcmdEx("effect \"" + pl.name + "\" resistance 60 5 true");
                pl.teleport(new FloatPos(x, y, z, dim));
                WriteUseLog("TPR", pl, "SUCCESS");
                setmoney(pl.realName, (getmoney(pl.realName) - fs.TMET.get("TPR")["ConsumeMoney"]));
                ST(pl, GL(pl.xuid, "tpr", 3, x, Math.floor(y), z, dim));
            }
        } else {
            ST(pl, GL(pl.xuid, "tpr", 4));
        }
    } catch (e) {
        ErrorMsg(e);
    }
}

//RC
function RELOADCHUCKload() {
    try {
        logger.debug("load ReloadChuck...");
        TMCmd.regPlayerCmd('rc', GL("default", "RELOADCHUCKload", 0, fs.TMET.get("ReloadChuck")["ConsumeMoney"]), rc, 0);
    } catch (e) {
        ErrorMsg(e);
    }
}

function rc(pl, cmd) {
    try {
        if (getmoney(pl.realName) >= fs.TMET.get("ReloadChuck")["ConsumeMoney"] && setmoney(pl.realName, (getmoney(pl.realName) - fs.TMET.get("ReloadChuck")["ConsumeMoney"]))) {
            if (!ISNJS) {
                pl.refreshChunks();
            } else {
                let pos = pl.pos;
                pos.x += 1000;
                pl.teleport(pos);
                setTimeout(() => {
                    pos.x -= 1000;
                    pl.teleport(pos);
                }, 500);
            }
            WriteUseLog("ReloadChuck", pl, "");
            ST(pl, GL(pl.xuid, "rc", 0));
        } else
            ST(pl, GL(pl.xuid, "rc", 1));
    } catch (e) {
        ErrorMsg(e);
    }
}

//FARMLAND
function FARMLANDPROTECTload() {
    try {
        logger.debug("load FarmLandProtect...");
        TMLS.listen("onFarmLandDecay", FarmLandProtect);
    } catch (e) {
        ErrorMsg(e);
    }
}

function FarmLandProtect(pos, en) {
    try {
        let operator = (fs.TMET.get("FarmLandProtect")["Type"] == 0 ?
            false :
            (fs.TMET.get("FarmLandProtect")["Type"] == 1 && en == null ?
                false :
                (fs.TMET.get("FarmLandProtect")["Type"] == 2 && en.toPlayer() == null ?
                    false :
                    (fs.TMET.get("FarmLandProtect")["Type"] == 3 && en.toPlayer() != null ?
                        false : true)
                )
            )
        );
        let FakePl = {
            "realName": (en != null ? en.name : "Null"),
            "pos": pos
        };
        WriteUseLog("FarmLandProtect", FakePl, "");
        logger.debug("FarmLandProtect:", operator);
        return operator;
    } catch (e) {
        ErrorMsg(e);
    }
}

//命令触发初始化
function CmdTriggerInit() {
    /**
     * 2022/3/31 14:52
     * 换了匹配方式，不需要了
    let ArrJud = function (arr1, arr2) {
        let num = 0,
            arr = (arr1.length >= arr1.length ? [arr2, arr1] : [arr1, arr2]),
            l = arr[0].length, i = 0;
        while (i < l) {
            let s1 = (arr[0][i] || null),
                s2 = (arr[1][i] || null);
            if (s1 == s2) {
                num++;
            }
            i++;
        }
        return num;
    }
     */
    TMLS.listen("onPlayerCmd", (pl, cmd) => {
        try {
            let cmds = Object.keys(TMCmd.PlCmds),
                cmdG = cmd.replace(/[/]/g, ""),
                l = cmds.length, i = 0, SelCmd = null,
                cmdArr1 = [], cmdLen = 0;
            while (i < l) {
                let nowCmd = cmds[i], nowCmdL = nowCmd.length;
                if (nowCmd == cmdG) {
                    SelCmd = nowCmd;
                    cmdArr1.length = 0;
                } else {
                    if (cmdG.indexOf(nowCmd) == 0 && cmdG[nowCmdL] == " ") {
                        if (cmdLen <= nowCmdL) {
                            SelCmd = nowCmd;
                            cmdArr1 = cmdFH(cmdG.substr(nowCmdL + 1));
                            cmdLen = nowCmdL;
                        }
                    }
                }
                i++;
            }
            if (typeof (SelCmd) == "string") {
                let SelCmdInfo = TMCmd.PlCmds[SelCmd];
                if (SelCmdInfo != null &&
                    (SelCmdInfo.perm == 1 ? fIsOP(pl.xuid) : true)) {
                    return (SelCmdInfo.func(pl, cmdArr1) || false);
                } else { return true; }
            }
        } catch (e) {
            ErrorMsg(e);
        }
    });
    TMLS.listen("onConsoleCmd", (cmd) => {
        try {
            let cmds = Object.keys(TMCmd.CoCmds),
                cmdG = cmd.replace(/[/]/g, ""),
                l = cmds.length, i = 0,
                SelCmd = null, cmdArr1 = [], cmdLen = 0;
            while (i < l) {
                let nowCmd = cmds[i], nowCmdL = nowCmd.length;
                if (nowCmd == cmdG) {
                    SelCmd = nowCmd;
                    cmdArr1.length = 0;
                } else {
                    if (cmdG.indexOf(nowCmd) == 0 && cmdG[nowCmdL] == " ") {
                        if (cmdLen <= nowCmdL) {
                            SelCmd = nowCmd;
                            cmdArr1 = cmdFH(cmdG.substr(nowCmdL + 1));
                            cmdLen = nowCmdL;
                        }
                    }
                }
                i++;
            }
            if (typeof (SelCmd) == "string") {
                let SelCmdInfo = TMCmd.CoCmds[SelCmd];
                if (SelCmdInfo != null) {
                    return SelCmdInfo.func(cmdArr1) || false;
                } else { return true; }
            }
        } catch (e) {
            ErrorMsg(e);
        }
    });
}

//初始化Tick任务
function TickTaskInit() {
    TMLS.listen("onTick", () => {
        while (TickTask.tasks.length != 0) {
            try {
                TickTask.tasks.shift()();
            } catch (e) {
                ErrorMsg(e);
            }
        }
    });
}

function UpdateConfig() {
    let temp = configExample,
        setup = JSON.parse(fs.TMET.read()),
        i = 0, k = Object.keys(temp),
        l = k.length;
    while (i < l) {
        let key = k[i];
        if (setup[key] == null) {
            logger.info("Update config: ", key);
        } else {
            if (!isObject(temp[key])) {
                temp[key] = setup[key];
            } else {
                let ks = Object.keys(temp[key]),
                    ll = ks.length, ii = 0;
                while (ii < ll) {
                    let keya = ks[ii];
                    if (setup[key][keya] == null) {
                        logger.info("Update config: ", key, ".", keya);
                    } else {
                        temp[key][keya] = setup[key][keya];
                    }
                    ii++;
                }
            }
        }
        i++;
    }
    if (setup.Debug) {
        temp.Debug = true;
    }
    logger.info("Save new operation...");
    fs.TMET.write(JSON.stringify(temp, null, 2));
    return true;
}

//自动更新
function AutoUpdate() {
    try {
        let autoUpdateStr = String.raw`(() => {
    let major = 1,
        minor = 14, revision = 515,
        other = {
            "作者": "提米吖",
            "开源地址": "https://gitee.com/timidine/mcbe-lite-xloader-tmessential",
            "说明": "本更新程序源码在TMET本体!"
        };
    ll.registerPlugin("TMETAutoUpdate.js", "新时代多功能基础插件自动更新程序",
        { "major": major, "minor": minor , "revision": revision }, other);
})();

logger.setTitle('TMETAutoUpdate');
logger.setLogLevel(4);

setInterval(function () {
    checkupdate();
}, 1000 * 60 * 10);

function checkupdate() {
    let pus = ll.listPlugins(),
        i = 0,
        bool = false,
        l = pus.length;
    while (i < l) {
        let pu = pus[i];
        if (pu == 'TMEssential.js') {
            bool = true;
        }
        i++;
    }
    network.httpGet('https://gitee.com/timidine/mcbe-lite-xloader-tmessential/raw/master/VER.txt', function (sta, da) {
        if (sta == 200) {
            if (da != "${version}" && !isNaN(+da)) {
                logger.info("检测到更新包,更新包版本:", da);
                logger.info("开始自动下载...");
                network.httpGet('https://gitee.com/timidine/mcbe-lite-xloader-tmessential/raw/master/TMEssential.js', function (st, dat) {
                    if (st == 200) {
                        let plugin = dat.replace(/\r/g, ''),
                            loaderDir = ".\\plugins";
                        file.writeTo('' + loaderDir + '\\TMEssential.js', plugin);
                        logger.info("下载完成,共" + (plugin.length / 1024).toFixed(2) + "KB,开始更新...");
                        if (!bool) {
                            mc.runcmdEx('ll load ' + loaderDir + '\\TMEssential.js');
                        } else {
                            mc.runcmdEx("ll reload TMEssential.js");
                        }
                    } else {
                        logger.error("自动更新获取失败, code:" + st + "");
                    }
                });
            } else if (!bool) {
                logger.info('Follow close...');
                mc.runcmdEx('ll unload TMETAutoUpdate.js');
            }
        }
    });
}
file.delete('.\\TMETAutoUpdate.js');`;
        file.writeTo('.\\TMETAutoUpdate.js', autoUpdateStr);
        let plugins = ll.listPlugins(),
            i = 0,
            l = plugins.length,
            bool = false;
        while (i < l) {
            let plugin = plugins[i];
            if (plugin == 'TMETAutoUpdate.js') {
                bool = true;
                break;
            }
            i++;
        }
        if (bool) {
            runcmdEx('ll reload TMETAutoUpdate.js');
        } else {
            runcmdEx('ll load TMETAutoUpdate.js');
        }
    } catch (err) {
        ErrorMsg();
    }
}

function NJSAutoUpdate() {
    let Sid = setInterval(() => {
        network.httpGet('https://gitee.com/timidine/mcbe-lite-xloader-tmessential/raw/master/VER.txt', function (sta, da) {
            if (sta == 200) {
                if (da != version) {
                    logger.info("检测到更新包,更新包版本:", da);
                    logger.info("开始自动下载...");
                    network.httpGet('https://gitee.com/timidine/mcbe-lite-xloader-tmessential/raw/master/TMEssential.js', function (st, dat) {
                        if (st == 200) {
                            let plugin = dat;
                            file.writeTo('' + getLoadPath() + '\\TMEssential.js', plugin);
                            logger.info("下载完成,共" + (plugin.length / 1024).toFixed(2) + "KB,请重启更新...");
                            clearInterval(Sid);
                        }
                    });
                }
            }
        });
    }, (1000 * 60) * 10);
}

function webNotice() {
    network.httpGet("https://gitee.com/timidine/mcbe-lite-xloader-tmessential/raw/master/notice.json", (code, dat) => {
        if (code != 200) {
            logger.error("Network announcement acquisition failed");
            return;
        }
        let je = JSON.parse(dat.replace(/\r/g, "")),
            l = je.length, i = 0;
        while (i < l) {
            logger.info(`| NetWork | ${je[i++]}`);
        }
    });
}

/**
 * 写日志
 * @param {string} type 事件
 * @param {Player?null} pl 玩家或者null 
 * @param {string} msg 信息
 */
function WriteUseLog(type, pl, msg) {
    let plName = (pl != null ? pl.realName : null),
        posTmp = (plName == null ? null : pl.pos);
    TickTask.add(() => {
        let ULConf = fs.TMET.get("UseLog");
        if (ULConf.Enable) {
            let Keys = Object.keys(ULConf.Conf),
                ty = type.split("-")[0],
                iOF = Keys.indexOf((ty == "MONEY" ? "Money" : ty));
            if (type == "Plugin" || ULConf.Conf[Keys[iOF]]) {
                file.mkdir(".\\logs\\TMEssential");
                let DTStr = system.getTimeStr(),
                    DateStr = DTStr.split(" ")[0],
                    FilePath = `.\\logs\\TMEssential\\UseLog-${DateStr}.csv`,
                    XYZ = (posTmp != null ? `[${floor1(posTmp.x)}|${floor1(posTmp.y)}|${floor1(posTmp.z)}]` : null),
                    Data = `${DTStr},${(plName != null ? posTmp.dim : "")},${(plName != null ? plName : "Console")},${(XYZ != null ? XYZ : "")},${type},${msg}`;
                if (!file.exists(FilePath)) {
                    file.writeLine(FilePath, GL("default", "WriteUseLog", 0));
                }
                file.writeLine(FilePath, Data);
            }
        }
    });
}

function TMETexportFunc(type, a, b, c, d) {
    let val = exportinfo(type, a, b, c, d);
    if (val != null) {
        return val;
    }
    if (type == "getdata") {
        WriteUseLog("API-GETDATA", null, a);
        return (fs[a] == null ? null : fs[a].read());
    }
    if (type == "setdata") {
        WriteUseLog("API-SETDATA", null, `${a}=>${b}`);
        return JSON.stringify((fs[a] == null ? false : fs[a].write(b)));
    }
    if (type == "reloaddata") {
        WriteUseLog("API-RElOADDATA", null, a);
        return JSON.stringify((fs[a] == null ? false : fs[a].reload()));
    }
    if (type == "getkeys") {
        WriteUseLog("API-GETKEYS", null, "");
        return JSON.stringify(Object.keys(fs));
    }
    if (type == "getlangdata") {
        WriteUseLog("API-GETLANGDATA", null, a);
        return (tmp.language[a] == null ? null : tmp.language[a].read());
    }
    if (type == "setlangdata") {
        WriteUseLog("API-SETLANGDATA", null, `${a}=>${b}`);
        return JSON.stringify((tmp.language[a] == null ? null : tmp.language[a].write(b)));
    }
    if (type == "getlangkeys") {
        WriteUseLog("API-GETLANGKEYS", null, "");
        return JSON.stringify(Object.keys(tmp.language));
    }
    if (type == "reloadlangdata") {
        WriteUseLog("API-RELOADLANGDATA", null, a);
        return JSON.stringify((tmp.language[a] == null ? false : tmp.language[a].reload()));
    }
}

//导出API
function exportinfo(type, a, b, c, d) {
    if (type == 'getmoney') {
        WriteUseLog("API-GETMONEY", null, a);
        return getmoney(a);
    }
    if (type == 'setmoney') {
        WriteUseLog("API-SETMONEY", null, `${a}=>${b}`);
        return setmoney(a, b);
    }
    if (type == 'tranmoney') {
        WriteUseLog("API-TRANMONEY", null, `${a}=>${b}(${c})[${d}]`);
        return tranmoney(a, b, c, d);
    }
    if (type == 'moneytype') {
        WriteUseLog("API-GETMONEYTYPE", null, "");
        return fs.TMET.get("Money")["MoneyType"];
    }
    if (type == 'version') {
        WriteUseLog("API-GETVERSION", null, "");
        return version;
    }
    if (type == 'moneyname') {
        WriteUseLog("API-GETMONEYNAME", null, "");
        return fs.TMET.get("Money")["MoneyName"];
    }
    if (type == "getpaytax") {
        WriteUseLog("API-GETPAYTAX", null, "");
        return getPayTax();
    }
}

//load总成
function load() {
    try {
        (() => {
            let major = Math.floor(version),
                minor = Number(version.toString().split(".")[1]), revision = 0,
                other = {
                    "完整版本": version.toString(),
                    "作者": "提米吖",
                    "开源地址": "https://gitee.com/timidine/mcbe-lite-xloader-tmessential"
                };
            ll.registerPlugin("TMEssential.js", "新时代多功能基础插件",
                { "major": major, "minor": minor, "revision": revision }, other);
        })();
        let LVEROBJ = ll.version(),
            llVER = `${LVEROBJ.major}.${LVEROBJ.minor}.${LVEROBJ.revision}${(LVEROBJ.isBeta ? "Beta" : "")}`,
            LoaderInfo = (!ISNJS ? `LLScriptEngine${llVER}` : `NJS(NetJSR or PFJSR?)`);
        logger.info("\033[1;33m",
            String.raw`
  ________  _________                     __  _       __
 /_  __/  |/  / ____/____________  ____  / /_(_)___ _/ /
  / / / /|_/ / __/ / ___/ ___/ _ \/ __ \/ __/ / __ '/ / 
 / / / /  / / /___(__  |__  )  __/ / / / /_/ / /_/ / /  
/_/ /_/  /_/_____/____/____/\___/_/ /_/\__/_/\__,_/_/   
`, `
${'\033'}[4;33;45m===TMEssential is distributed under the GPLv3 License===${'\033'}[0m${'\033'}[1m`, `
      ${'\033'}[4;36;45m=====Runing in ${LoaderInfo}=====${'\033'}[0m${'\033'}[1m`);
        file.mkdir('.\\plugins\\Timiya\\config');
        file.mkdir('.\\plugins\\Timiya\\data');
        file.mkdir('.\\plugins\\Timiya\\lang');
        logger.setTitle('TMEssential');
        logger.setLogLevel(4);
        tmp["language"] = {};
        fs["TMET"] = TMdata.openConfig('.\\plugins\\Timiya\\config\\TMEssential.json', 'json', JSON.stringify(configExample));
        if (UpdateConfig()) {
            LANGUAGEload();
            if (ISNJS) {
                logger.info("Due to NJS defects, the SHOP module must be forced to close, and MoneyType has been automatically switched to score mode!");
                let MoneyConf = fs.TMET.get("Money");
                MoneyConf.MoneyType = "score";
                fs.TMET.set("Money", MoneyConf);
            }
            if (fs.TMET.get("Enable")) {
                if (fs.TMET.get("Debug")) {
                    logger.setLogLevel(5);
                    logger.setFile('.\\logs\\TMETDebug.log', 5);
                    logger.debug('Debug mode is on');
                }
                if (fs.TMET.get("Money")["Enable"]) {
                    logger.debug('Start load Money');
                    Moneyload();
                }
                if (fs.TMET.get("TPA")["Enable"]) {
                    logger.debug("Start load TPA");
                    TPAload();
                }
                if (fs.TMET.get("WARP")["Enable"]) {
                    logger.debug("Start load WARP");
                    WARPload();
                }
                if (fs.TMET.get("HOME")["Enable"]) {
                    logger.debug("Start load HOME");
                    HOMEload();
                }
                if (fs.TMET.get("BACK")["Enable"]) {
                    logger.debug("Start load BACK");
                    BACKload();
                }
                if (fs.TMET.get("NOTICE")["Enable"]) {
                    logger.debug("Start load Notice");
                    NOTICEload();
                }
                if (fs.TMET.get("SHOP")["Enable"] && !ISNJS) {
                    logger.debug("Start load Shop");
                    Shopload();
                }
                if (fs.TMET.get("DYNAMICMOTD")["Enable"]) {
                    logger.debug("Start load DynamicMotd");
                    DynamicMotdload();
                }
                if (fs.TMET.get("TPR")["Enable"]) {
                    logger.debug("Start load TPR");
                    TPRload();
                }
                if (fs.TMET.get("ReloadChuck")["Enable"]) {
                    logger.debug("Start load ReloadChuck");
                    RELOADCHUCKload();
                }
                if (fs.TMET.get("FarmLandProtect")["Enable"]) {
                    logger.debug("Start load FarmLandProtect");
                    FARMLANDPROTECTload();
                }
            }
            TMCmd.regConsoleCmd('TMETReread', GL("default", "load", 0), function (cmd) {
                let i = 0,
                    k = Object.keys(fs),
                    l = k.length;
                while (i < l) {
                    fs[k[i]].reload();
                    logger.debug("File: ", "" + k[i] + "", " Reread success");
                    i++;
                }
                if (tmp.language != null) {
                    i = 0,
                        k = Object.keys(tmp.language),
                        l = k.length;
                    while (i < l) {
                        tmp.language[k[i]].reload();
                        logger.debug("LangPack File: ", "" + k[i] + "", " Reread success");
                        i++;
                    }
                }
                if (ISNJS) {
                    let MoneyConf = fs.TMET.get("Money");
                    MoneyConf.MoneyType = "score";
                    fs.TMET.set("Money", MoneyConf);
                    logger.info("MoneyType has been automatically switched to score mode!");
                }
                mc.sendCmdOutput("Operation complete!");
            });
            TMLS.listen("onJoin", (pl) => {
                // ST(pl, "§a[临时祝福] §b新年快乐！");
                // ST(pl, "§bHappy new year!");
                if (fIsOP(pl.xuid) && fs.TMET.get("Debug")) {
                    logger.setPlayer(pl, 5);
                }
            });
            TMLS.listen("onConsoleOutput", (str) => {
                if (isExCmding) {
                    output = str;
                    return false;
                }
                return true;
            });
            CmdTriggerInit();//初始化命令匹配
            TickTaskInit();//初始化Tick任务
            logger.debug("根监听创建...");
            mc.listen("onPreJoin", (pl) => { return listenExample("onPreJoin", pl); });
            mc.listen("onJoin", (pl) => { return listenExample("onJoin", pl); });
            mc.listen("onLeft", (pl) => { return listenExample("onLeft", pl); });
            mc.listen("onPlayerCmd", (pl, cmdStr) => { return listenExample("onPlayerCmd", pl, cmdStr); });
            mc.listen("onConsoleCmd", (cmdStr) => { return listenExample("onConsoleCmd", cmdStr); });
            mc.listen("onPlayerDie", (pl) => { return listenExample("onPlayerDie", pl); });
            mc.listen("onRespawn", (pl) => { return listenExample("onRespawn", pl); });
            mc.listen("onMobHurt", (mob, mob2, damage) => { return listenExample("onMobHurt", mob, mob2, damage); });
            mc.listen("onScoreChanged", (pl, num, name, dis) => { return listenExample("onScoreChanged", pl, num, name, dis); });
            mc.listen("onFarmLandDecay", (pos, en) => { return listenExample("onFarmLandDecay", pos, en); });
            mc.listen("onConsoleOutput", (str) => { return listenExample("onConsoleOutput"); });
            mc.listen("onTick", () => { listenExample("onTick"); });//安全考虑，不允许拦截Tick
        }
        if (ll.export(TMETexportFunc, "TMET")) {
            logger.info("TMET API EXPORT SUCCESSFUL");
        } else {
            logger.fatal("TMET API EXPORT FATAL");
        }
        logger.info("TMEssential loaded! author by 提米吖 version: " + version + "");
        if (fs.TMET.get("AutoUpdate")) {
            if (!ISNJS) {
                setTimeout(function () {
                    AutoUpdate();
                    setInterval(function () {
                        let pus = ll.listPlugins(),
                            i = 0,
                            l = pus.length,
                            bool = false;
                        while (i < l) {
                            let pu = pus[i];
                            if (pu == 'TMETAutoUpdate.js') {
                                bool = true;
                            }
                            i++;
                        }
                        if (!bool) {
                            logger.info('AutoUpdate recovery task...');
                            AutoUpdate();
                        }
                    }, 5000);
                }, 1000);
            } else {
                NJSAutoUpdate();
            }
            logger.info('AutoUpdate Turned on');
        } else {
            logger.info('AutoUpdate Closed');
        }
        webNotice();
        WriteUseLog("Plugin", null, `Initializationed,Version:${version}`);
    } catch (e) {
        ErrorMsg(e);
    }
}
(() => {
    if (typeof (mc) == "undefined") {
        try {
            let pack = new (function () {
                let file = new class {
                    constructor() { };
                    mkdir(dir) {
                        dir = dir.replace(/\\/g, '/');
                        let dirArr = dir.split('/'),
                            nowDir = dirArr.shift(),
                            l = dirArr.length;
                        if (nowDir != ".") {
                            mkdir(nowDir);
                        }
                        for (let i = 0; i < l; i++) {
                            nowDir += `/${dirArr.shift()}`;
                            mkdir(nowDir);
                        }
                        return true;
                    };
                    createDir(dir) {
                        return this.mkdir(dir);
                    }
                    readFrom(path) {
                        return fileReadAllText(path);
                    };
                    writeTo(path, str) {
                        return fileWriteAllText(path, str);
                    };
                    getFilesList(dir) {
                        dir = dir.replace(/\\/g, '/');
                        systemCmd("cd " + dir + " && dir /b >> " + getWorkingPath() + "/files.txt", (e) => { });
                        new logger("NJS-DIRREAD").info("Please wait...");
                        let txts = fileReadAllText(getWorkingPath() + "/files.txt");
                        while (txts == null) {
                            txts = fileReadAllText(getWorkingPath() + "/files.txt");
                        }
                        this.delete('files.txt');
                        let arr = txts.split('\r\n');
                        arr.pop();
                        return arr;
                    };
                    exists(dirOrpath) {
                        return (fileExists(dirOrpath) || dirExists(dirOrpath));
                    };
                    checkIsDir(pd) {
                        return dirExists(pd);
                    };
                    delete(pd) {
                        return systemCmd("del " + pd + "", (e) => { });
                    };
                    writeLine(path, str) {
                        return fileWriteLine(path, str);
                    }
                }(), ini = new class {
                    constructor() { };//空构造函数
                    parse(str) {
                        if (typeof (str) != "string") { throw new Error("The passed parameter must be a string!"); }
                        let lines = str.replace(/\r\n/, "\n").replace(/\r/, "\n").split("\n"),
                            l = lines.length, i = 0, res = {}, nowel = "";
                        while (i < l) {
                            let lstr = lines[i++].trim(),
                                fh = lstr.indexOf(";");
                            if (fh != -1) { lstr = lstr.substring(0, fh).trim(); }//除注去释
                            if (lstr[0] == ";") { continue; }//跳过注释
                            if (lstr[0] == "[") {
                                let end = lstr.indexOf("]");
                                if (end == -1) { throw new Error("No closing statement!"); }
                                let cl = lstr.substring(1, end);
                                res[cl] = {};
                                nowel = cl;
                            } else {
                                let [key, value] = lstr.split("=", 2);
                                if (key != "") {
                                    res[nowel][key] = value;
                                }
                            }
                        }
                        return res;
                    };
                    stringify(obj) {
                        if (Object.prototype.toString.call(obj) != '[object Object]') {
                            throw new Error("The parameter must be an object!");
                        }
                        let els = Object.keys(obj), l = els.length, i = 0, nowel = "", strArr = [];
                        while (i < l) {
                            let el = els[i++];
                            if (Object.prototype.toString.call(obj[el]) != '[object Object]') {
                                strArr.push(`[${nowel}]`);
                                strArr.push(`${el}=${obj[el]}`);
                            } else {
                                strArr.push(`[${el}]`);
                                nowel = el;
                                let keys = Object.keys(obj[el]), l = keys.length, i = 0;
                                while (i < l) {
                                    let [key, value] = [keys[i], obj[nowel][keys[i]]];
                                    strArr.push(`${key}=${value}`);
                                    i++;
                                }
                            }
                        }
                        return strArr.join("\n");
                    };
                }(), newJsonConfig = (path, defaultt = "") => {
                    if (typeof (path) !== "string") {
                        throw new Error("Path should be a string!!!");
                    } else if (typeof (defaultt) != "string") {
                        throw new Error("Default should be a string!!!");
                    } else {
                        let jsontmp = JSON.parse(defaultt), Tpath = path.replace(/[/]/g, '\\'), newData = file.readFrom(path), TMParr = Tpath.split('\\');
                        TMParr.pop();
                        let dir = TMParr.join('\\');
                        if (newData == null) {
                            file.mkdir(dir);
                            newData = JSON.stringify(jsontmp, null, 2);
                            file.writeTo(path, newData);
                        }
                        return new function (data, path, dir) {
                            let time = Date.now(),
                                nowOBJ = null, saveTask = false;//使用缓存
                            function getOBJ() {
                                let Time = Date.now();
                                if ((Time - time) >= 1000 || nowOBJ == null) {
                                    nowOBJ = JSON.parse(data);
                                    time = Time;
                                }
                                return nowOBJ;/*删除 DeepCopy*/
                            }
                            function setOBJ(da) {
                                nowOBJ = da;
                                asyncSave();
                                return true;
                            }
                            function asyncSave() {
                                if (!saveTask) {
                                    saveTask = true;
                                    let Tpath = path.replace(/[/]/g, '\\'),
                                        Path = path;
                                    postTick(function () {
                                        data = JSON.stringify(nowOBJ, null, 2);
                                        let TMParr = Tpath.split('\\');
                                        TMParr.pop();
                                        let dir = TMParr.join('\\');
                                        file.mkdir(dir);
                                        file.writeTo(Path, data);
                                        saveTask = false;
                                    });
                                }
                            }
                            this.asyncSave = asyncSave;
                            this.init = function (name, defaul) {
                                let Data = getOBJ();
                                if (Data[name] == null) {
                                    Data[name] = defaul;
                                    setOBJ(Data);
                                    return defaul;
                                } else {
                                    return Data[name];
                                }
                            };
                            this.set = function (name, aata) {
                                let Data = getOBJ();
                                Data[name] = aata;
                                setOBJ(Data);
                                return true;
                            };
                            this.get = function (name, defaul = null) {
                                let Data = getOBJ();
                                if (Data[name] == null) {
                                    return defaul;
                                } else {
                                    return Data[name];
                                }
                            };
                            this.delete = function (name) {
                                let Data = getOBJ();
                                delete Data[name];
                                setOBJ(Data);
                                return true;
                            };
                            this.reload = function () {
                                file.mkdir(dir);
                                let newData = file.readFrom(path);
                                data = newData;
                                time -= 8000;
                                return true;
                            };
                            this.close = function () {
                                let ks = Object.keys(this),
                                    i = 0, l = ks.length;
                                while (i < l) {
                                    delete this[ks[i]];
                                    i++;
                                }
                                return true;
                            };
                            this.getPath = function () {
                                return path;
                            };
                            this.read = function () {
                                return JSON.stringify(getOBJ(), null, 2);
                            };
                            this.write = function (content) {
                                if (typeof (content) == "string") {
                                    file.mkdir(dir);
                                    file.writeTo(path, content);
                                    data = content;
                                    time -= 8000;
                                    return true;
                                } else {
                                    throw new Error("content should be a string!!!");
                                }
                            };
                        }(newData, path, dir);
                    }
                }, newINIConfig = (path, defaultt = "") => {
                    if (typeof (path) !== "string") {
                        throw new Error("Path should be a string!!!");
                    } else if (typeof (defaultt) != "string") {
                        throw new Error("Default should be a string!!!");
                    } else {
                        let jsontmp = ini.parse(defaultt),
                            Tpath = path.replace(/[/]/g, '\\'),
                            newData = file.readFrom(path),
                            TMParr = Tpath.split('\\');
                        TMParr.pop();
                        let dir = TMParr.join('\\');
                        if (newData == null) {
                            file.mkdir(dir);
                            newData = ini.stringify(jsontmp);
                            file.writeTo(path, newData);
                        }
                        return new function (data, path, dir) {
                            this.asyncSave = function () {
                                let Tpath = path.replace(/[/]/g, '\\');
                                postTick(function () {
                                    let TMParr = Tpath.split('\\');
                                    TMParr.pop();
                                    let dir = TMParr.join('\\');
                                    file.mkdir(dir);
                                    file.writeTo(path, data);
                                });
                            };
                            this.init = function (sec, name, defaul) {
                                let Data = ini.parse(data);
                                if (Data[sec] == null || Data[sec][name] == null) {
                                    if (Data[sec] == null) {
                                        Data[sec] = {};
                                    }
                                    Data[sec][name] = defaul;
                                    data = ini.stringify(Data);
                                    this.asyncSave();
                                    return defaul;
                                } else {
                                    return Data[sec][name];
                                }
                            };
                            this.set = function (sec, name, aata) {
                                let Data = ini.parse(data);
                                if (Data[sec] == null) {
                                    Data[sec] = {};
                                }
                                Data[sec][name] = aata;
                                data = ini.stringify(data);
                                this.asyncSave();
                                return true;
                            };
                            this.get = function (sec, name, defaul = null) {
                                let Data = ini.parse(data);
                                if (Data[sec] == null || Data[sec][name] == null) {
                                    return defaul;
                                } else {
                                    return Data[sec][name];
                                }
                            };
                            this.getStr = function (sec, name, defaul = 0) {
                                return this.get(sec, name, defaul);
                            };
                            this.getInt = function (sec, name, defaul = 0) {
                                let res = this.get(sec, name, null);
                                if (res == null) {
                                    return defaul;
                                } else {
                                    return parseInt(res);
                                }
                            };
                            this.getFloat = function (sec, name, defaul = 0) {
                                let res = this.get(sec, name, null);
                                if (res == null) {
                                    return defaul;
                                } else {
                                    return parseFloat(res);
                                }
                            };
                            this.getBool = function (sec, name, defaul = 0) {
                                let res = this.get(sec, name, null);
                                if (res == null) {
                                    return defaul;
                                } else {
                                    try {
                                        return Boolean(JSON.parse(res));
                                    } catch (_) { return defaul; }
                                }
                            }
                            this.delete = function (sec, name) {
                                let Data = ini.parse(data);
                                if (Data[sec] != null) {
                                    delete Data[sec][name];
                                    data = ini.stringify(Data);
                                    this.asyncSave();
                                    return true;
                                } else {
                                    return false;
                                }
                            };
                            this.reload = function () {
                                file.mkdir(dir);
                                let newData = file.readFrom(path);
                                data = newData;
                                return true;
                            };
                            this.close = function () {
                                let ks = Object.keys(this),
                                    i = 0,
                                    l = ks.length;
                                while (i < l) {
                                    delete this[ks[i]];
                                    i++;
                                }
                                return true;
                            };
                            this.getPath = function () {
                                return path;
                            };
                            this.read = function () {
                                return data;
                            };
                            this.write = function (content) {
                                if (typeof (content) == "string") {
                                    file.mkdir(dir);
                                    file.writeTo(path, content);
                                    data = content;
                                    return true;
                                } else {
                                    throw new Error("content should be a string!!!");
                                }
                            };
                        }(newData, path, dir);
                    }
                }, FormBulider = {
                    "simpleForm": class {
                        constructor() {
                            this.type = "form";
                            this.title = "";
                            this.content = "";
                            this.buttons = [];
                        };
                        setTitle(text) {
                            this.title = text;
                            return true;
                        };
                        setContent(text) {
                            this.content = text;
                            return true;
                        };
                        addButton(title, image = "") {
                            let obj = {
                                "text": title
                            };
                            if (image != "") {
                                obj.image = {};
                                if (image.indexOf(":") != -1) {
                                    obj.image.type = "url";
                                } else { obj.image.type = "path" }
                                obj.image.data = image;
                            }
                            this.buttons.push(obj);
                            return true;
                        }
                    },
                    "customForm": class {
                        constructor() {
                            this.type = "custom_form";
                            this.title = "";
                            this.content = [];
                        };
                        setTitle(text) {
                            this.title = text;
                            return true;
                        };
                        addLabel(text) {
                            let obj = {
                                "type": "label",
                                "text": text
                            };
                            this.content.push(obj);
                            return true;
                        };
                        addInput(title, placeholder = "", defau = "") {
                            let obj = {
                                "type": "input",
                                "text": title,
                                placeholder,
                                "default": defau
                            };
                            this.content.push(obj);
                            return true;
                        };
                        addSwitch(title, defau = false) {
                            let obj = {
                                "type": "toggle",
                                "text": title,
                                "default": defau
                            };
                            this.content.push(obj);
                            return true;
                        };
                        addDropdown(title, items, defau = 0) {
                            let obj = {
                                "type": "dropdown",
                                "text": title,
                                "options": items,
                                "default": defau
                            };
                            this.content.push(obj);
                            return true;
                        };
                        addSlider(title, min, max, step = 0, defau = 0) {
                            let obj = {
                                "type": "slider",
                                "text": title,
                                min, max, step,
                                "default": defau
                            };
                            this.content.push(obj);
                            return true;
                        };
                        addStepSlider(title, items, defau) {
                            let obj = {
                                "type": "step_slider",
                                "text": title,
                                "steps": items,
                                "default": defau
                            };
                            this.content.push(obj);
                            return true;
                        }
                    }
                }, newPlayer = (xuid) => {
                    let pls = JSON.parse(getOnLinePlayers() == "" ? "[]" : getOnLinePlayers()),
                        l = pls.length, i = 0, plIn = null;
                    while (i < l) {
                        let plInfo = pls[i];
                        if (plInfo.xuid == xuid || plInfo.playername == xuid) {
                            plIn = JSON.parse(selectPlayer(plInfo.uuid));
                            break;
                        }
                        i++;
                    }
                    if (plIn != null) {
                        return new class {
                            constructor(plIn) {
                                this.plInfo = plIn;
                            };
                            get xuid() {
                                return this.plInfo.xuid;
                            };
                            get uuid() {
                                return this.plInfo.uuid;
                            };
                            get name() {
                                return this.plInfo.playername;
                            };
                            get pos() {
                                let selPl = JSON.parse(selectPlayer(this.plInfo.uuid));
                                selPl.XYZ.dim = selPl.dimension;
                                selPl.XYZ.dimid = selPl.dimensionid;
                                return selPl.XYZ;
                            };
                            get realName() {
                                let datas = JSON.parse(PlayerXuid.read()),
                                    keys = Object.keys(datas),
                                    l = keys.length, i = 0;
                                while (i < l) {
                                    let name = keys[i++];
                                    if (datas[name] == this.xuid) {
                                        return name;
                                    }
                                }
                                return "";
                            };
                            get inAir() {
                                let plSel = JSON.parse(selectPlayer(this.plInfo.uuid));
                                return !plSel.isstand;
                            };
                            get maxHealth() {
                                let plSel = JSON.parse(selectPlayer(this.plInfo.uuid));
                                return (plSel.health > 20 ? plSel.health : 20);
                            };
                            get health() {
                                let plSel = JSON.parse(selectPlayer(this.plInfo.uuid));
                                return plSel.health;
                            };
                            isOP() {
                                let perms = JSON.parse(file.readFrom(".\\permissions.json")),
                                    i = 0, l = perms.length;
                                while (i < l) {
                                    let plPerm = perms[i++];
                                    if (Object.prototype.toString.call(plPerm) != '[object Object]') { continue; }
                                    if (plPerm.xuid == this.plInfo.xuid) {
                                        if (plPerm.permission == "operator") {
                                            return true;
                                        } else {
                                            return false;
                                        }
                                    }
                                }
                                return false;
                            };
                            kick(msg = "") {
                                return disconnectClient(this.plInfo.uuid, msg);
                            }
                            disconnect(msg = "") {
                                return this.kick(msg);
                            };
                            tell(msg, type = 0) {
                                switch (type) {
                                    case 0:
                                        sendText(this.plInfo.uuid, msg);
                                        break;
                                    case 1:
                                        sendText(this.plInfo.uuid, `<Server> ${msg}`);
                                        break;
                                    case 3: case 4: case 5:
                                        runcmd("title \"" + this.name + "\" actionbar " + msg + "");
                                        break;
                                    default:
                                        sendText(this.plInfo.uuid, msg);
                                        break;
                                }
                                return true;
                            };
                            sendText(msg, type = 0) {
                                return this.tell(msg, type);
                            };
                            runcmd(cmd) {
                                return runcmdAs(this.plInfo.uuid, cmd);
                            };
                            talkAs(text) {
                                return talkAs(this.plInfo.uuid, text);
                            };
                            teleport(posorx, y = null, z = null, dimid = null) {
                                let x = null;
                                if (typeof (posorx) == "object") {
                                    x = posorx.x; y = posorx.y; z = posorx.z;
                                    dimid = posorx.dimid;
                                }
                                runcmd(`tpdim "${this.plInfo.name}" ${dimid} ${x} ${y} ${z}`);
                            };
                            kill() {
                                return runcmd(`kill "${this.plInfo.name}"`);
                            };
                            carsh() {
                                return this.kick();
                            };
                            setScore(name, value) {
                                return setscoreboard(this.plInfo.uuid, name, value);
                            };
                            getScore(name) {
                                return getscoreboard(this.plInfo.uuid, name);
                            };
                            reduceScore(name, value) {
                                return this.setScore(name, (this.getScore(name) - value));
                            };
                            deleteScore(name) {
                                return runcmd(`scoreborad players reset "${this.plInfo.name}" ${name}`);
                            };
                            sendForm(form, func) {
                                let id = sendCustomForm(this.plInfo.uuid, JSON.stringify(form));
                                formFunc[id] = (je) => {
                                    let pl = newPlayer(je.playername), sel = JSON.parse(je.selected);
                                    func(pl, sel);
                                };
                                return (id != -1);
                            };
                            sendModalForm(title, content, button1, button2, func) {
                                let id = sendModalForm(this.plInfo.uuid, title, content, button1, button2);
                                formFunc[id] = (je) => {
                                    let pl = newPlayer(je.playername),
                                        sel = JSON.parse(je.selected);
                                    func(pl, sel);
                                };
                                return (id != -1);
                            };
                            sendSimpleForm(title, content, buttons, images, func) {
                                let nf = new FormBulider.simpleForm(),
                                    l = buttons.length, i = 0;
                                nf.setTitle(title);
                                nf.setContent(content);
                                while (i < l) {
                                    let [button, image] = [buttons[i], images[i++]];
                                    nf.addButton(button, image);
                                }
                                return this.sendForm(nf, func);
                            };
                            sendCustomForm(json, func) {
                                let id = sendCustomForm(this.uuid, json);
                                formFunc[id] = (je) => {
                                    let [pl, sel] = [newPlayer(je.playername), JSON.parse(je.selected)];
                                    func(pl, sel);
                                };
                                return (id != -1);
                            }
                        }(plIn);
                    } else {
                        return null;
                    }
                }, getColor = (...arrs) => {
                    return "\033[" + arrs.join(";") + "m";
                }, logger = class {
                    constructor(title = "", level = 4) {
                        this._Title = title;
                        this._Console = { "level": level, "Enable": true };
                        this._File = { "level": level, "path": "" };
                        this._Player = { "level": level, "xuid": "" };
                        this._getDate = () => {
                            // let ndate = new Date(), year = ndate.getFullYear(),
                            //     hours = ndate.getHours(), date = ndate.getDate();
                            return TimeNow().split(" ")//`${year}-${hours}-${date}`;
                        };
                        this._LogToConsole = (str, level) => {
                            if (level <= this._Console.level) {
                                return log(str);
                            } else { return false; }
                        };
                        this._LogToFile = (str, level) => {
                            if (this._File.path != "" && level <= this._File.level) {
                                return file.writeLine(this._File.path, str);
                            } else { return false; }
                        };
                        this._LogToPlayer = (str, level) => {
                            if (this._Player.xuid != "" && level <= this._Player.level) {
                                let pl = newPlayer(this._Player.xuid);
                                if (pl != null) { return pl.sendText(str, 0); }
                                else { this._Player.xuid = ""; return false; }
                            } else { return false; }
                        };
                        this._LogStr = (str, type) => {
                            let time = this._getDate(),
                                color = 37, level = 0, plColor = "",
                                No_Color_Log = `[${time} ${type}] ${(this._Title != "" ? `[${this._Title}]` : "")} ${str}`,
                                getTitleDisPlay = () => {
                                    if (this._Title != "") {
                                        return `[${this._Title}] `;
                                    } else { return ""; }
                                };
                            switch (type) {
                                case "DEBUG": level = 5; color = "35"; plColor = "§o"; break;
                                case "INFO": level = 4; color = "37"; plColor = "§f"; break;
                                case "WARN": level = 3; color = "33"; plColor = "§e"; break;
                                case "ERROR": level = 2; color = "31"; plColor = "§c"; break;
                                case "FATAL": level = 1; color = "31"; plColor = "§4"; break;
                            }
                            let ColorLog = `${getColor(38, 2, 173, 216, 230)}${time.split(" ")[1]} ${getColor(1, (type == "INFO" ? "38;2;0;170;170" : color))}${type} ${getColor(1, color)}${getTitleDisPlay()}${str}${getColor(0)}`;
                            this._LogToConsole(ColorLog, level);
                            this._LogToPlayer(`${plColor}${No_Color_Log}`, level);
                            this._LogToFile(No_Color_Log, level);
                        };
                    };
                    setTitle(title = "") {
                        this._Title = title;
                        return true;
                    };
                    setLogLevel(level = 4) {
                        this._Console.level = level;
                        this._File.level = level;
                        this._Player.level = level;
                        return true;
                    };
                    setConsole(enable, level = 4) {
                        this._Console.Enable = enable;
                        this._Console.level = level;
                        return true;
                    };
                    setFile(path, level = 4) {
                        this._File.path = path;
                        this._File.level = level;
                        return true;
                    };
                    setPlayer(pl, level = 4) {
                        if (pl != null) {
                            this._Player.xuid = pl.xuid;
                            this._Player.level = level;
                        } else { return false; }
                    }
                    log(...arr) {
                        let _LOG = arr.join("");
                        return this._LogStr(_LOG, "INFO");
                    };
                    info(...arr) {
                        let _LOG = arr.join("");
                        return this._LogStr(_LOG, "INFO");
                    };
                    debug(...arr) {
                        let _LOG = arr.join("");
                        return this._LogStr(_LOG, "DEBUG");
                    };
                    warn(...arr) {
                        let _LOG = arr.join("");
                        return this._LogStr(_LOG, "WARN");
                    };
                    error(...arr) {
                        let _LOG = arr.join("");
                        return this._LogStr(_LOG, "ERROR");
                    };
                    fatal(...arr) {
                        let _LOG = arr.join("");
                        return this._LogStr(_LOG, "FATAL");
                    };
                };
                let PlayerXuid = newJsonConfig(".\\plugins\\Timiya\\xuid.json", "{}"),
                    formFunc = {},
                    OnlinePls = {},
                    listenList = {
                        "onPreJoin": [],
                        "onJoin": [],
                        "onLeft": [],
                        "onPlayerCmd": [],
                        "onPlayerDie": [],
                        "onRespawn": [],
                        "onMobHurt": [],
                        "onScoreChanged": [],
                        "onConsoleCmd": [],
                        "onConsoleOutput": [],
                        "onFarmLandDecay": [],
                        "onTick": []
                    };
                function listenT(...arrs) {
                    let listen = arrs.shift(),
                        bool = true, listens = listenList[listen];
                    if (listens != null) {
                        for (let i = 0; i < listens.length; i++) {
                            let bo = true;
                            try {
                                bo = listens[i](...arrs);
                            } catch (e) {
                                ErrorMsg(e);
                            }
                            if (bool && bo == false) {
                                bool = false;
                            }
                        }
                        return bool;
                    }
                }
                (() => {
                    let ScoreId = {},
                        scoreTask = {};
                    addBeforeActListener("onFormSelect", (e) => {
                        let je = JSON.parse(e);
                        if (typeof (formFunc[je.formid]) == "function") {
                            formFunc[je.formid](je);
                        }
                    });
                    addBeforeActListener("onLoadName", (e) => {
                        let je = JSON.parse(e);
                        PlayerXuid.set(je.playername, je.xuid);
                        OnlinePls[je.playername] = false;
                        listenT("onPreJoin", newPlayer(je.xuid));
                    });
                    addBeforeActListener("onRespawn", (e) => {
                        let je = JSON.parse(e),
                            pl = newPlayer(je.playername);
                        if (!OnlinePls[je.playername]) {
                            let score = Math.floor(Math.random() * 114514);
                            scoreTask[score] = je.playername;
                            pl.setScore("NJSTEST", score);
                        }
                        listenT("onRespawn", pl);
                    });
                    addBeforeActListener("onPlayerLeft", (e) => {
                        let je = JSON.parse(e);
                        delete OnlinePls[je.playername];
                        listenT("onLeft", newPlayer(je.playername));
                    });
                    addBeforeActListener("onScoreChanged", (e) => {
                        let je = JSON.parse(e);
                        if (je.objectivename == "NJSTEST" && scoreTask[je.score] != null) {
                            let pl = newPlayer(scoreTask[je.score]);
                            delete scoreTask[je.score];
                            ScoreId[je.scoreboardid] = pl.name;
                            OnlinePls[pl.realName] = true;
                            setTimeout(() => {
                                let plT = newPlayer(ScoreId[je.scoreboardid]);
                                if (plT != null) { listenT("onJoin", pl); }
                            }, 4000);
                        } else {
                            let pl = newPlayer(ScoreId[je.scoreboardid]);
                            if (pl != null) {
                                return listenT("onScoreChanged", pl, je.score, je.objectivename, je.displayname);
                            }
                        }
                    });
                    addBeforeActListener("onInputCommand", (e) => {
                        let je = JSON.parse(e),
                            pl = newPlayer(je.playername);
                        return listenT("onPlayerCmd", pl, je.cmd);
                    });
                    addBeforeActListener("onServerCmd", (e) => {
                        let je = JSON.parse(e);
                        return listenT("onConsoleCmd", je.cmd);
                    });
                    addBeforeActListener("onServerCmdOutput", (e) => {
                        let je = JSON.parse(e);
                        return listenT("onConsoleOutput", je.output);
                    });
                    addBeforeActListener("onMobDie", (e) => {
                        let je = JSON.parse(e);
                        if (je.playername != null) {
                            listenT("onPlayerDie", newPlayer(je.playername));
                        }
                    });
                    function tick() {
                        postTick(() => {
                            tick();
                            listenT("onTick");
                        });
                    }
                    tick();
                    setTimeout(() => {//OnLine
                        let pls = JSON.parse(getOnLinePlayers() == "" ? "[]" : getOnLinePlayers()),
                            l = pls.length, i = 0;
                        while (i < l) {
                            let pl = newPlayer(pls[i].xuid);
                            PlayerXuid.set(pl.realName, pl.xuid);
                            //preJoin
                            listenT("onPreJoin", pl);
                            //join
                            let score = Math.floor(Math.random() * 114514);
                            scoreTask[score] = pl.name;
                            pl.setScore("NJSTEST", score);
                            i++;
                        }
                    }, 10);
                })();
                this.FloatPos = (x, y, z, dimid) => {
                    this.x = x;
                    this.y = y;
                    this.z = z;
                    this.dimid = dimid;
                    this.dim = ["未知", "主世界", "地狱", "末地"][([0, 1, 2].indexOf(dimid) + 1)];
                };
                this.IntPos = this.FloatPos;
                this.logger = new logger();
                this.data = new function () {
                    this.openConfig = (path, type, defau) => {
                        return [() => { return null; }, newJsonConfig, newINIConfig][(["json", "ini"].indexOf(type) + 1)](path, defau);
                    };
                    this.xuid2name = (xuid) => {
                        let datas = JSON.parse(PlayerXuid.read()),
                            keys = Object.keys(datas),
                            l = keys.length, i = 0;
                        while (i < l) {
                            let name = keys[i];
                            if (datas[name] == xuid) {
                                return name;
                            }
                            i++;
                        }
                        return "";
                    };
                    this.name2xuid = (name) => {
                        return (PlayerXuid.get(name) || "");
                    };
                }();
                this.File = file;
                this.file = file;
                this.ll = new function () {
                    this.version = () => {
                        return { "major": 0, "minor": 2, "revision": 3, "isBeta": true }
                    };
                    this.export = (func, name) => {
                        setShareData(name, func);
                        return true;
                    };
                    this.registerPlugin = (...args) => {
                        return true;
                    }
                }();
                this.system = new function () {
                    this.randomGuid = () => {
                        function S4() {
                            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
                        }
                        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
                    };
                    this.getTimeObj = () => {
                        let time = TimeNow(),
                            cut = time.split(" "),
                            date = cut[0].split("-"),
                            Y = date[0], M = date[1], D = date[2],
                            tim = cut[1].split(":"),
                            h = tim[0], m = tim[1], s = tim[2], ms = new Date().getMilliseconds();
                        return { "Y": Y, "M": M, "D": D, "h": h, "m": m, "s": s, "ms": ms };
                    };
                    this.getTimeStr = () => {
                        return TimeNow();
                    };
                }();
                this.mc = new function () {
                    this.listen = (listen, func) => {
                        if (listenList[listen] == null) {
                            return false;
                        } else {
                            listenList[listen].push(func);
                            return true;
                        }
                    };
                    this.getPlayer = (xn) => {
                        return newPlayer(xn);
                    };
                    this.getOnlinePlayers = () => {
                        let keys = Object.keys(OnlinePls),
                            l = keys.length, i = 0, arr = [];
                        while (i < l) {
                            let key = keys[i++];
                            if (OnlinePls[key]) {
                                arr.push(newPlayer(key));
                            }
                        }
                        return arr;
                    }
                    this.newSimpleForm = () => {
                        return new FormBulider.simpleForm();
                    };
                    this.newCustomForm = () => {
                        return new FormBulider.customForm();
                    };
                    this.runcmd = runcmd;
                    this.runcmdEx = (cmd) => {
                        runcmd(cmd);
                        return { "success": true, "output": "" };
                    };
                    this.setCmdDescribe = (cmd, descr, perm) => {
                        if (perm != 4) {
                            setCommandDescribe(cmd, descr);
                        }
                        return true;
                    }
                    this.setMotd = (motd, boo) => {
                        return setServerMotd(motd, boo);
                    };
                    this.sendCmdOutput = (output) => {
                        logout(output);
                        return true;
                    };
                }();
                this.network = new function () {
                    this.httpGet = (url, callback) => {
                        request(url, 'GET', '', function (e) {
                            callback((e == null ? -1 : 200), e);
                            return;
                        });
                    };
                    this.httpPost = (url, dataStr, type, callback) => {
                        request("" + url + "/" + type + "", 'POST', dataStr, (e) => {
                            callback((e == null ? -1 : 200), e);
                        });
                    };
                }();
            })();
            globalThis.mc = pack.mc;
            globalThis.FloatPos = pack.FloatPos;
            globalThis.ll = pack.ll;
            globalThis.file = pack.file;
            globalThis.data = pack.data;
            globalThis.logger = pack.logger;
            globalThis.system = pack.system;
            globalThis.network = pack.network;
            ISNJS = true;
        } catch (_) { }
    }
})();
load();