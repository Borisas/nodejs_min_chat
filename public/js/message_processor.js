function __processmessage(msg){
	
	var last_pos = 0;
	var timeout = 0;
	var newmsg = msg;
	while(last_pos < msg.length){
		console.log(last_pos);
		timeout++;
		if(timeout > 500){
			break;
		}
		//LINK PROCESS
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

			//SEPERATE IF TWO LINKS W/O SPACE
			if(msg.indexOf("http",start+"http".length) > -1 || msg.indexOf("www", start+"www".length) > -1){
				var s2h = msg.indexOf("http",start+"http".length);
				var s2w = msg.indexOf("www", start+"www".length);
				s2h = s2h == -1 ? end : s2h;
				s2w = s2w == -1 ? end : s2w;
				if(s2h < end || s2w < end){
					if(s2h <= s2w && s2h != -1){
						end = s2h;
					}
					else if(s2w <= s2h && s2w != -1 && s2w > start + "https://".length){
						end = s2w;
					}
				}
			}
			//--------

			var __link = msg.substr(start, end-start);
			var gotolink = __link;
			//ADD HTTP
			if(start == w){
				gotolink = "http://"+gotolink;
			}
			//-------



			var __formatted = "";
			//TRY IMAGE
			if(__link.indexOf(".jpg") > -1 || __link.indexOf(".gif") > -1 || __link.indexOf(".png") > -1 || __link.indexOf(".bmp") > -1){
				__formatted = "<a href='"+gotolink+"' target='blank'><img src='"+gotolink+"' style='max-width:100px; max-height:100px;'/></a>";
			}
			else{
				__formatted = "<a href='"+gotolink+"' target='_blank'>"+__link+"</a>";
			}
			//-----


			newmsg = newmsg.replace(__link, __formatted);		
			last_pos = end;
			continue;
		}

		last_pos = msg.length;
	}



	//END
	return newmsg;
}

