// add a status bar if there are issues with any part of the site
$.getJSON('https://status.github.com/api/last-message.json', function(data) {
  if(data.status != 'good'){
    date = new Date(data.created_on)
    colors = {
      'minor': "background:#fdf5ed; color:#f29d50 !important; border-color:#f8cea7;",
      'major': "background:#f9eae5; color:#cc3300 !important; border-color:#e5997f;"
    }
    styles = "text-align:center; font:13px/1.5 \"Helvetica Neue\", Helvetica, Arial, sans-serif; padding:5px; font-weight:bold; border-bottom:1px solid;" + colors[data.status]
    message = "<div style='" + styles + "'><a href='https://status.github.com/messages' target='_blank' style='" + colors[data.status] + "'>" + data.body  + "</a><span style='padding-left:5px; color:#000;'>" + date.toUTCString() + "</span></div>"
    $('body').prepend(message)
  }
});

last_commit = $('.tree-browser-wrapper .commit-tease .js-relative-date')

last_commit_date = new Date(last_commit.attr('datetime'))

var now = new Date();

abandoned = now.setDate(now.getDate()-180); 
abandoned = new Date(abandoned)

out_of_date = abandoned.getTime() > last_commit_date.getTime()

if(out_of_date){
  message = "<strong>WARNING</strong> - This repo was last updated <strong>"+jQuery.timeago(last_commit_date)+"</strong>, it may not be actively maintained."
  $('#repo_details').attr('style','border-bottom:none;border-radius:0;margin-bottom:0;')
  $('#repo_details').after("<div style='padding:10px;border-bottom-right-radius:5px; border-bottom-left-radius:5px; background:#cc3300; color:#fff;height:auto !important;'>"+message+"</div>")
}

// check to see if the project is tested on travis-ci.org
path = $('.entry-title strong a').attr('href')
if(path){
  $.get('https://api.travis-ci.org/repos'+path, function(data, err) {
    console.log(data)
    if(data.last_build_id != null){
      statuses = {
        0: 'Passing',
        1: 'Failing',
        null: 'Building'
      }
      styles = {
        0: 'background:#339966;',
        1: 'background:#cc3300;',
        null: 'background:#f29d50;'
      }
      text = "Travis - " + statuses[data.last_build_result] + ' ' + jQuery.timeago(data.last_build_started_at)
      travis_link = '<a style="float: right;margin: -2px 0; color:#fff; text-shadow:none; border:none; '+styles[data.last_build_result]+'" class="button minibutton" href="http://travis-ci.org' + path + '">'+text+'</a>'
      $('span.name').prepend(travis_link)
    }
  });
}