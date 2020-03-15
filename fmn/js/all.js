function in_click() {
    $(".info").removeClass("k_info");
    $(".info_back").removeClass("k_info_back");
    $(".list").addClass("k_list");
    $(".t_b").text("| 지도")
    $(".memu_out").addClass("k_list_d");
    $(".memu_info").removeClass("k_x");
}

function onKeyDown() {
    if (event.keyCode == 13) {
        $(".info").removeClass("k_info");
        $(".info_back").removeClass("k_info_back");
        $(".list").addClass("k_list");
        $(".t_b").text("| 지도")
        $(".memu_out").addClass("k_list_d");
        $(".memu_info").removeClass("k_x");
        // search($('#search').val());
    }
}


function getlist() {
    $('#cardlist').text("");
    for (var i = 0; i < info.length; i++) {

        if (info[i].name.indexOf($('#search').val()) != -1) {
            if (info[i].remain_stat == "plenty") {
                var stat = "100개 이상";
            } else if (info[i].remain_stat == "some") {
                var stat = "30개 이상";
            } else if (info[i].remain_stat == "few") {
                var stat = "30개 미만";
            } else if (info[i].remain_stat == "break") {
                var stat = "판매중지";
            } else if (info[i].remain_stat == "empty") {
                var stat = "매진";
            }

            if (!info[i].stock_at) {
                info[i].stock_at = "정보없음";
            }

            if (!info[i].create_at) {
                info[i].create_at = "정보없음";
            }

            if (!info[i].remain_stat) {
                info[i].remain_stat = "정보없음";
            }

            // $('.cardlist').append('<div class="searchedbox"><h1>'+info[i].name+'</h1><p class="graytext">남은 마스크</p><h2>'+exbginfo[i]+'</h2></div>');
            $('#cardlist').append(`<div class='card'>
        <h2 class="c_title">
        ${info[i].name}
        </h2>
        <p class="m_label">${info[i].addr}</p>	
        <br>
        <div class="c_b">
            <div class="c_b_count_label">남은 수량</div>
            <div class="c_b_count">${stat}</div>
        </div>
        <div class="c_b">
            <div class="c_b_time_label">입고 시간</div>
            <div class="c_b_time">${info[i].stock_at}</div>
        </div>
        <br>
        <div class="c_b_label">(남은 수량은 현재 재고량과 다를 수 있습니다.)</div>
    </div>`);
        }
    }
}

var info = new Array();

function getLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            makemap(position.coords.latitude, position.coords.longitude);
        }, function (error) {
            makemap(37.587006, 126.993465);
        });
    } else {
        makemap(37.587006, 126.993465);
    }
}

getLocation();

var mark0 = '/mark/none.png',
    mark1 = '/mark/red.png',
    mark2 = '/mark/yellow.png',
    mark3 = '/mark/green.png',
    user = '/mark/user.png',
    markerImageSize = new kakao.maps.Size(26, 40), // 마커 이미지의 크기
    markerImageOptions = {
        offset: new kakao.maps.Point(13, 40) // 마커 좌표에 일치시킬 이미지 안의 좌표
    },
    markerImageSizeuser = new kakao.maps.Size(16, 16), // 마커 이미지의 크기
    markerImageOptionsuser = {
        offset: new kakao.maps.Point(8, 8) // 마커 좌표에 일치시킬 이미지 안의 좌표
    };

