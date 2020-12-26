const Mam = require('@iota/mam')
const { asciiToTrytes, trytesToAscii } = require('@iota/converter')

const mode = 'public'
const provider = 'https://nodes.devnet.iota.org'

const mamExplorerLink = `https://mam-explorer.firebaseapp.com/?provider=${encodeURIComponent(provider)}&mode=${mode}&root=`

//Inizializzazione dello stato MAM
let mamState = Mam.init(provider)
//pubblicazione sul Tangle
const publish = async packet => {
    // Creazione MAM payload (stringa di trytes)
    const trytes = asciiToTrytes(JSON.stringify(packet))
    const message = Mam.create(mamState, trytes)

    // Salvataggio del nuovo stato MAM
    mamState = message.state

    // Aggiungere il payload
    await Mam.attach(message.payload, message.address, 3, 9)

    console.log('Published', packet, '\n');
    return message.root
}


var five = require("johnny-five"),
  board, temperatureSensor;

board = new five.Board();

async function  doit(data){
	const root = await publish({
    message: data,
    timestamp: (new Date()).toLocaleString()
  })
  console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`);
  return root;
}


board.on("ready", function() {

  // Creazione di una nuova istanza del sensore termico con una frequenza di lettura di 10 secondi
  temperatureSensor = new five.Sensor({
    pin: "A2",
    freq: 10000
  });

  // Aggiunta del sesnsore nel repl per poterlo controllare

  board.repl.inject({
    pot: temperatureSensor
  });

  // lettura della "data" del sensore termico
  temperatureSensor.on("data", function() {
    var data=this.value;
    const root=doit(data);
    console.log(data);
  });
});
