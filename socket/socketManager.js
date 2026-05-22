const { participants } = require("../store/participantStore");

module.exports = (io) => {
    io.on("conneection", (socket) => {
        console.log("cliente conectado: ", socket.id);

        /* ADMIN */
        socket.on("admin:join", () => {

            socket.join("admins");

            console.log("Admin conectado");

            socket.emit("participants:list", participants);
        });

        /* PARTICIPANTES */
        socket.on("participant:join", (data) => {
            socket.join("participants")

            console.log("Participante conectado");
        });

        /*  ACTUALIZAR UBICACIÓN */
        socket.on("location:update", (data) => {
            participants[data.id] = {
                ...data,
                socketId: socket.id,
                updateAt: new Date()
            };

            console.log("Ubicación actualizada");

            io.to("admins").emit("participant:updated", participants[data.id]);
        });

        /* DETENER UBICACIÓN */
        socket.on("location:stop", (participantId) => {
            delete participants[participantId];

            io.to("admins").emit("participant:removed", participantId);

        });

        /*  DESCONECTAR  */
        socket.on("disconnect", () => {
            console.log("Cliente desconectado");

            for (const id in participants){
                if(participants[id].socketId === socket.id){
                    delete participants[id];

                    io.to("admins").emit("participant:removed", id);
                    break;
                }
            }
        });
    
    });
};