function makemap(lat, lng) {
    var m = 3000;
    var markck = new Array(1, 1, 1, 1);
    var count = 0;
    var nowtitle;
    var nowlat, nowlng;
    $('#map').text("");
    const markers = []
    var container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
    var options = { //지도를 생성할 때 필요한 기본 옵션
        center: new kakao.maps.LatLng(lat, lng), //지도의 중심좌표.
        level: 5 //지도의 레벨(확대, 축소 정도)
    };

    var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
    kakao.maps.event.addListener(map, 'dragend', ref);
    kakao.maps.event.addListener(map, 'zoom_changed', ref);

    $(window).resize(function () {
        ref();
    });

    function clearMark() {
        markers.forEach((m) => {
            m.setMap(null)
        })
        $('#maker').remove();
    }

    $('.infoviwer').slideUp(500);

    function ref() {
        // 지도 중심좌표를 얻어옵니다 
        n_start = new Date().getTime();
        getlist()
        var latlng = map.getCenter();
        var circle = new kakao.maps.Circle({
            center: new kakao.maps.LatLng(latlng.getLat(), latlng.getLng()),
            radius: m,
            strokeWeight: 3,
            strokeColor: '#75B8FA',
            strokeOpacity: 1,
            strokeStyle: 'solid',
            fillColor: '#CFE7FF',
            fillOpacity: 0
        });
        markers.push(circle);



        /*var mark = new kakao.maps.MarkerImage(user, markerImageSizeuser, markerImageOptionsuser);
        var markerPosition  = new kakao.maps.LatLng(latlng.getLat(), latlng.getLng());
        var marker = new kakao.maps.Marker({
            position: markerPosition,
            image: mark
        });
        markers.push(marker)*/

        $('.loading').show(0);

        clearMark();

        /*var markerPosition  = new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var mark = new kakao.maps.MarkerImage(user, markerImageSizeuser, markerImageOptionsuser);
        var marker = new kakao.maps.Marker({
            position: markerPosition,
            image: mark
        });
        marker.setMap(map);*/

        circle.setMap(map);
        //marker.setMap(map);
        count = 0;


        fetch('https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json?m=' + m + '&lat=' + latlng.getLat() + '&lng=' + latlng.getLng())
            .then((res) => {
                $('.loading').hide(0);
                return res.json()
            })
            .then((json) => {
                json.stores.forEach((e) => {
                    var a, b, zindex;
                    info[count] = e;
                    count++;
                    switch (e.remain_stat) {
                        case 'plenty': {
                            sminfo = '100+'
                            bginfo = '100개 이상'
                            code = '0'
                            color = '#47c98f'
                            zindex = '10'
                            break
                        }

                        case 'some': {
                            sminfo = '100-'
                            bginfo = '30~100개'
                            code = '1'
                            color = '#eb922d'
                            zindex = '9'
                            break
                        }

                        case 'few': {
                            sminfo = '30-'
                            bginfo = '1~30개'
                            code = '2'
                            color = '#f66366'
                            zindex = '8'
                            break
                        }

                        case 'empty': {
                            sminfo = '0'
                            bginfo = '재고없음'
                            code = '3'
                            color = '#b8b8b8'
                            zindex = '7'
                            break
                        }

                        case 'break': {
                            sminfo = '판매종료'
                            bginfo = '판매종료'
                            code = '4'
                            zindex = '6'
                            color = '#'
                            break
                        }

                        default: {
                            sminfo = '정보없음'
                            bginfo = '정보없음'
                            code = '404'
                            code = '5'
                            color = '#'
                            break
                        }
                    }


                    if (markck[code] == 1) {
                        /*var markerPosition  = new kakao.maps.LatLng(e.lat, e.lng);

                        var marker = new kakao.maps.Marker({
                            position: markerPosition,
                            image: mark
                        });

                        markers.push(marker)

                        marker.setMap(map);*/

                        /*var iwContent = '<div style="padding:5px;"><h3 style="color:' + b + ';">' + a + '</h3>' + e.name + '<br />' + e.addr + '</div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
                            iwRemoveable = true;

                        var infowindow = new kakao.maps.InfoWindow({
                            content : iwContent,
                            removable : iwRemoveable
                        });*/

                        var custommaker = new kakao.maps.CustomOverlay({
                            map: map,
                            content: '<div style="background-color:' + color + '; width : 3rem; font-size: 0.9rem ; height: 1.4rem; text-align: center; border-radius:10px; color: white;" class="maker" id="makerkey' + count + '">' + sminfo + '</div>',
                            position: new kakao.maps.LatLng(e.lat, e.lng), // 커스텀 오버레이를 표시할 좌표
                            xAnchor: -0.5, // 컨텐츠의 x 위치
                            yAnchor: -0.5 // 컨텐츠의 y 위치
                        });

                        // getlist()


                        markers.push(custommaker);

                        $('#makerkey' + count).click(function () {
                            $(".memu_out").addClass("k_slide");
                            $(".m_icon").addClass("k_rotate");

                            nowtitle = e.name;
                            nowlat = e.lat;
                            nowlng = e.lng;

                            $('#remask').text(bginfo);
                            $('#rename').text(e.name);
                            $("#pop_addr").text(e.addr);
                            $("#pop_addr").addClass("gogo");
                            $('.infoviwer').slideDown(500);

                            if (b != 404) {
                                $('#retime').html(e.stock_at.slice(0, 10) + "<br>" + e.stock_at.slice(11, 19) + " 입고");
                                $('#reupdate').text(e.created_at);
                            } else {
                                $('#retime').text("정보 없음");
                                $('#reupdate').text("정보 없음");
                            }
                            if (e.type == 01) {
                                //alert("약국");
                                $('#retype').text("약국");
                            } else if (e.type == 02) {
                                //alert("우체국");
                                $('#retype').text("우체국");
                            } else if (e.type == 03) {
                                //alert("농협");
                                $('#retype').text("농협");
                            }

                            $(".t_b").text("| 목록")

                            $(".memu_out").removeClass("k_list_d");
                            $(".memu_info").removeClass("k_x");
                            $(".list").removeClass("k_list");
                        })
                    }
                })
            })

        elapsed = new Date().getTime() - n_start;
        console.log("로딩 시간 : " + elapsed);
        if (parseInt(elapsed) >= 200) {
            console.log("다음 범위 : 2000");
            m = 2000;
        } else {
            console.log("다음 범위 : 3000");
            m = 3000;
        }



    }
    $('.simpleitem0').click(function () {
        if (markck[0] == 1) {
            markck[0] = 0;
            $('.simpleitem0').removeClass('simpleitemsel');
        } else {
            markck[0] = 1;
            $('.simpleitem0').addClass('simpleitemsel');
        }
        ref();
    });
    $('.simpleitem1').click(function () {
        if (markck[1] == 1) {
            markck[1] = 0;
            $('.simpleitem1').removeClass('simpleitemsel');
        } else {
            markck[1] = 1;
            $('.simpleitem1').addClass('simpleitemsel');
        }
        ref();
    });
    $('.simpleitem2').click(function () {
        if (markck[2] == 1) {
            markck[2] = 0;
            $('.simpleitem2').removeClass('simpleitemsel');
        } else {
            markck[2] = 1;
            $('.simpleitem2').addClass('simpleitemsel');
        }
        ref();
    });
    $('.simpleitem3').click(function () {
        if (markck[3] == 1) {
            markck[3] = 0;
            $('.simpleitem3').removeClass('simpleitemsel');
        } else {
            markck[3] = 1;
            $('.simpleitem3').addClass('simpleitemsel');
        }
        ref();
    });

    $('#sizeup').click(function () {
        if (m < 5000) {
            m = m + 250;
            $('#sizeinfo').text(m + "m");
            ref();
        } else {
            $('.alert').text("반경 최대값은 5000m입니다.");
            alertsh();
        }
    });
    $('#sizedown').click(function () {
        if (m > 250) {
            m = m - 250;
            $('#sizeinfo').text(m + "m");
            ref();
        } else {
            $('.alert').text("반경 최소값은 250m입니다.");
            alertsh();
        }
    })

    $('.gogo').click(function () {
        window.open('https://map.kakao.com/link/to/' + nowtitle + ',' + nowlat + ',' + nowlng);
    });
    $('.close').click(function () {
        $('.infoviwer').slideUp(500);
    });

    $('.alert').hide();

    function alertsh() {
        $('.alert').fadeIn(200);
        setTimeout(function () {
            $('.alert').fadeOut(200);
        }, 800);
    }

    $('.listview').click(function () {
        $('.listviewer').fadeIn(200);
    });
    ref();
}

