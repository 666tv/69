// 搜索功能需登录使用
var rule = {
    title: 'JustLive',
    host: 'http://live.yj1211.work',
    // homeUrl: '/api/live/getRecommend?page=1&size=20',//网站的首页链接,用于分类获取和推荐获取
    homeUrl: '/api/live/getRecommendByPlatformArea?platform=bilibili&area=舞见&page=1&size=20',//网站的首页链接,用于分类获取和推荐获取
    url: '/api/live/getRecommendByPlatformArea?platform=fyclass&area=fyfilter&page=fypage&size=20', //网站的分类页面链接
    class_name: '网易',
    class_url: 'cc',
    filterable: 1,
    filter_url: '{{fl.area}}',
    filter: {
        "cc":[{"key":"area","name":"分区","value":[{"n":"星秀","v":"星秀"},{"n":"综合手游","v":"综合手游"},{"n":"正能量","v":"正能量"},{"n":"实况足球","v":"实况足球"},{"n":"主机单机","v":"主机单机"},{"n":"梦幻西游手游","v":"梦幻西游手游"},{"n":"倩女幽魂手游","v":"倩女幽魂手游"},{"n":"蛋仔派对","v":"蛋仔派对"},{"n":"明日之后","v":"明日之后"},{"n":"阴阳师","v":"阴阳师"},{"n":"大话西游手游","v":"大话西游手游"},{"n":"第五人格","v":"第五人格"},{"n":"率土之滨","v":"率土之滨"},{"n":"荒野行动","v":"荒野行动"},{"n":"神都夜行录","v":"神都夜行录"},{"n":"梦幻西游三维版","v":"梦幻西游三维版"},{"n":"决战！平安京","v":"决战！平安京"},{"n":"天谕手游","v":"天谕手游"},{"n":"大唐无双手游","v":"大唐无双手游"},{"n":"光·遇","v":"光·遇"},{"n":"镇魔曲手游","v":"镇魔曲手游"},{"n":"狼人杀","v":"狼人杀"},{"n":"王牌竞速","v":"王牌竞速"},{"n":"逆水寒手游","v":"逆水寒手游"},{"n":"新游中心","v":"新游中心"},{"n":"梦幻西游电脑版","v":"梦幻西游电脑版"},{"n":"永劫无间","v":"永劫无间"},{"n":"大话西游2经典版","v":"大话西游2经典版"},{"n":"新倩女幽魂","v":"新倩女幽魂"},{"n":"大话西游2免费版","v":"大话西游2免费版"},{"n":"逆水寒","v":"逆水寒"},{"n":"荒野行动PC模拟器","v":"荒野行动PC模拟器"},{"n":"燕云十六声","v":"燕云十六声"}]}]
    },
    filter_def:{
        cc:{area:'星秀'}
    },
    // detailUrl: '/index/liveRoom?platform=fyclass&roomId=fyid',
    // detailUrl: '/api/live/getRoomInfo?uid=&platform=fyclass&roomId=fyid',
    detailUrl: 'fyid',
    searchUrl: '/api/live/search?platform=all&keyWords=**&isLive=0',
    // searchable: 2,
    searchable: 0,
    quickSearch: 0,
    headers: {
        'User-Agent': 'MOBILE_UA'
    },
    timeout: 5000,
    play_parse: true,
    lazy:`js:
        let purl = input.split("|")[0];
        let pfrom = input.split("|")[1];
        let cid = input.split("|")[2];
        print("purl:" + purl);
        print("pfrom:" + pfrom);
        print("cid:" + cid);
        let dan = 'https://api.bilibili.com/x/v1/dm/list.so?oid=' + cid;
        if (/bilibili/.test(pfrom)){
            let result = {};
            result['parse'] = 0;
            result['playUrl'] = '';
            result['url'] = unescape(purl);
            result['header'] = {
                Referer: 'https://live.bilibili.com',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
            };
            result['danmaku'] = dan;
            if (/h5/.test(purl)) {
                result['contentType'] = '';
                input = result
            } else {
                result['contentType'] = 'video/x-flv';
                input = result
            }
        } else {
            input = purl
        }
    `,
    limit: 6,
    推荐: `js:
        var d = [];
        var html = JSON.parse(request(input)).data;
        html.forEach(it => {
            d.push({
                title: it.roomName,
                desc: it.ownerName,
                pic_url: it.roomPic,
                url: it.platForm + '|' + it.roomId
            });
        })
        setResult(d);
    `,
    一级: `js:
        var d = [];
        if (MY_CATE === 'douyin') {
            let area = MY_FL.area || '全部';
            if (area === '全部') {
                input = HOST + '/api/live/getRecommendByPlatform?platform=douyin&page='+MY_PAGE+'&size=20';
            }
        }
        var html = JSON.parse(request(input)).data;
        html.forEach(it => {
            d.push({
                title: it.roomName,
                desc: it.ownerName,
                pic_url: it.roomPic,
                url: it.platForm + '|' + it.roomId
            });
        })
        setResult(d);
    `,
    二级: `js:
        var d = [];
        if (typeof play_url === "undefined") {
            var play_url = ""
        }
        let platform = input.split("|")[0].replace(HOST+'/','');
        let roomId = input.split("|")[1];
        let link = HOST + '/api/live/getRoomInfo?uid=&platform=' + platform + '&roomId=' + roomId;
        var jo = JSON.parse(request(link)).data;
        VOD = {
            vod_id: jo.roomId,
            vod_name: jo.roomName,
            vod_pic: jo.roomPic,
            type_name: jo.platForm.replace("huya", "虎牙").replace("douyu", "斗鱼").replace("cc", "网易CC").replace("bilibili", "哔哩哔哩").replace("douyin", "抖音") + "." + jo.categoryName,
            vod_content: "🏷分区：" + jo.platForm.replace("huya", "虎牙").replace("douyu", "斗鱼").replace("cc", "网易CC").replace("bilibili", "哔哩哔哩").replace("douyin", "抖音") + "·" + jo.categoryName + " 🏷UP主：" + jo.ownerName + " 🏷人气：" + jo.online + (jo.isLive === 1 ? " 🏷状态：正在直播" : "状态：未开播")
        };
        var playurl = JSON.parse(request("http://live.yj1211.work/api/live/getRealUrl?platform=" + jo.platForm + "&roomId=" + jo.roomId)).data;
        var name = {
            "OD": "原画",
            "FD": "流畅",
            "LD": "标清",
            "SD": "高清",
            "HD": "超清",
            "2K": "2K",
            "4K": "4K",
            "FHD": "全高清",
            "XLD": "极速",
            "SQ": "普通音质",
            "HQ": "高音质"
        };
        Object.keys(playurl).forEach(function(key) {
            if (!/ayyuid|to/.test(key)) {
                d.push({
                    title: name[key],
                    url: playurl[key]
                })
            }
        });
        VOD.vod_play_from = "选择画质";
        VOD.vod_play_url = d.map(function(it) {
            // return it.title + "$" + it.url
            return it.title + "$" + play_url + urlencode(it.url + "|" + jo.platForm + "|" + jo.roomId)
        }).join("#");
        setResult(d)
    `,
    搜索: `js:
        var d = [];
        var html = JSON.parse(request(input)).data;
        html.forEach(it => {
            d.push({
                title: it.roomName,
                desc: it.ownerName,
                pic_url: it.roomPic,
                url: it.platForm + '|' + it.roomId
            });
        })
        setResult(d);
    `,
}