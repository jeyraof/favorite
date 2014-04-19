global_pos = null;
global_end = false;

$(document).ready(function () {
  // toggle new-item form
  var $newDiv = $('.new-item');
  $('.btn-new').click(function () {
    $newDiv.toggleClass('on');
  });

  var $newForm = $newDiv.find('form');
  $('.btn-new-submit').click(function() {
    $.post(
      $newForm.data('validate'),
      $newForm.serialize(),
      function(data) {
        if (data.ok) {
          $newForm.submit();
        } else {
          alert(data.msg || 'what the hell!');
        }
      }
    )
  });
});

function callFavorites(pos) {
  var $container = $('.container');
  var url = '/favorite/list';
  if (pos) {
    url = url + '?pos=' + pos;
  }
  var dummy = [];
  var dummy_flag = false;
  $.ajax({
    url: url,
    async: false,
    success: function (data) {
      if (data.ok) {
        debug = data;
        if (data.favorites.length === 0) {
          global_end = true;
          alert('last of favorites.');
        } else {
          $.each(data.favorites, function(i, favorite) {
            var favoriteHtml = createFavoriteHtml(favorite);
            dummy.push(favoriteHtml);
            global_pos = favorite.id;
          });
        }
      } else {
        dummy_flag = true;
        alert('error happened.');
      }
    },
    dataType: 'json'
  });
  $container.append(dummy);
}

function createFavoriteHtml(data) {
  var item = document.createElement('div');
  item.className = 'item';
  item.appendChild(createThumbHtml(data));
  item.appendChild(createMetaHtml(data));
  return item;
}

function createThumbHtml(data) {
  var thumb = document.createElement('div');
  thumb.className = 'thumb';
  if (data.picture) {
    var thumb_img = document.createElement('img');
    thumb_img.setAttribute('src', data.picture);
    thumb_img.setAttribute('alt', data.title + ' - ' + data.subtitle);
    thumb.appendChild(thumb_img);
  }
  return thumb;
}

function createMetaHtml(data) {
  var meta = document.createElement('div');
  meta.className = 'meta';
  var title_container = document.createElement('h2');
  title_container.className = 'title-container';
  var anchor_title = document.createElement('a');
  anchor_title.className = 'title';
  anchor_title.setAttribute('href', '#');
  anchor_title.setAttribute('title', data.title);
  anchor_title.innerText = data.title;
  var anchor_subtitle = document.createElement('a');
  anchor_subtitle.className = 'subtitle';
  anchor_subtitle.setAttribute('href', '#');
  anchor_subtitle.setAttribute('title', data.subtitle);
  anchor_subtitle.innerText = data.subtitle;
  var paragraph_end = document.createElement('span');
  paragraph_end.className = 'paragraph-end';
  anchor_title.appendChild(paragraph_end);
  anchor_subtitle.appendChild(paragraph_end);
  title_container.appendChild(anchor_title);
  title_container.appendChild(anchor_subtitle);
  var detail_container = document.createElement('div');
  detail_container.className = 'detail-container';
  var span_uid = document.createElement('span');
  span_uid.className = 'uid';
  span_uid.innerText = data.uid;
  detail_container.appendChild(span_uid);
  meta.appendChild(title_container);
  meta.appendChild(detail_container);
  return meta;
}