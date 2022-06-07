//Referencias HTML
const lblEscritorio = document.querySelector('h1');
const btnAtender    = document.querySelector('button');
const lblTicket     = document.querySelector('small');
const alert         = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');


const searchParams= new URLSearchParams( window.location.search );

if( !searchParams.has( 'escritorio' )){
    window.location= 'index.html';
    throw new Error('El escritorio es obligatorio');
}

const escritorio= searchParams.get('escritorio');
lblEscritorio.innerText= escritorio;
alert.style.display= 'none';

const socket = io();

socket.on('connect', () => {
    btnAtender.disabled= false;
});

socket.on('disconnect', () => {
    btnAtender.disabled= true;
});

socket.on('ultimo-ticket', ( payload )=> {
    // lblNuevoTicket.innerText= 'Ultimo ticket: ' + payload;
});

socket.on( 'tickets-pendientes', ( payload )=> {
    if( payload !== 0) alert.style.display= 'none';

    lblPendientes.innerText= payload;
});

btnAtender.addEventListener( 'click', () => {
    socket.emit('atender-ticket', { escritorio }, ({ ok, ticket, msg })=> {
        if( !ok ){
            lblTicket.innerHTML= 'Nadie';
            alert.style.display= '';
            alert.innerText= msg;
            return
        }

        alert.innerText= '';
        alert.style.display= 'none';
        lblTicket.innerHTML= 'Ticket: ' + ticket.numero;
    });
});