$(function(){
  $('#fuck').submit(function(e){
    e.preventDefault();

    $.post('/trash', {
      content: this.content.value
    }).then(function(){
      console.log('Thank you father.');
    }, function(err){
      console.error(err);
    });

    init();

    return false;
  });

  var init = function () {
    $('.content').text('<style></style>\n<div></div>\n<script></script>');
    $('.content').prop('disabled', false);
    $('.real-submit').hide();
    $('.test-cancel').hide();
  };

  init();

  $('.test-submit').click(function(e){
    $('.real-submit').show();
    $('.test-cancel').show();
    $('.test-submit').hide();
    $('.content').prop('disabled', true);

    $('.dumpster').contents().find('body').append('<div id="the-test">' + $('.content').val() + '</div>');
  });

  $('.test-cancel').click(function(e){
    $('.real-submit').hide();
    $('.test-cancel').hide();
    $('.test-submit').show();
    $('.content').prop('disabled', false);

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
    var total = Object.keys(res).length;
    var completed = 0;

    for (var i in res) {
      quarantineScripts(res[i].content, i, function (str, id, err) {
        if (err) {
          $.post('/delete', {
            id: id
          }).then(function(){
            console.log('Okay, an infinite loop really? That\'s just boring. Break shit but break it better than that.');
          }, function(err){
            console.error(err);
          });
        } else {
          $('.dumpster').contents().find('body').append(str);
        }
        if (++completed === total) {
          $('.dumpster').contents().find('*').each(function(i, item){
            $(item).css('z-index', Math.round(Math.random() * 1000));
          });
        }
      });
    }
  }, function(err){
    console.error(err);
  });

  var quarantineScripts = function (str, id, onSafe) {
    var total = 0;
    var completed = 0;
    var broken = false;
    var scripts = str.split(/<\/?script(?:\s+\w+=".+"\s*)*>/);

    for (var i = 0; i < scripts.length; i++) {
      if (i%2 && !!(scripts[i].trim())) {
        total++;
        limitEval(scripts[i], function(err){
          if (!err) {
            broken = true;
          }
          if (++completed === total) {
            onSafe(str, id, broken);
          }
        });
      }
    }

    if (total === 0) {
      onSafe(str);
    }
  };

  var limitEval = function (code, onStop, timeout) {
    var id = Math.random() + 1;
    var blob = new Blob(
        ['onmessage=function(a){a=a.data;postMessage({i:a.i+1});postMessage({r:eval.call(this,a.c),i:a.i})};'],
        { type:'text/javascript' }
      );
    var myWorker = new Worker(URL.createObjectURL(blob));

    function onDone() {
      URL.revokeObjectURL(blob);
      onStop.apply(this, arguments);
    }

    myWorker.onmessage = function (data) {
      data = data.data;
      if (data) {
        if (data.i === id) { // we're done
          id = 0;
          onDone(true, data.r);
        }
        else if (data.i === id + 1) { // the worker started
          setTimeout(function() {
            if (id) {
              myWorker.terminate();
              onDone(false);
            }
          }, timeout || 2000);
        }
      }
    };

    myWorker.postMessage({ c: 'try{' + code + '}catch(e){}', i: id });
  };
});
