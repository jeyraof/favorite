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
          alert(data.msg || '에러가 발생했습니다. 관리자에게 문의해 주세요.');
        }
      }
    )
  });
});