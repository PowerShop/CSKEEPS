var channelToken = "pM+1nt+/s29opmRttxzXw/v8mChUlV3zhx2TkX3M3ajxAcvieNacAxtPd7qfEzOjFvQJ9vpMz2L731eZLUl+M2NChALzRledChxRItRvN0F/YRJEQMiM5BoBkoUmPsb5zTjcBHAAujHD6aYS1+7sgQdB04t89/1O/w1cDnyilFU=";
//ทุกไฟล์ที่ส่งผ่านการเลือกส่งไฟล์จะเก็บรวมกัน แยกเฉพาะ image, audio, video ที่ส่งผ่านอัลบั้มและกดส่งเสียง
var gdrivefolderId = "1Pn1tppxTYDh3R4-jsHJNAdcG-PpIy31x";
var gdrivefolderImageId = "1W8O0HNk8ekI8MKBc3AEtN8gV-K4JVW0f";
var gdrivefolderVideoId = "1veDkknYTZXH80CdIXVCtfm7b_MF87-Zb";
var gdrivefolderAudioId = "188naoav6foPv3gnZtDSgnxnp1-c_qjGE";

function replyMsg(replyToken, mess, channelToken) {
    var url = 'https://api.line.me/v2/bot/message/reply';
    var opt = {
        'headers': {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ' + channelToken,
        },
        'method': 'post',
        'payload': JSON.stringify({
            'replyToken': replyToken,
            'messages': mess
        })
    };
    UrlFetchApp.fetch(url, opt);
}

function toDrive(messageId, meType, mType, gdriveId, channelToken, icon) {
    var url = "https://api-data.line.me/v2/bot/message/" + messageId + "/content";
    var headers = {
        "headers": { "Authorization": "Bearer " + channelToken }
    };
    var getcontent = UrlFetchApp.fetch(url, headers);
    var blob = getcontent.getBlob();
    var fileBlob = Utilities.newBlob(blob.getBytes(), meType, messageId + mType);
    var rid = DriveApp.getFolderById(gdriveId).createFile(fileBlob).getId();
    return x = 'เก็บไฟล์แล้วครับ ✅\nไฟล์ : ' + messageId + ' 📁\nประเภท : ' + mType + ' ' + icon + '\nhttps://drive.google.com/uc?id=' + rid;
}

function doPost(e) {
    var value = JSON.parse(e.postData.contents);
    var events = value.events;
    var event = events[0];
    var type = event.type;
    var replyToken = event.replyToken;
    var sourceType = event.source.type;
    var userId = event.source.userId;
    var groupId = event.source.groupId;
    var timeStamp = event.timestamp;

    switch (type) {
        case 'follow':
            //if-else
            break;
        case 'message':
            var messageType = event.message.type;
            var messageId = event.message.id;
            var messageText = event.message.text;

            if (messageType == 'file') {
                var fileName = event.message.fileName;
                var fileType = fileName.split('.', 2)[1];
                var fileN = fileName.split('.', 2)[0];
                //MimeType >> https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
                if (fileType == "pdf") { var mimetype = "application/pdf"; var icon = "📄"; }
                else if (fileType == "zip") { var mimetype = "application/zip"; var icon = "🗃️"; }
                else if (fileType == "rar") { var mimetype = "application/vnd.rar"; var icon = "🗃️"; }
                else if (fileType == "7z") { var mimetype = "application/x-7z-compressed"; var icon = "🗃️"; }
                else if (fileType == "doc") { var mimetype = "application/msword"; var icon = "📄"; }
                else if (fileType == "xls") { var mimetype = "application/vnd.ms-excel"; var icon = "📄"; }
                else if (fileType == "ppt") { var mimetype = "application/vnd.ms-powerpoint"; var icon = "📄"; }
                else if (fileType == "docx") { var mimetype = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"; var icon = "📄"; }
                else if (fileType == "xlsx") { var mimetype = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"; var icon = "📄"; }
                else if (fileType == "pptx") { var mimetype = "application/vnd.openxmlformats-officedocument.presentationml.presentation"; var icon = "📄"; }
                else if (fileType == "mp4") { var mimetype = "video/mp4"; var icon = "📽️"; }
                else if (fileType == "mp3") { var mimetype = "audio/mpeg"; var icon = "🖼️"; }
                else if (fileType == "png") { var mimetype = "image/png"; var icon = "🖼️"; }
                else if (fileType == "gif") { var mimetype = "image/gif"; var icon = "🎁"; }
                else if (fileType == "jpg") { var mimetype = "image/jpeg"; var icon = "🖼️"; }
                else if (fileType == "jpeg") { var mimetype = "image/jpeg"; var icon = "🖼️"; }
                else { var mimetype = "undefined"; }

                if (mimetype !== "undefined") {
                    //Get content
                    var url = "https://api-data.line.me/v2/bot/message/" + messageId + "/content";
                    var headers = {
                        "headers": { "Authorization": "Bearer " + channelToken }
                    };
                    var getcontent = UrlFetchApp.fetch(url, headers);
                    var blob = getcontent.getBlob();
                    var fileBlob = Utilities.newBlob(blob.getBytes(), mimetype, fileN + '.' + fileType);
                    var gdfileid = DriveApp.getFolderById(gdrivefolderId).createFile(fileBlob).getId();
                    //Reply URL
                    var mess = [{ 'type': 'text', 'text': "เก็บไฟล์แล้วครับ ✅\nไฟล์ : " + fileN + " 📁\nประเภท : " + fileType + " " + icon + "\nhttps://drive.google.com/file/d/" + gdfileid + "/view" }];
                } else {
                    var mess = [{ 'type': 'text', 'text': "ไม่รองรับไฟล์ประเภทนี้" }];
                }
            }
            else if (messageType == 'text') {
                //var mess = [{'type': 'text', 'text': "Text"}];

            }
            else if (messageType == 'sticker') { }
            else if (messageType == 'image') {
                // var mType = ".jpg";
                // var meType = "image/jpeg";
                // var icon = "🖼️";
                // var x = toDrive(messageId, meType, mType, gdrivefolderImageId, channelToken, icon);
                // var mess = [{ 'type': 'text', 'text': x }];
            }
            else if (messageType == 'video') {
                var mType = ".mp4";
                var meType = "video/mp4";
                var icon = "📽️";
                var x = toDrive(messageId, meType, mType, gdrivefolderVideoId, channelToken, icon);
                var mess = [{ 'type': 'text', 'text': x }];
            }
            else if (messageType == 'audio') {
                var mType = ".mp3";
                var meType = "audio/mpeg";
                var icon = "🎵";
                var x = toDrive(messageId, meType, mType, gdrivefolderAudioId, channelToken, icon);
                var mess = [{ 'type': 'text', 'text': x }];
            }
            else if (messageType == 'location') { }
            if (mess) { replyMsg(replyToken, mess, channelToken); }
            break;
        default:
            break;
    }
}

