global_pos = null;
global_end = false;

$(document).ready(function () {
  // toggle new-item form
  var $newDiv = $('.new-item');
  $('.btn-new').click(function () {
    $newDiv.toggleClass('on');
  });

  // new favorite
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

  // upload picture
  $('.empty > a').click(function() {
    var $imgForm = $(this).siblings('form');
    $imgForm.find('input.empty-pic').click();
  });
  $('.empty-pic').change(function() {
    var $imgForm = $(this).parents('form');
    var $thumb = $(this).parents('.thumb');
    $imgForm.ajaxSubmit({
      success: function(data) {
        if (data.ok) {
          var thumb_img = document.createElement('img');
          thumb_img.setAttribute('src', data.path);
          thumb_img.setAttribute('alt', data.favorite_title + ' - ' + data.favorite_subtitle);
          $thumb.html($(thumb_img));
        }
      }
    });
  });

  // toggle taken
  $('.summary-item.taken').click(function() {
    var span_taken = $(this);
    var item_id = span_taken.parents('.item').data('item-id');
    var url = '/favorite/' + item_id + '/taken';
    $.post(
      url,
      {},
      function(data) {
        if (data.ok) {
          span_taken.toggleClass('on');
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
  var items = [];
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
            items.push(favoriteHtml);
            global_pos = favorite.id;
          });
        }
      } else {
        alert('error happened.');
      }
    },
    dataType: 'json'
  });
  $container.append(items)
    .isotope('appended', items)
    .imagesLoaded(function() {
      $container.isotope('layout');
    })
}

function createFavoriteHtml(data) {
  var item = document.createElement('div');
  item.className = 'item';
  item.setAttribute('data-item-id', data.id);
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
  } else {
    var thumb_empty = document.createElement('div');
    thumb_empty.className = 'empty';
    var empty_anchor = document.createElement('a');
    empty_anchor.href = '#';
    var empty_icon = document.createElement('i');
    empty_icon.className = 'fa fa-picture-o';
    empty_anchor.appendChild(empty_icon);
    empty_anchor.appendChild(document.createTextNode(' Upload'));
    thumb_empty.appendChild(empty_anchor);
    thumb_empty.appendChild(createPictureFormHtml(data));
    thumb.appendChild(thumb_empty);
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
  anchor_title.href = '#';
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
  anchor_subtitle.appendChild(paragraph_end.cloneNode(true));
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
  meta.appendChild(createSummaryHtml(data));
  return meta;
}

function createPictureFormHtml(data) {
  var form = document.createElement('form');
  form.setAttribute('action', '/favorite/'+data.id+'/pic/add');
  form.setAttribute('method', 'post');
  form.setAttribute('enctype', 'multipart/form-data');
  var input_file = document.createElement('input');
  input_file.className = 'empty-pic';
  input_file.type = 'file';
  input_file.name = 'pic';
  form.appendChild(input_file);
  return form;
}

function createSummaryHtml(data) {
  var summary_container = document.createElement('div');
  summary_container.className = 'summary-container';
  var span_picture = document.createElement('span');
  span_picture.className = 'summary-item picture';
  var picture_fa = document.createElement('i');
  picture_fa.className = 'fa fa-picture-o';
  span_picture.appendChild(picture_fa);
  span_picture.appendChild(document.createTextNode(' '+data.picture_count));
  var span_url = document.createElement('span');
  span_url.className = 'summary-item url';
  var url_fa = document.createElement('i');
  url_fa.className = 'fa fa-link';
  span_url.appendChild(url_fa);
  span_url.appendChild(document.createTextNode(' '+data.url_count));
  var span_taken = document.createElement('span');
  var taken_fa = document.createElement('i');
  if (data.taken)
    span_taken.className = 'summary-item taken on';
  else
    span_taken.className = 'summary-item taken';
  taken_fa.className = 'fa fa-check-circle-o';
  span_taken.appendChild(taken_fa);summary_container.appendChild(span_picture);
  summary_container.appendChild(span_url);
  summary_container.appendChild(span_taken);
  return summary_container;
}