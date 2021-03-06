//- 取得背景
function getBackground() {
    if (window.localStorage["randomImg"])
        return window.localStorage["randomImg"]
    else
        return "/og/og.png"
}
//- 請求
async function request(url) {
    let result;
    try {
        result = (await axios.get(url)).data
    } catch (e) {
        result = null
        console.log(e)
        mdui.snackbar({
            message: `哎呀！請求出錯了，請再試一次看看：（`,
            timeout: 400,
            position: getSnackbarPosition()
        });
    }
    return result
}
/*===== Pin =====*/
async function isPinned(source, type, id, name) {
    let result = (await axios.post(`/pokaapi/isPinned/?moduleName=${source}&type=${type}&id=${id}&name=${name}`))
    return result.data
}
async function addPin(source, type, id, name) {
    let result = (await axios.post(`/pokaapi/addPin/?moduleName=${source}&type=${type}&id=${id}&name=${name}`)).data
    if (result != true)
        mdui.snackbar({
            message: `釘選失敗`,
            timeout: 400,
            position: getSnackbarPosition()
        })
    else
        caches.open('PokaPlayer').then(function(cache) {
            cache.delete('/pokaapi/home')
        })
    return result
}
async function unPin(source, type, id, name) {
    let result = (await axios.post(`/pokaapi/unPin/?moduleName=${source}&type=${type}&id=${id}&name=${name}`)).data
    if (result != true)
        mdui.snackbar({
            message: `取消釘選失敗`,
            timeout: 400,
            position: getSnackbarPosition()
        })
    else
        caches.open('PokaPlayer').then(function(cache) {
            cache.delete('/pokaapi/home')
        })
    return result
}
/*===== 歌詞 =====*/
//- 取得歌詞
async function getLrc(artist, title, id = false, source) {
    let lyricRegex = /\[([0-9.:]*)\]/i
    let result;
    if (id) {
        result = await axios.get(`/pokaapi/lyric/?moduleName=${encodeURIComponent(source)}&id=${encodeURIComponent(id)}`)
        if (result.data.lyrics[0].lyric && result.data.lyrics[0].lyric.match(lyricRegex))
            return result.data.lyrics[0].lyric
    }
    result = await axios.get(`/pokaapi/searchLyrics/?keyword=${encodeURIComponent(title+' '+artist)}`)

    if (result.data.lyrics[0]) {
        let lrcTitle = result.data.lyrics[0].name.toLowerCase().replace(/\.|\*|\~|\&|。|，|\ |\-|\!|！|\(|\)/g, '')
        let songTitle = title.toLowerCase().replace(/\.|\*|\~|\&|。|，|\ |\-|\!|！|\(|\)/g, '')
        if (lrcTitle == songTitle && result.data.lyrics[0].lyric.match(lyricRegex))
            return result.data.lyrics[0].lyric
    }
    return false
}
async function searchLrc(keyword) {
    return await axios.get(`/pokaapi/searchLyrics/?keyword=${encodeURIComponent(keyword)}`)
}