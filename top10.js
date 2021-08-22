var startTime = 1629004644000
var endTime = 1629610344000

var urlContainsPid = document.querySelector('a[href*=mq]').href
var re = /#\/(.+@.+)\//
var pid = decodeURIComponent(re.exec(urlContainsPid)[1])


var query = `{"dimensions":["rpc"],"metric":"appstat.incall","measures":["rt","count","error"],"intervalMillis":2147483647,"startTime":${startTime},"endTime":${endTime},"filters":{"regionId":"cn-shanghai","pid":"${pid}"}}`
var ret = await axios.post('https://arms.console.aliyun.com/api/trace.json?action=TraceAction&eventSubmitDoGetDatas=1&source=nil', Qs.stringify({'query':query}))
var data = ret.data.data.data
var top10 = data.sort((a,b) => b.count - a.count)
                    .filter(a => a.rpc.indexOf('health.json') === -1)
                    .slice(0,10)
console.table(top10.map(i => {
    return {
        '接口名': i.rpc,
        '响应时长&请求量': `${i.rt.toFixed(2)}ms/${i.count > 10000 ? (i.count/1000).toFixed(2)+'K' : i.count}`,
        '问题': '暂无问题'
    }
}))
