var room = {
    rooms : [],
    room_ids : [],
    newRoom:function(name){
        var rid = Math.random().toString(16).slice(2);
        while(this.room_ids.indexOf(rid) > -1){
            rid = Math.random().toString(16).slice(2);
        }
        return {
            name   : name,
            id     : rid,
            user_list   : []
        };
    },
    createRoom:function(name){
        var r = this.newRoom(name);
        this.rooms.push(r);
        this.room_ids.push(r.id);

        return this.rooms[this.rooms.length - 1];
    },
    removeRoom_byID:function(rid){
        var toremove = this.findRoomByID(rid);

        if(toremove === null)   return;

        this.rooms.splice(this.rooms.indexOf(toremove), 1);
        this.room_ids.splice(this.room_ids.indexOf(toremove.id), 1);
    },
    removeRoom_byName:function(rname){
        var toremove = this.findRoomByName(rname);

        if(toremove === null)   return;

        this.rooms.splice(this.rooms.indexOf(toremove), 1);
        this.room_ids.splice(this.room_ids.indexOf(toremove.id), 1);
    },
    findRoomByName:function(rname){
        var r = null;
        for(var i in this.rooms){
            if(this.rooms[i].name == rname){
                r = this.rooms[i];
                break;
            }
        }
        return r;
    },
    findRoomByID:function(rid){
        var r = null;
        for(var i in this.rooms){
            if(this.rooms[i].id == rid){
                r = this.rooms[i];
                break;
            }
        }
        return r;
    },
    userJoinRoom:function(socket, roomname){
        var room = this.findRoomByName(roomname);
        if(room === null){
            room = this.createRoom(roomname);
        }

        if(room.user_list.indexOf(socket.id) > -1){
            //USER ALREADY IN ROOM
            // console.log("USER "+socket.id+" ALREADY IN ROOM " + room.id);
        }else{
            room.user_list.push(socket.id);
        }
    },
    userLeave:function(socket){
        for(var i in this.rooms){
            if(this.rooms[i].user_list.indexOf(socket.id) > -1){
                this.rooms[i].user_list.splice(this.rooms[i].user_list.indexOf(socket.id),1);
            }
        }
        this.removeEmptyRooms();
    },
    userLeaveRoom_byName:function(socket, roomname){
        var room = this.findRoomByName(roomname);
        if(room === null) return;

        room.user_list.splice(room.user_list.indexOf(socket.id), 1);
        this.removeEmptyRooms();
    },
    userLeaveRoom_byID:function(socket, rid){
        var room = this.findRoomByID(rid);
        if(room === null) return;

        room.user_list.splice(room.user_list.indexOf(socket.id), 1);
        this.removeEmptyRooms();
    },
    removeEmptyRooms:function(){
        for(var i in this.rooms){
            if(this.rooms[i].user_list.length <= 0){
                this.room_ids.splice(this.room_ids.indexOf(this.rooms[i].id),1);
                this.rooms.splice(i,1);
            }
        }
    },
    emitInRoom:function(io, roomname, ev, msg){
        var room = this.findRoomByName(roomname);
        if(room === null) return;

        for(var i in room.user_list){
            console.log("EMITING");
            io.to(room.user_list[i]).emit(ev,msg);
        }
    }
};

module.exports = room;
