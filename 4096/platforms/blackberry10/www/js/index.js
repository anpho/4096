var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    id: 52432887,
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onBackButton: function () {
        // For BlackBerry Classic Devices, set the Return Key to UNDO.
        if (document.getElementById('gamescr')) {
            app.gamemgr.move(-1);
        } else if (document.getElementById("gamehelp") || document.getElementById("gamesettings")) {
            bb.popScreen()
        }
    },
    onMenuButton: function () {
        if (document.getElementById('gamescr')) {
            bb.menuBar.showMenuBar();
        }
    },
    saveState: function() {
        if (app.gamemgr) {
            app.gamemgr.storageManager.flush();
        }
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        document.addEventListener('menubutton', app.onMenuButton);
        document.addEventListener("backbutton", app.onBackButton);
        document.addEventListener('windowstatechanged', app.saveState);
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
        app.bbinit();
        //Bbm.register();
    },
    theme: 'dark',
    darkScreenColor: '#000',
    gamemgr: null,
    ss: null,
    lang: null,
    speed: "normal",
    undo: true,
    exported: "false",
    vividbackground: "#776e65",
    screenshot: null,
    useAudio: true,
    audioLoaded: false,
    preloadAudio: function() {
        PGLowLatencyAudio.preloadAudio("low.wav", "sounds/", 4, function(echoValue) {
            console.log(echoValue);
        });
        PGLowLatencyAudio.preloadAudio("high.wav", "sounds/", 4, function(echoValue) {
            console.log(echoValue);
        });
        PGLowLatencyAudio.preloadAudio("win.wav", "sounds/", 1, function(echoValue) {
            console.log(echoValue);
        });
        app.audioLoaded = true;
    },
    bbinit: function() {
        app.lang = localStorage.getItem("lang") ? localStorage.getItem("lang") : blackberry.system.language;
        app.speed = localStorage.getItem("speed") ? localStorage.getItem("speed") : "normal";
        app.exported = localStorage.getItem('exported') === "true";
        app.ss = "file://" + blackberry.io.home + "/ss.png";
        app.theme = localStorage.getItem('theme');
        app.useAudio = (localStorage.getItem('sound') === "true");
        if (app.useAudio) {
            app.preloadAudio();
        }
        document.body.className = app.theme;

        bb.init({
            controlsDark: app.theme === 'dark',
            listsDark: app.theme === 'dark',
            onscreenready: function(e, id) {
                i18n.process(e, app.lang);
                bb.screen.controlColor = (app.theme === 'dark') ? 'dark' : 'light';
                bb.screen.listColor = (app.theme === 'dark') ? 'dark' : 'light';
                document.body.className="";
                if (app.theme === 'dark') {
                    var screen = e.querySelector('[data-bb-type=screen]');
                    if (screen) {
                        screen.style['background'] = theme.dark.bg;
                        screen.style['color'] = theme.dark.color;
                    }
                    if (!document.body.classList.contains("dark")) {
                        document.body.classList.add("dark");
                    }
                } else if (app.theme === 'vivid') {
                    if (!document.body.classList.contains("vivid")) {
                        document.body.classList.add("vivid");
                    }
                    var screen = e.querySelector('[data-bb-type=screen]');
                    if (screen) {
                        screen.style['background'] = theme.vivid.bg;
                        screen.style['color'] = theme.vivid.color;
                    }
                } else if (app.theme === 'blue') {
                    if (!document.body.classList.contains("blue")) {
                        document.body.classList.add("blue");
                    }
                    var screen = e.querySelector('[data-bb-type=screen]');
                    if (screen) {
                        screen.style['background'] = theme.blue.bg;
                        screen.style['color'] = theme.blue.color;
                    }
                } else if (app.theme === 'flat') {
                    if (!document.body.classList.contains("flat")) {
                        document.body.classList.add("flat");
                    }
                    var screen = e.querySelector('[data-bb-type=screen]');
                    if (screen) {
                        screen.style['background'] = theme.flat.bg;
                        screen.style['color'] = theme.flat.color;
                    }
                } else {
                    var screen = e.querySelector('[data-bb-type=screen]');
                    if (screen) {
                        screen.style['background'] = "";
                        screen.style['color'] = "";
                    }
                }
                //处理速度 ===================================
                document.body.classList.add(app.speed);


                if (id !== "game") {
                    app.saveState();
                }

                if (id === 'settings') {
                    loadLocalSettings(e);
                }
            },
            ondomready: function(e, id, param) {
                if (id === 'settings') {
                    //Register BBM
                    if (!Bbm.registered) {
                        Bbm.register();
                    }
                    setTimeout(function() {
                        loadSettings(e);
                    }, 1);
                }
                if (id === 'game') {
                    loadstate(e);
                    window.webkitRequestAnimationFrame(function() {
                        app.gamemgr = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
                        if (!app.exported) {
                            doExport(false);
                            bb.pushScreen('export.html', 'export');
                            app.exported = true;
                        }
                    });
                }
            }
        });
        /*
         * 应用启动时不闪屏
         */
        if (app.theme === 'dark') {
            document.body.style['background-color'] = theme.dark.bg;
            document.body.style['color'] = theme.dark.color;
        } else if (app.theme === 'blue') {
            document.body.style['background-color'] = theme.blue.bg;
            document.body.style['color'] = theme.blue.color;
        } else if (app.theme === 'vivid') {
            document.body.style['background-color'] = theme.vivid.bg;
            document.body.style['color'] = theme.vivid.color;
        } else if (app.theme === 'flat') {
            document.body.style['background-color'] = theme.flat.bg;
            document.body.style['color'] = theme.flat.color;
        } else if (app.theme === 'bright') {
            document.body.style['background-color'] = theme.def.bg;
            document.body.style['color'] = theme.def.color;
        }
        if (bb.device.is1440x1440){
            document.querySelector('meta[name=viewport]').setAttribute('content','initial-scale=0.55,user-scalable=no')
        }
        bb.pushScreen('game.html', 'game');
        navigator.splashscreen.hide();
    }
};

