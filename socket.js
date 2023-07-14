

let sockets=(io)=>{
    let users=[];
    io.on('connection', (socket)=>{
        socket.on('join-user',(userId)=>{
            users.push({userId,socketId:socket.id});
            io.emit('user left',userId);
        });
        socket.on('disconnect', ()=>{
            users=users.filter((user)=>{user.socketId !== socket.id});
            let user=users.filter((user)=>{user.socketId === socket.id});
            io.emit('user left',user.userId);
        });
        // >= {user,post};
        socket.on('new-post',(data)=>{
            let followers=[data.user._id,...data.user.followers];
            let clients=users.filter((user)=>{return followers.includes(user);});
            if(clients.length>0){
                clients.forEach((client)=>{
                    io.to(client.socketId).emit('new-post-added',data)
                });
            };
        });
        // >= {user,comment};
        socket.on('new-comment',(data)=>{
            let followers=[data.user._id,...data.user.followers];
            let clients=users.filter((user)=>{return followers.includes(user);});
            if(clients.length>0){
                clients.forEach((client)=>{
                    io.to(client.socketId).emit('new-comment-added',data)
                });
            };
        });
        // >= {user,comment};
        socket.on('like-comment',(data)=>{
            let followers=[data.user._id,...data.user.followers];
            let clients=users.filter((user)=>{return followers.includes(user);});
            if(clients.length>0){
                clients.forEach((client)=>{
                    io.to(client.socketId).emit('like-comment-added',data)
                });
            };
        });
        // >= {user,comment};
        socket.on('unlike-comment',(data)=>{
            let followers=[data.user._id,...data.user.followers];
            let clients=users.filter((user)=>{return followers.includes(user);});
            if(clients.length>0){
                clients.forEach((client)=>{
                    io.to(client.socketId).emit('like-comment-removed',data)
                });
            };
        });
        // >= {user,post};
        socket.on('like-post',(data)=>{
            let followers=[data.user._id,...data.user.followers];
            let clients=users.filter((user)=>{return followers.includes(user);});
            if(clients.length>0){
                clients.forEach((client)=>{
                    io.to(client.socketId).emit('like-post-added',data)
                });
            };
        });
        // >= {user,post};
        socket.on('unlike-post',(data)=>{
            let followers=[data.user._id,...data.user.followers];
            let clients=users.filter((user)=>{return followers.includes(user);});
            if(clients.length>0){
                clients.forEach((client)=>{
                    io.to(client.socketId).emit('like-post-removed',data)
                });
            };
        });
        // >= {userId};
        socket.on('add-friend',(data)=>{
            let client=users.filter((user)=>{return user.userId=data.userId;});
            let user=users.filter((user)=>{return user.socketId=socket.id;});
            data.userId=user.userId;
            io.to(client.socketId).emit('friend-added',data)
        });
        // >= {userId};
        socket.on('remove-friend',(data)=>{
            let client=users.filter((user)=>{return user.userId=data.userId;});
            let user=users.filter((user)=>{return user.socketId=socket.id;});
            data.userId=user.userId;
            io.to(client.socketId).emit('friend-removed',data)
        });
        // >={chat,message};
        socket.on('send-messages',(data)=>{
            let members=[...data.chat.members];
            let clients=users.filter((user)=>{return members.includes(user);});
            if(clients.length>0){
                clients.forEach((client)=>{
                    io.to(client.socketId).emit('get-message',data);
                    io.to(client.socketId).emit('get-notification',data);
                });
            };
        });
        // >= {user,comment};
        socket.on('remove-comment',(data)=>{
            let followers=[data.user._id,...data.user.followers];
            let clients=users.filter((user)=>{return followers.includes(user);});
            if(clients.length>0){
                clients.forEach((client)=>{
                    io.to(client.socketId).emit('comment-removed',data)
                });
            };
        });
        // >= {user,post};
        socket.on('remove-comment',(data)=>{
            let followers=[data.user._id,...data.user.followers];
            let clients=users.filter((user)=>{return followers.includes(user);});
            if(clients.length>0){
                clients.forEach((client)=>{
                    io.to(client.socketId).emit('post-removed',data)
                });
            };
        });
    });
}


module.exports =sockets;
