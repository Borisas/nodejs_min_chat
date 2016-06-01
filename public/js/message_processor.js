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
			if(isIMG(__link)){
				__formatted = "<a href='"+gotolink+"' target='blank'><img src='"+gotolink+"' style='max-width:100px; max-height:100px;'/></a>";
			}
			else{
				__formatted = "<a href='"+gotolink+"' target='_blank'>"+__link+"</a>";
			}
			//-----
			if(isURL(__link)){
				newmsg = newmsg.replace(__link, __formatted);
			}		
			last_pos = end;
			continue;
		}

		last_pos = msg.length;
	}



	//END
	return newmsg;
}

//EXT
function isURL(str) {
	var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
	'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
	'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
	'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
	'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
	'(\\#[-a-z\\d_]*)?$','i'); // fragment locator
	return pattern.test(str);
}
function isIMG(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}
