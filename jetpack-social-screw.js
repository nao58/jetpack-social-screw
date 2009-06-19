(function(){
  var ss = {
    doc: null,
    changeTarget: function(url){
      var d = $(ss.doc);
      ss.showHatena(d, url);
      ss.showLivedoor(d, url);
//      ss.showFriendFeed(d, url);
    },
    createComments: function(arr){
      var html = '<ul>';
      var len = arr.length;
      var cm = 0;
      for(var i=0; i<len; ++i){
        var b = arr[i];
        if(b.comment){
          html += '<li>'+b.comment+'</li>';
          if(++cm > 5) break;
        }
      }
      html += '</ul>';
      return html;
    },
    showHatena: function(d, url){
      var cont = d.find('#show-hatena');
      cont.html('');
      $.ajax({
        type: 'get',
        dataType: 'jsonp',
        url: 'http://b.hatena.ne.jp/entry/json/',
        data: 'url='+encodeURIComponent(url),
        success: function(msg){
          if(!msg) msg={count: 0, bookmarks: {}};
          var html = '';
          html = '<div><img src="http://b.hatena.ne.jp/images/append.gif" width="16" height="12" style="vertical-align: bottom;" /> <a href="'+msg.entry_url+'" class="hatena-link" target="_blank">'+msg.count+' users</a></div>';
          if(msg.bookmarks.length) html += ss.createComments(msg.bookmarks);
          cont.html(html);
          cont.find('a').click(function(){
            jetpack.tabs.open($(this).attr('href'));
            return false;
          });
        }
      });
    },
    showLivedoor: function(d, url){
      var cont = d.find('#show-livedoor');
      cont.html('');
      $.ajax({
        type: 'get',
        dataType: 'json',
        url: 'http://api.clip.livedoor.com/json/comments',
        data: {
          link: url
        },
        success: function(msg){
          var c = [];
          if(!msg['Comments']) msg={total_clip_count: 0, Comments: []};
          var html = '<div><img src="http://clip.livedoor.com/img/bnr/16_16_white.gif" /> <a href="http://clip.livedoor.com/page/'+url+'" class="hatena-link">'+msg.total_clip_count+' users</a></div>';
          $.each(msg.Comments, function(i, d){
            c[i] = {comment: d.notes};
          });
          if(c.length) html += ss.createComments(c);
          cont.html(html);
          cont.find('a').click(function(){
            jetpack.tabs.open($(this).attr('href'));
            return false;
          });
        }
      });
    },
    showFriendFeed: function(d, url){
      $.ajax({
        type: 'get',
        dataType: 'json',
        url: 'http://friendfeed.com/api/feed/url',
        data: {
          url: url
        },
        success: function(msg){
          var html = '<div>'+msg.entries.length+'</div>';
          for(var i=0; i<msg.entries.length; ++i){
            var e = msg.entries[i];
            var s = e.service;
            if(s){
              html += '<div><img src="'+s.iconUrl+'" />'+s.name+'</div>';
            }
          }
          d.find('#show-friendfeed').html(html);
        }
      });
    }
  }
  jetpack.tabs.onFocus(function(){
    ss.changeTarget(this.url);
  });
  jetpack.tabs.onReady(function(){
    if(this.url==jetpack.tabs.focused.url){
      ss.changeTarget(this.url);
    }
  });
  jetpack.future.import('slideBar');
  jetpack.slideBar.append({
    onSelect: function(slide){
      slide({size: 200, persist: true});
      ss.doc = slide.doc;
      ss.changeTarget(jetpack.tabs.focused.url);
    },
    onReady: function(slide){
      slide.icon.src = 'http://dev.screw-axis.com/img/ss/screw-head.png';
    },
    html: <>
      <style><![CDATA[
        body {
          margin: 0;
          padding: 10px;
          font-size: 0.8em;
        }
        ul {
          margin-top: 10px;
          padding-left: 15px;
          width: 155px;
        }
        .hatena-link {
          font-weight: bold;
          color: red;
          background-color: #fcc;
          text-decoration: underline;
        }
        .block { padding-top: 20px; }
      ]]></style>
      <div id="container">
        <div class="block" id="show-hatena"> </div>
        <div class="block" id="show-livedoor"> </div>
        <div class="block" id="show-friendfeed"> </div>
      </div>
    </>
  });
})();
