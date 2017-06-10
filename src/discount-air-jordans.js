$(function(){
  $('#fuck').submit(function(e){
    e.preventDefault();

    $.post('/trash', {
      content: this.content.value
    })
    .then(function(data){
      console.log('Thank you father.');
    }, function(err){
      console.error(err);
    });

    init();

    return false;
  });

  var init = function () {
    $('.content').text('<style></style>\n<div></div>\n<script></script>');
    $('.real-submit').hide();
    $('.test-cancel').hide();
  };

  init();

  $('.test-submit').click(function(e){
    $('.real-submit').show();
    $('.test-cancel').show();
    $('.test-submit').hide();

    $('.dumpster').contents().find('body').append('<div id="the-test">' + $('.content').val() + '</div>');
  });

  $('.test-cancel').click(function(e){
    $('.real-submit').hide();
    $('.test-cancel').hide();
    $('.test-submit').show();

    $('.dumpster').contents().find('#the-test').remove();
  });

  $('.icon').click(function(e){
    if ($('.modal').hasClass('open')) {
      $('.icon').text('!?');
      $('.modal').removeClass('open');
    } else {
      $('.icon').text('X');
      $('.modal').addClass('open');
    }
  });

  $.get('/trash')
  .then(function(res){
    for (var i in res) {
      $('.dumpster').contents().find('body').append(res[i].content);
    }
    $('.dumpster').contents().find('*').each(function(i, item){
      $(item).css('z-index', Math.round(Math.random() * 1000));
    });
  }, function(err){
    console.error(err);
  });
});
