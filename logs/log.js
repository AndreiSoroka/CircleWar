console.log();
function say(text){
  console.log( datatime() + text);
}

function datatime(){
  var d = new Date();
  var curr = {
    date : d.getDate().toString(),
    month : (d.getMonth() + 1).toString(),
    year : d.getFullYear().toString(),
    hours : d.getHours().toString(),
    minutes : d.getMinutes().toString(),
    seconds : d.getSeconds().toString(),
  }
  
  if (curr.date.length<2)  curr.date='0'+curr.date;
  if (curr.month.length<2)  curr.month='0'+curr.month;
  if (curr.hours.length<2)  curr.hours='0'+curr.hours;
  if (curr.minutes.length<2)  curr.minutes='0'+curr.minutes;
  if (curr.seconds.length<2)  curr.seconds='0'+curr.seconds;
  
  return curr.year + "-" + curr.month + "-" + curr.date + ' ' + curr.hours + ':' + curr.minutes + ':' + curr.seconds + ' > ';
}

exports.say=say;