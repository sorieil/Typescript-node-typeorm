var http = require("src/Https");

var time = [
    '10:10',
    '11:43',
    '12:50',
    '13:10',
    '14:49',
    '15:23',
    '16:24',
    '17:18',
    '18:30',
    '19:30',
    '20:00',
    '21:20',
    '22:30'
];

var i = 0;

setInterval(function (){
    var options = {
        "method": "POST",
        "hostname": "us-central1-tablelab-dev-48bae.cloudfunctions.net",
        "port": null,
        "path": "/reservation/",
        "headers": {
            "authorization": "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjY5MGRkNjFlNTNjYTY3MDA4NjY3OGFmMmMzNzhkODc5MjJhZDAwYzAifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdGFibGVsYWItZGV2LTQ4YmFlIiwiYXVkIjoidGFibGVsYWItZGV2LTQ4YmFlIiwiYXV0aF90aW1lIjoxNDkyNDAwMDE0LCJ1c2VyX2lkIjoiVjVRUWJFdXQ2cVRWRGQxbDdYaHdTbE0yQ1RVMiIsInN1YiI6IlY1UVFiRXV0NnFUVkRkMWw3WGh3U2xNMkNUVTIiLCJpYXQiOjE0OTM3OTg2MzEsImV4cCI6MTQ5MzgwMjIzMSwiZW1haWwiOiJqaGtpbUBtZWFsYW50LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJqaGtpbUBtZWFsYW50LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.epL3R4Q7EU0OHMQnKksoz3dvBZ1BRPOYeRQSOxPfxg5Q-xNzvBOyoV04WbznVowyrR-eo8w540jcFhqDxHEPgKuztwj1xJirs1vgM1tQdkZXbfuK_kfDy8FUYo-cVmkKJKJvm6juiF1Zgf3l4dkrD2iuKFuifPndCiDXuE83eI7tPQSnfoYMtGCJm60SENnDO5QJapAfZWWxCkPMOazOwI4nqwULU-ruuGCTnTMuk-PDlyMkJYnX5oOyRGQwDtNb7bGjQbsoObt3C2XH1qtLgxML8rfxqJLa2Mkz639um_hRkREd4DyiDZDssJ0roo-vVN2R5MmAuEqAfD9Fy8FuEw",
            "content-type": "application/json",
            "cache-control": "no-cache",
            "postman-token": "c3854966-e49f-405b-5e2f-11db028a6189"
        }
    };

    var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
        });
    });
    req.write(JSON.stringify({ date: '2017-07-05',
    restaurantHash: '-KhVm9PIDmx0QrhBup7w',
    time: time[i],
    from: '재혁',
    guestDetail:
        { guestName: '예약자 재혁',
            guestHash: '재혁해쉬',
            guestPhoneNumber: '010-2222-2222',
            guestMemo: '저는 vip 입니다 잘해 주십시오!.' },
    baseImageObject: [ { '1': 2 }, { '1': 4 } ],
    floor: 0 }));
    req.end();
    i++;
}, 100);