$(".t_b").click(function () {
    getlist()
});
$("#search").click(function () {
    getlist()
});

$('#search').keydown(function (key) {
    if (key.keyCode == 13) {
        $('#cardlist').text("");
        for (var i = 0; i < info.length; i++) {
            if (info[i].name.indexOf($('#search').val()) != -1) {
                if (info[i].remain_stat == "plenty") {
                    var stat = "100개 이상";
                } else if (info[i].remain_stat == "some") {
                    var stat = "30개 이상";
                } else if (info[i].remain_stat == "few") {
                    var stat = "30개 미만";
                } else if (info[i].remain_stat == "break") {
                    var stat = "판매중지";
                } else if (info[i].remain_stat == "empty") {
                    var stat = "매진";
                }

                if (!info[i].stock_at) {
                    info[i].stock_at = "정보없음";
                }

                if (!info[i].create_at) {
                    info[i].create_at = "정보없음";
                }

                if (!info[i].remain_stat) {
                    info[i].remain_stat = "정보없음";
                }

                // $('.cardlist').append('<div class="searchedbox"><h1>'+info[i].name+'</h1><p class="graytext">남은 마스크</p><h2>'+exbginfo[i]+'</h2></div>');
                $('#cardlist').append(`<div class='card'>
                    <h2 class="c_title">
                    ${info[i].name}
                    </h2>
                    <p class="m_label">${info[i].addr}</p>	
                    <br>
                    <div class="c_b">
                        <div class="c_b_count_label">남은 수량</div>
                        <div class="c_b_count">${stat}</div>
                    </div>
                    <div class="c_b">
                        <div class="c_b_time_label">입고 시간</div>
                        <div class="c_b_time">${info[i].stock_at}</div>
                    </div>
                    <br>
                    <div class="c_b_label">(남은 수량은 현재 재고량과 다를 수 있습니다.)</div>
                </div>`);
            }
        }
    }
});

