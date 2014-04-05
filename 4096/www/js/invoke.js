var twitterlib = {
    /*
     * This lib is created by anpho ( anphorea@gmail.com )
     */
    tweet: function(shareText, callback) {
        blackberry.invoke.invoke({
            target: "Twitter",
            action: "bb.action.SHARE",
            type: "text/plain",
            data: shareText
        },
        function() {
            if (callback) {
                callback(true);
            }
        }, function(e) {
            if (callback) {
                callback(false);
            }
        });
    },
    openProfile: function(username, callback) {
        blackberry.invoke.invoke({
            target: "com.twitter.urihandler",
            action: "bb.action.VIEW",
            uri: "twitter:connect:" + username
        },
        function() {
            if (callback) {
                callback(true);
            }
        }, function(e) {
            if (callback) {
                callback(false);
            }
        });
    },
    search: function(word, callback) {
        blackberry.invoke.invoke({
            target: "com.twitter.urihandler",
            action: "bb.action.VIEW",
            uri: "twitter:search:" + word
        },
        function() {
            if (callback) {
                callback(true);
            }
        }, function(e) {
            if (callback) {
                callback(false);
            }
        });
    },
    shareURL: function(url, callback) {
        blackberry.invoke.invoke({
            target: "Twitter",
            action: "bb.action.SHARE",
            uri: url
        },
        function() {
            if (callback) {
                callback(true);
            }
        }, function(e) {
            if (callback) {
                callback(false);
            }
        });
    },
    sharePhoto: function(photouri, callback) {
        var type = null;
        var ext = photouri.lastIndexOf('.');
        ext = photouri.substring(ext + 1).toLowerCase();
        if (ext === 'jpg' || ext === 'jpeg') {
            type = 'image/jpeg';
        } else if (ext === 'gif') {
            type = 'image/gif';
        } else if (ext === 'png') {
            type = 'image/png';
        } else {
            callback(false);
            console.error('File Extension Not Supported.');
            return;
        }
        blackberry.invoke.invoke({
            target: "Twitter",
            action: "bb.action.SHARE",
            uri: photouri,
            type: type
        },
        function() {
            if (callback) {
                callback(true);
            }
        }, function(e) {
            if (callback) {
                callback(false);
            }
        });
    }
};