var i18n = {
    // RegExp to match the i18n key ( `key` )
    regx: /`([\w\d\s.-]*?)`/ig,
    // Process all nodes in element with i18n strings.
    process: function(element, lang) {
        var items = element.querySelectorAll('[i18n=true]');
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var all = i18n.getAllPropsOf(item);
            //Deal with properties
            var props = all[0];
            for (var j = 0; j < props.length; j++) {
                var pv = props[j];
                var str = pv.v;
                var t = i18n.regx.exec(str);
                while (t) {
                    str = i18n.replace(str, t[1], lang);
                    console.log('[i18n]>>' + JSON.stringify(pv) + ">>" + str);
                    t = i18n.regx.exec(str);
                }
                item[pv.p] = str;
            }
            //Deal with attributes.
            var atts = all[1];
            for (var j = 0; j < atts.length; j++) {
                var pv = atts[j];
                var str = pv.v;
                var t = i18n.regx.exec(str);
                while (t) {
                    str = i18n.replace(str, t[1], lang);
                    console.log('[i18n]>>' + JSON.stringify(pv) + ">>" + str);
                    t = i18n.regx.exec(str);
                }
                item.setAttribute([pv.a], str);
            }
        }
    },
    replace: function(str, token, lang) {
        //replace token in str to specified lang
        var target = i18n.get(token, lang);
        var re = new RegExp('`' + token + '`', "ig");
        return str.replace(re, target);
    },
    get: function(id, lang) {
        /*
         * Get i18n str from qstr.
         */
        try {
            var str = qstr[lang][id];
            if (str) {
                return str;
            } else {
                return "[" + id + "]";
            }
        } catch (ex) {
            // language not available. use default.
            str = qstr[qstr.
                    default][id];
            if (str) {
                return str;
            } else {
                return "[" + id + "]";
            }

        }

    },
    getAllPropsOf: function(obj) {
        //get innerTEXT
        var items = [];
        if (obj.innerHTML && obj.innerHTML.length > 2)
            items.push({
                p: 'innerHTML',
                v: obj.innerHTML
            });

        //get all attributes
        var atts = [];
        if (obj.attributes) {
            for (var i = 0; i < obj.attributes.length; i++) {
                var at = obj.attributes[i];
                if (at.value.length > 3) {
                    atts.push({
                        a: at.name,
                        v: at.value
                    });
                }
            }
        }
        return [items, atts];
    }
}