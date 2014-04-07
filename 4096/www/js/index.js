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
    useDarkTheme: true,
    darkScreenColor: '#000',
    gamemgr: null,
    ss:null,
    screenshot:null,
    bbinit: function() {
        app.ss="file://"+blackberry.io.home+"/ss.png";
        app.useDarkTheme = (localStorage.getItem('theme') === "true");
        if (!app.useDarkTheme) {
            document.body.classList.remove('dark');
        } else {
            if (!document.body.classList.contains("dark")) {
                document.body.classList.add("dark")
            }
        }
        bb.init({
            controlsDark: app.useDarkTheme,
            listsDark: app.useDarkTheme,
            onscreenready: function(e, id) {
                if (app.useDarkTheme) {
                    var screen = e.querySelector('[data-bb-type=screen]');
                    if (screen) {
                        screen.style['background-color'] = app.darkScreenColor;
                    }
                    if (!document.body.classList.contains("dark")) {
                        document.body.classList.add("dark")
                    }
                }

            },
            ondomready: function(e, id, param) {
                if (id === 'settings') {
                    loadSettings(e);
                }
                if (id === 'game') {
                    window.requestAnimationFrame(function() {
                        app.gamemgr = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalScoreManager);
                    });
                }
            }
        });
        if (app.useDarkTheme) {
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
    window.location.reload();
}

function loadSettings(element) {
    // 读取配置数据
    var togglebutton = element.getElementById('themeToggle');
    var theme = localStorage.getItem("theme");
    if ('true' === theme) {
        togglebutton.setChecked(true);
    } else {
        togglebutton.setChecked(false);
    }
    bb.refresh();
}
function saveSettings(e) {
    if (e.checked) {
        console.log(">>使用黑色主题.");
        localStorage.setItem("theme", "true");
    } else {
        console.log(">>使用亮色主题.");
        localStorage.setItem("theme", "false");
    }
}