function doExport(b) {
    //b is toast toggle
    var gs = blackberry.io.home + "/2048game.txt";
    var bestscore = app.gamemgr.storageManager.getBestScore();
    var gamestate = app.gamemgr.storageManager.getGameState();
    gamestate['bestScore'] = bestscore;

    blackberry.io.sandbox = false;
    window.webkitRequestFileSystem(window.PERSISTENT, 1024 * 1024, function (fs) {
        fs.root.getFile(gs, {create: true}, function (DatFile) {
            DatFile.remove(function (e) {
                console.log(e);
                fs.root.getFile(gs, {create: true}, function (Dat) {
                    Dat.createWriter(function (DatContent) {
                        var blob = new Blob([JSON.stringify(gamestate)], {type: "text/plain"});
                        DatContent.write(blob);
                        if (b) {
                            okHandler("Game Status Exported.");
                            localStorage.setItem('exported', "true");
                            app.exported = true;
                            bb.popScreen();
                        }
                    });
                });
            });
        }, function (e) {
            errorHandler(e);
        });

    });
}
function errorHandler(e) {
    Toast.regular(JSON.stringify(e));
}
function okHandler(e) {
    Toast.regular(e);
}

function openInBrowser(url) {
    blackberry.invoke.invoke({
        uri: url
    },
    function() {
        console.log('Browser Opened: ' + url);
    }, function() {
        console.error('Browser Not Opened: ' + url);
    });
}

function openTwitterAccount(account) {
    twitterlib.openProfile(account, function(i) {
        if (!i) {
            openInBrowser('http://twitter.com/' + account);
        }
    });
}



//settings

