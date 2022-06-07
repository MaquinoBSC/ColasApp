const TicketControl = require('../models/ticket-control');

const ticketControl= new TicketControl();

const socketController = (socket) => {
    socket.emit( 'ultimo-ticket', ticketControl.ultimo );
    
    socket.on('siguiente-ticket', ( payload, callback ) => {
        const siguiente= ticketControl.siguiente();
        callback( siguiente );

        // TODO: Notificar que hay un nuevo ticket sin asignar 
    });

    socket.on('atender-ticket', ( { escritorio }, callback )=> {
        if( !escritorio ){
            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio'
            });
        }

        // TODO: Notificar cambioe en los ultmos 4

        const ticket= ticketControl.atenderTicket( escritorio );
        if( !ticket ){
            return callback({
                ok: false,
                msg: 'Ya no hay tickets pendientes',
            });
        }
        else {
            callback({
                ok: true,
                ticket,
            });
        }
    });

}

module.exports = {
    socketController
}