<?php
$url = "https://news.google.com/news/rss/?ned=jp&hl=ja&gl=JP";
$xml = file_get_contents($url);
header("Content-type: application/xml; charset=UTF-8");
print $xml;
?>