var today = new Date();
var y = today.getFullYear();
var last_y = String(y).slice(3, 4);
var week = new Array('일', '월', '화', '수', '목', '금', '토');
var date = today.getDay();


if (date === 0) {
    var echo1 = "끝자리 상관 없는 날 (" + week[today.getDay()] + ")";
} else if (date === 1) {
    var echo1 = '오늘은 출생년도 끝자리 1,6 (' + week[today.getDay()] + ")";
} else if (date === 2) {
    var echo1 = '오늘은 출생년도 끝자리 2,7 (' + week[today.getDay()] + ")";
} else if (date === 3) {
    var echo1 = '오늘은 출생년도 끝자리 3,8 (' + week[today.getDay()] + ")";
} else if (date === 4) {
    var echo1 = '오늘의 끝자리 4,9 (' + week[today.getDay()] + ")";
} else if (date === 5) {
    var echo1 = '오늘의 끝자리 5,0 (' + week[today.getDay()] + ")";
} else if (date === 6) {
    var echo1 = '끝자리 상관 없는 날';
}

$("#search").attr("placeholder", echo1);

$(".m_icon").click(function () {
    if ($("#rename").text() != "판매처를 선택하세요") {
        $(".memu_out").toggleClass("k_slide");
        $(".m_icon").toggleClass("k_rotate");
    }
});

$(".memu").click(function () {
    if ($("#rename").text() != "판매처를 선택하세요") {
        $(".memu_out").toggleClass("k_slide");
        $(".m_icon").toggleClass("k_rotate");
    }
});


$(".t_b").click(function () {
    $(".info").removeClass("k_info");
    $(".info_back").removeClass("k_info_back");
    $(".list").toggleClass("k_list");

    $(".memu_info").removeClass("k_x");

    if ($(".t_b").text() == "| 목록") {
        $(".memu_out").addClass("k_list_d");
        $(".t_b").text("| 지도")

    } else {
        $(".t_b").text("| 목록");
        $(".memu_out").removeClass("k_list_d");
    }
});

$(".memu_info").click(function () {
    $(".memu_out").addClass("k_list_d");
    $(".info").addClass("k_info");
    $(".info_back").addClass("k_info_back");
    $(".memu_info").addClass("k_x");
    // $(".memu_info").css("margin-right", "-4rem;")
    $(".list").removeClass("k_list");
});

$(".info_back").click(function () {
    $(".info").removeClass("k_info");
    $(".info_back").removeClass("k_info_back");
    $(".memu_out").removeClass("k_list_d");
    $(".memu_info").removeClass("k_x");
    $(".memu_info").css("margin-right", "0rem;")
});