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
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
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
    undo: true,
    vividbackground: "#776e65",
    screenshot: null,
    useAudio: true,
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
    },
    bbinit: function() {
        app.lang = blackberry.system.language;
        app.ss = "file://" + blackberry.io.home + "/ss.png";
        app.theme = localStorage.getItem('theme');
        app.useAudio = (localStorage.getItem('sound') === "true");
        app.undo = true;
        app.preloadAudio();
        document.body.className = app.theme;
        bb.init({
            controlsDark: app.theme === 'dark',
            listsDark: app.theme === 'dark',
            onscreenready: function(e, id) {
                i18n.process(e, app.lang);
                bb.screen.controlColor = (app.theme === 'dark') ? 'dark' : 'light';
                bb.screen.listColor = (app.theme === 'dark') ? 'dark' : 'light';
                if (app.theme === 'dark') {
                    var screen = e.querySelector('[data-bb-type=screen]');
                    if (screen) {
                        screen.style['background-color'] = app.darkScreenColor;
                    }
                    if (document.body.classList.contains("vivid")) {
                        document.body.classList.remove("vivid");
                    }
                    if (!document.body.classList.contains("dark")) {
                        document.body.classList.add("dark");
                    }
                } else if (app.theme === 'vivid') {
                    document.body.className = 'vivid';
                    var screen = e.querySelector('[data-bb-type=screen]');
                    if (screen) {
                        //screen.style['background-color'] = app.vividbackground;
                    }
                } else {
                    if (document.body.classList.contains("dark")) {
                        document.body.classList.remove("dark");
                    }
                    if (document.body.classList.contains("vivid")) {
                        document.body.classList.remove("vivid");
                    }
                }
            },
            ondomready: function(e, id, param) {
                if (id === 'settings') {
                    loadSettings(e);
                }
                if (id === 'game') {
                    loadstate(e);
                    window.webkitRequestAnimationFrame(function() {
                        app.gamemgr = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
                    });
                }
            }
        });
        if (app.theme === 'dark') {
            document.body.style['background-color'] = app.darkScreenColor;
            document.body.style['color'] = '#88919A';
        }
        bb.pushScreen('game.html', 'game');
        navigator.splashscreen.hide();
    }
};

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

function loadSettings(element) {
    // 读取配置数据
    var togglebutton = element.getElementById('themeSelect');
    var theme = localStorage.getItem("theme");
    if (theme === 'dark') {
        togglebutton.setSelectedItem(0);
    } else if (theme === 'vivid') {
        togglebutton.setSelectedItem(2);
    } else {
        togglebutton.setSelectedItem(1);
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
    
    //bb.refresh();
}
function saveTheme(e) {
    app.theme = e.value;
    localStorage.setItem("theme", e.value);
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
        localStorage.setItem("sound", "true");
    } else {
        console.log(">>禁用声音.");
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
