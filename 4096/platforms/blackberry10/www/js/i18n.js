var i18n = {regx: /`([\w\d\s.-]*?)`/gi, process: function(e, r) {
        for (var n = e.querySelectorAll("[i18n=true]"), t = 0; t < n.length; t++) {
            for (var i = n[t], a = i18n.getAllPropsOf(i), l = a[0], g = 0; g < l.length; g++) {
                for (var o = l[g], u = o.v, c = i18n.regx.exec(u); c; )
                    u = i18n.replace(u, c[1], r), console.log("[i18n]>>" + JSON.stringify(o) + ">>" + u), c = i18n.regx.exec(u);
                i[o.p] = u
            }
            for (var s = a[1], g = 0; g < s.length; g++) {
                for (var o = s[g], u = o.v, c = i18n.regx.exec(u); c; )
                    u = i18n.replace(u, c[1], r), console.log("[i18n]>>" + JSON.stringify(o) + ">>" + u), c = i18n.regx.exec(u);
                i.setAttribute([o.a], u)
            }
        }
    }, replace: function(e, r, n) {
        var t = i18n.get(r, n), i = new RegExp("`" + r + "`", "ig");
        return e.replace(i, t)
    }, get: function(e, r) {
        try {
            var n = qstr[r][e];
            return n ? n : "[" + e + "]"
        } catch (t) {
            return n = qstr[qstr.default][e], n ? n : "[" + e + "]"
        }
    }, getAllPropsOf: function(e) {
        var r = [];
        e.innerHTML && e.innerHTML.length > 2 && r.push({p: "innerHTML", v: e.innerHTML});
        var n = [];
        if (e.attributes)
            for (var t = 0; t < e.attributes.length; t++) {
                var i = e.attributes[t];
                i.value.length > 3 && n.push({a: i.name, v: i.value})
            }
        return[r, n]
    }};
var qstr = {
    default: "en-US",
    "zh-CN": {
        "intro": '合并方块，直到出现<strong>4096</strong>！',
        'keepgoing': '继续玩',
        'tryagain': '重新开始',
        'share': '分享得分',
        'expl': ' <strong class="important">如何操作:</strong><br>上下左右滑动你的<strong>手指</strong>来移动方块.当两个有相同数字的方块碰撞时，就会<strong>合并成一个方块</strong>。',
        'About': '关于',
        'Rate': '评分',
        'Settings': '设置',
        'win': '你赢了',
        'over': '游戏结束',
        'howtoplay': "游戏说明",
        'keyboard': '也可以使用键盘上的WASD键来控制移动，使用R键来重新开始游戏，使用Z键来进行撤销。',
        'dev': '开发人员',
        'test': '<b>内测小组</b>',
        'visualsettings': '主题设置',
        'dark': '主题选择',
        'back': '返回',
        'donate': '如果你喜欢这个游戏，请通过支付宝或者paypal捐赠以支持我的开发，账号均为anphorea@gmail.com，谢谢！',
        'sound': "音效设置",
        'usesound': '启用音效',
        'author': '移植自 https://github.com/gabrielecirulli/2048 ,由 Gabriele Cirulli 创建。基于 Veewo Studio 的1024和Asher Vollmer的Threes。',
        'mute': '静音',
        '_mute': '启用',
        '_reset': "重新开始",
        'status': '撤销功能状态: ',
        'checking': "正在检查...",
        'unlock': '解锁撤销功能',
        'refresh': '刷新支付状态',
        'UNDO_OK': "已解锁",
        "UNDO_ERROR": "未解锁",
        'Undo': '撤销',
        'needpurchase': "请前往设置界面解锁此功能",
        'promo': "我有解锁码",
        'promotext': '您可通过支付宝向anphorea@gmail.com支付5元（备注你的KEY）来获取解锁码。如果你已经获得了解锁码，请在此输入。你的加密KEY是：',
        'unlocktitle': '使用解锁码解锁',
        'promoerr': '解锁码无效',
        'promosuccess': '解锁成功',
        'showcode': '显示解锁码',
        'okbtn': "确定",
        'urcodeis': "您的解锁码是 : ",
        'restart': '重新开始游戏？',
        'confirm': '请确认',
        'keepplaying': '继续游戏？',
        'bbm_not_connected': 'BBM尚未连接。请前往应用程序权限菜单授权本应用访问BBM，然后重新启动应用。',
        'restart_required': '您可在这里选择要使用的主题。',
        'sound_tips': '你可以在这里启用或者禁用游戏音效，也可以通过游戏下滑菜单进行控制。',
        'undo_tips': '撤销功能可以让你撤回最近的50步操作，直到游戏的初始状态。如果你中途退出过游戏，将只能撤销至最后保存的状态。',
        'invite': '邀请好友',
        'contact_author':'联系作者'
    },
    'en-US': {
        "intro": 'Join the numbers and get to the <strong>4096 tile!</strong>',
        'keepgoing': 'Keep going',
        'tryagain': 'Try again',
        'share': 'Share',
        'expl': ' <strong class="important">How to play:</strong><br> Swipe your <strong>finger</strong> to move the tiles. When two tiles with the same number touch, they <strong>merge into one!</strong>',
        'About': 'About',
        'Rate': 'Rate',
        'Settings': 'Settings',
        'win': 'You win!',
        'over': 'Game over!',
        'howtoplay': "How to play",
        'keyboard': 'You can use W/S/A/D on keyboard devices to control the movement,use R to reset the game,use Z to undo.',
        'dev': 'Developer',
        'test': '<b>Test Team</b>',
        'visualsettings': 'Visual Settings',
        'dark': 'Choose a theme',
        'back': 'Back',
        'donate': 'If you like this app,please donate for my development via paypal anphorea@gmail.com , thank you.',
        'sound': "Sound Settings",
        'usesound': 'Enable Sound',
        'author': 'Ported from https://github.com/gabrielecirulli/2048 ,Created by Gabriele Cirulli. Based on 1024 by Veewo Studio and conceptually similar to Threes by Asher Vollmer.',
        'mute': 'OFF',
        '_mute': 'ON',
        '_reset': 'Reset Game',
        'status': 'Undo Feature Status: ',
        'checking': "Checking...",
        'unlock': 'Unlock Undo Feature',
        'refresh': 'Refresh Payment Status',
        'UNDO_OK': "Unlocked",
        "UNDO_ERROR": "Locked",
        'Undo': 'Undo',
        'needpurchase': "Please go to Settings page to unlock this feature.",
        "promo": "I got an unlock code",
        'promotext': 'If you have the unlock code,you can type it here. Your cipher key is :',
        'unlocktitle': 'Unlock',
        'promoerr': 'Code Invalid.Unlock Fail.',
        'promosuccess': 'Feature Unlocked.',
        'showcode': 'Show Unlock Code',
        'okbtn': "OK",
        'urcodeis': "Your Unlock Code is : ",
        'restart': 'Restart game?',
        'confirm': 'Confirm',
        'keepplaying': 'Keep playing?',
        "bbm_not_connected": "BBM is not connected.",
        'restart_required': 'You can choose the theme here, no restart required.',
        'sound_tips': 'You can enable/disable the game sound here,or via the swipe-down menu.',
        'undo_tips': "Undo feature lets you undo your last 50 movements, till the very beginning of the game,or the last saved state.",
        'invite': 'Invite',
        'contact_author':'Mail Me'
    }
}