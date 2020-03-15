
<?php
$allview = file_get_contents("log/allview.log");
$allview = (int)$allview + 1;
$allview_file = fopen("log/allview.log", "w");
fwrite($allview_file, $allview);
fclose($allview_file);

if (!empty($_GET["app"])) {
    $appview = file_get_contents("log/appview.log");
    $appview = (int)$appview + 1;
    $appview_file = fopen("log/appview.log", "w");
    fwrite($appview_file, $appview);
    fclose($appview_file);
}

$set_ = FALSE;
if (!empty($_GET["setting"])) {
    if ($_GET["setting"] == 1) {
        $set_ = TRUE;
    }
}

if (!empty($_COOKIE['saved'])) {
    if ($set_ != TRUE) {
        header('Location: main.php'.$_COOKIE['saved']);
        exit;
    }
}

function w_log() {
    if (isset($_SERVER["HTTP_CF_CONNECTING_IP"])) {
        $_SERVER['REMOTE_ADDR'] = $_SERVER["HTTP_CF_CONNECTING_IP"];
      }
    
      $http_host = $_SERVER['HTTP_HOST'];
      $request_uri = $_SERVER['REQUEST_URI'];
      $url_ = 'http://' . $http_host . $request_uri;

    $log_file = fopen("log/all.log", "a");
    $log_txt = "[ ".date("Y-m-d h:i:s")." ] WHERE : ".$url_." IP : ".$_SERVER["REMOTE_ADDR"]."\n";
    fwrite($log_file, $log_txt);
    fclose($log_file);
}

w_log();
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>내일뭐함</title>
    <link rel="stylesheet" type="text/css" href="./css/welcome.css">
    <link rel="shortcut icon" href="favicon.ico">
    <!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-158793073-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-158793073-1');
</script>

</head>
<body>
    <h1><img src="logo_white.png" class="main_logo" alt="로고"><br>내일뭐함</h1><br>
    <p>전국 모든 학생을 위한 시간표, 급식표 확인 앱</p><br>
        <div class="item">
            <input type="button" value="학교 찾으러 가기" onclick="location.href='school.php'"><br>
            <?php
                if (empty($_GET["app"])) {
                    echo "<p><a href='https://play.google.com/store/apps/details?id=com.hyuns.whatto'>내일뭐함 앱 출시! (플레이스토어 바로가기)</a></p>";
                }
            ?>
        </div>
        
    </div>

</body>
</html>