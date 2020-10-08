$(function() {
	var $reloadButton=$('#lastBuildDate .reload');
	//更新ボタン
	$reloadButton.on('click',function(){
		getNews('rss.php?ver=' + new Date().getTime());
	});

	getNews('rss.php?ver=' + new Date().getTime());

	getCalendar();
});

(function($) {
	//プラグイン定義
	$.fn.linkBox = function( options ) {
		//引数を設定する
		var defaults = {
			//データを初期化
			data: {}
		};
		//引数をマージ
		var setting = $.extend(defaults, options);
		var $this = $(this);

		$.each( $this, function( key, dom ) {
			var $box = $( dom );
			$.each( setting.data, function( key, val ) {
				var title = (val.title) ? val.title : key;
				var html = '<a target="_blank" href="' + val.url + '">'
					+ '<img src="img/' + val.img + '" title="' + title + '" />'
					+ '</a>';
				$box.append( html );
			});
		} );

		//メソッドチェーン対応(thisを返す)
		return(this);
	};
})(jQuery);

//取得したDateを変形
function formatDate(string_pubDate){
  var dt=new Date(string_pubDate);
  var year=dt.getFullYear();
  var month=('00'+(dt.getMonth()+1)).slice(-2);
  var date=('00'+dt.getDate()).slice(-2);
  var hours=('00'+dt.getHours()).slice(-2);
  var minutes=('00'+dt.getMinutes()).slice(-2);

  return year+'.'+month+'.'+date+'-'+hours+':'+minutes;
}

function getNews(url){
	$.ajax({
		url: url,
		xmlType: 'xml',
		success: function(xml) {
			var row = 0;
			var data = [];
			var nodeName;
			var $output = $('#news .newsText');
			var $lastBuildText=$('#lastBuildDate .dateText');

			$(xml).find('item').each(function() {
				data[row] = {};
				$(this).children().each(function() {
						nodeName = $(this)[0].nodeName;
						data[row][nodeName] = {};
						attributes = $(this)[0].attributes;
						for (var i in attributes) {
						data[row][nodeName][attributes[i].name] = attributes[i].value;
						}
					data[row][nodeName]['text'] = $(this).text();
				});
				row++;
			});

			$output.empty();
			$output.wrapInner('<ul></ul>');

			$lastBuildText.empty();
			//最新の更新日時
			$lastBuildText.append('<p>'+formatDate($(xml).find('lastBuildDate').text())+'</p>');

			//ニュースタイトル表示
			for (i in data) {
				$output.find('ul').append('<a href="' + data[i].link.text + '">' + data[i].title.text +"　"+ formatDate(data[i].pubDate.text) + '</a><br>');
			}
				}
		});
}
