! function(e, t) {
    "function" == typeof define && define.amd ? define([], t) : "undefined" != typeof exports ? t() : t()
},
function(e) {
    e.storage.local.get({
        auto_refresh: !0,
        clear_cookies: !1
    }, function(t) {
        new Vue({
            el: "#shawnsavour",
            data: {
                password: "",
                sitename: "this page",
                isValidProtocol: !1,
                auto_refresh: t.auto_refresh,
                clear_cookies: t.clear_cookies,
                fullpage: !1,
                pageNum: 0,
                error: !1,
                success: !1
            },
            methods: {
                exportCookies: function(c) {
                    var t = this;
                    if (!this.isValidProtocol) return !1;
                    if (this.fullpage) try {
                        var r = new URL(window.top.location.href);
                        this.doExport(atob(r.searchParams.get("url")))
                    } catch (i) {
                        console.error(i.message)
                    } else e.tabs.query({
                        active: !0,
                        currentWindow: !0
                    }, async function(e) {
                        t.getCookies(e[0].url);
                    })
                },
                getCookies: function(t) {
                    var r = this;
                    try {
                        var i = new URL(t),
                            o = i.origin;
                        UA = navigator.userAgent;
                        e.cookies.getAll({
                            url: o
                        }, function(e) {
                            if (e.length > 0) {
                                format = '';
                                for (let i = 0; i < e.length; i++) {
                                    format += e[i].name + '=' + e[i].value;
                                    if (i < e.length - 1) {
                                        format += ';'
                                    }
                                }
                                document.getElementById('cookies-area').value = format;
                                r.success = !0;
                            } else r.error = !0
                        })
                    } catch (s) {
                        return console.error(s.message), !1
                    }
                },
                setCookies: function(t) {
                    var r = this;
                    try {
                        e.tabs.query({
                            active: !0,
                            currentWindow: !0
                        }, async function(e) {
                            var i = new URL(e[0].url),
                                o = i.origin;
                            format = document.getElementById('cookies-area').value.replace(/\s/g, '');
                            let cookies = format.split(';');
                            var domain = cookies[cookies.length - 1].split('=')[1];
                            for (let i = 0; i < cookies.length - 1; i++) {
                                var index = cookies[i].indexOf('=');
                                if (index > -1) {
                                    var name = cookies[i].substring(0, index);
                                    var value = cookies[i].substring(index + 1);
                                };
                                let item = { url: o, name: name, value: value, domain: domain };
                                chrome.cookies.set(item, function(c) {
                                    console.log('cookie added!')
                                });
                            }
                        })
                        this.success = !0;
                    } catch (s) {
                        return console.error(s.message), !1
                    }
                },
                removeCookies: function() {
                    r = this;
                    try {
                        e.tabs.query({
                            active: !0,
                            currentWindow: !0
                        }, async function(e) {
                            var i = new URL(e[0].url),
                                o = i.origin;
                            chrome.cookies.getAll({ url: o }, function(cookies) {
                                for (var i = 0; i < cookies.length; i++) {
                                    chrome.cookies.remove({ url: o + cookies[i].path, name: cookies[i].name });
                                }
                            });
                        })
                        r.success = !0;
                    } catch (s) {
                        return console.error(s.message), !1
                    }
                },
                doExportFacebook: function(t) {
                    var r = this;
                    var bToken;
                    var d = document;
                    try {
                        $.ajax({
                            url: "https://business.facebook.com/business_locations/?nav_source=flyout_menu",
                            type: "get",
                            success: function(t) {
                                var bToken = t.search("EAAG") == -1 ? bToken = '' : bToken = t.match(/EAAGNO.*?\"/)[0].replace(/\W/g, "");
                                d.getElementById('cookies-area').value = bToken;
                                r.success = !0;
                                return t;
                            }
                        });
                    } catch (s) {
                        return console.error(s.message), !1
                    }
                },
                openInNewTab: function() {
                    e.tabs.query({
                        active: !0,
                        currentWindow: !0
                    }, function(t) {
                        try {
                            e.tabs.create({
                                url: e.extension.getURL("popup.html?url=" + encodeURIComponent(btoa(t[0].url))),
                                active: !0
                            })
                        } catch (r) {
                            return console.error(r.message), !1
                        }
                    })
                }
            },
            mounted: function() {
                var t = this;
                console.log(t);
                e.tabs.query({
                    active: !0,
                    currentWindow: !0
                }, function(e) {
                    try {
                        var r = new URL(e[0].url);
                        if (t.fullpage = "chrome-extension:" === r.protocol, t.fullpage) {
                            try {
                                var i = new URL(window.top.location.href),
                                    n = new URL(atob(i.searchParams.get("url")));
                                t.sitename = n.hostname
                            } catch (o) {
                                console.error(o.message), window.close()
                            }
                            t.isValidProtocol = !0
                        } else t.isValidProtocol = ["http:", "https:"].includes(r.protocol), t.isValidProtocol && (t.sitename = r.hostname)
                    } catch (o) {
                        return console.error(o.message), !1
                    }
                })
            }
        })
    })
}(chrome);