$(function(){
  $('#fuck').submit(function(e){
    e.preventDefault();

    $.post('/trash', {
      content: ''
    })
    .success(function(data){
      console.log('Thank you father.');
    })
    .error(function(err){
      console.error(err);
    });

    return false;
  });

  $('.modal').click(function(e){
    e.stopPropagation();
    $('.modal').addClass('open');
  });

  $(document).click(function(e){
    $('.modal').removeClass('open');
  });
});