function refreshTheme() {
    //window.location.reload();
}
function loadLocalSettings(element) {

}
function loadSettings(element) {
    // 读取配置数据
    var togglebutton = element.getElementById('themeSelect');
    var theme = localStorage.getItem("theme");
    if (theme === 'dark') {
        togglebutton.setSelectedItem(0);
    } else if (theme === 'vivid') {
        togglebutton.setSelectedItem(2);
    } else if (theme === 'blue') {
        togglebutton.setSelectedItem(3);
    } else if (theme === 'flat') {
        togglebutton.setSelectedItem(4);
    } else {
        togglebutton.setSelectedItem(1);
    }

    //语言配置
    var langbtn = element.getElementById('langSelect');
    var locale = app.lang;
    if (locale === 'zh-CN') {
        langbtn.setSelectedItem(1);
    } else if (locale === 'zh-TW') {
        langbtn.setSelectedItem(2);
    } else if (locale === 'fr-FR') {
        langbtn.setSelectedItem(4);
    } else if (locale === 'id-ID') {
        langbtn.setSelectedItem(3);
    } else if (locale === 'es-ES') {
        langbtn.setSelectedItem(5);
    } else if (locale === 'it-IT') {
        langbtn.setSelectedItem(6);
    } else if (locale === 'de-DE') {
        langbtn.setSelectedItem(7);
    } else {
        langbtn.setSelectedItem(0);
    }

    //速度配置animSelect
    var animSelect = element.getElementById('animSelect');
    var speed = app.speed;
    if (speed === 'slow') {
        animSelect.setSelectedItem(0);
    } else if (speed === 'normal') {
        animSelect.setSelectedItem(1);
    } else if (speed === 'fast') {
        animSelect.setSelectedItem(2);
    }

    // 读取配置数据
    var sndbutton = element.getElementById('soundToggle');
    var snd = localStorage.getItem("sound");
    if ('true' === snd) {
        sndbutton.setChecked(true);
    } else {
        sndbutton.setChecked(false);
    }


    // 读取UNDO数据

    g('undoflag').innerHTML = app.undo ? i18n.get('UNDO_OK', app.lang) : i18n.get('UNDO_ERROR', app.lang);
}
function saveTheme(e) {
    if (app.undo) {
        app.theme = e.value;
        localStorage.setItem("theme", e.value);
    } else if (e.value === "flat") {
        Toast.regular(i18n.get('UNDO_ERROR', app.lang), 1500);
        switch (app.theme) {
            case "dark":
                e.setSelectedItem(0);
                break;
            case "vivid":
                e.setSelectedItem(2);
                break;
            case "blue":
                e.setSelectedItem(3);
                break;
            default:
                e.setSelectedItem(1);
                break;
        }
        return false;
    } else {
        app.theme = e.value;
        localStorage.setItem("theme", e.value);
    }
}
function saveLang(e) {
    app.lang = e.value;
    localStorage.setItem("lang", e.value);
}
function saveSpeed(e) {
    app.speed = e.value;
    localStorage.setItem("speed", e.value);
}
function saveSettings(e) {
    if (e.checked) {
        console.log(">>使用黑色主题.");
        app.useDarkTheme = true;
        localStorage.setItem("theme", "true");
    } else {
        console.log(">>使用亮色主题.");
        app.useDarkTheme = false;
        localStorage.setItem("theme", "false");
    }
}
function saveSoundSettings(e) {
    if (e.checked) {
        console.log(">>启用声音.");
        app.useAudio = true;
        if (!app.audioLoaded) {
            app.preloadAudio();
        }
        localStorage.setItem("sound", "true");
    } else {
        console.log(">>禁用声音.");
        app.useAudio = false;
        localStorage.setItem("sound", "false");
    }
}

function loadstate(e) {
    var tm = e.querySelectorAll('[class=bb-menu-bar-item]')[3];
    if (app.useAudio) {
        tm.firstChild.src = 'img/ic_speaker.png';
        tm.lastChild.innerHTML = i18n.get('_mute', app.lang);
    } else {
        tm.firstChild.src = 'img/ic_speaker_mute.png';
        tm.lastChild.innerHTML = i18n.get('mute', app.lang);
    }
}

function toggleMute() {
    app.useAudio = !app.useAudio;
    loadstate(document);
    var b = {
        checked: app.useAudio
    };
    saveSoundSettings(b);
}

function undoHandler(event) {
    event.preventDefault();
    // undo button click handler
    app.gamemgr.move(-1);
}


function g(id) {
    return document.getElementById(id);
}



function resetHandler(t) {
    t.disable();
    try {
        blackberry.ui.dialog.standardAskAsync(i18n.get('reset_confirm', app.lang), blackberry.ui.dialog.D_OK_CANCEL, function(r) {
            if (r.return === 'Ok') {
                app.gamemgr.storageManager.setBestScore(0);
                app.gamemgr.storageManager.clearGameState();
                Toast.regular(i18n.get('reseted', app.lang), 1500);
            } else {
                t.enable();
            }
        }, {title: i18n.get('reset_title', app.lang)});
    } catch (e) {
        Toast.regular("ERROR:" + JSON.stringify(e), 1000);
        t.enable();
    }

}

var theme = {
    dark: {
        color: "#88919A",
        bg: "#050710"
    },
    vivid: {
        color: "#000",
        bg: "url(img/bg3.jpg)"
    },
    blue: {
        color: "#72838f",
        bg: "#EBF3F9"
    },
    def: {
        color: "#776e65",
        bg: "url(img/bg2.jpg)"
    },
    flat: {
        bg: "#F7F2E0",
        color: "#000"
    }
};