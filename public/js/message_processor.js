function __processmessage(msg){
	//LINK PROCESS
	var last_pos = 0;
	var timeout = 0;
	var newmsg = msg;
	while(last_pos < msg.length){
		console.log(last_pos);
		timeout++;
		if(timeout > 10){
			break;
		}
		if(msg.indexOf("http", last_pos) > -1 || msg.indexOf("www", last_pos) > -1){
			var h = msg.indexOf('http', last_pos);
			var w = msg.indexOf('www', last_pos);
			var start = 0;
			if(h != -1){
				if(w != -1){
					start = h < w ? h : w;
				}else{
					start = h;
				}
			}else{
				start = w;
			}
			var end = msg.indexOf(" ",start) != -1 ? msg.indexOf(" ",start) : msg.length;
			var __link = msg.substr(start, end-start);
			var __formatted = "";
			if(__link.indexOf(".jpg") > -1 || __link.indexOf(".gif") > -1 || __link.indexOf(".png") > -1 || __link.indexOf(".bmp") > -1){
				__formatted = "<a href='"+__link+"' target='blank'><img src='"+__link+"' style='max-width:100px; max-height:100px;'/></a>";
			}
			else{
				__formatted = "<a href='"+__link+"' target='_blank'>"+__link+"</a>";
			}
			console.log(__formatted);
			newmsg = newmsg.replace(__link, __formatted);		
			last_pos = end;
			continue;
		}

		last_pos = msg.length;
	}



	//END
	return newmsg;
}

