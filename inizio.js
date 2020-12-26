const Mam = require('@iota/mam');
const { asciiToTrytes, trytesToAscii } = require('@iota/converter');

// importare express (dopo npm install express)
const express = require('express');
// configurazione del server con la porta che viene data da Heroku o la porta di default 3000
const PORT = process.env.PORT || 3000 ;


// creazione di un nuovo express app e salvarlo come app
const app = express();




const mode = 'public';
const provider = 'https://nodes.devnet.iota.org';

const mamExplorerLink = `https://mam-explorer.firebaseapp.com/?provider=${encodeURIComponent(provider)}&mode=${mode}&root=`

//Inizializzazione dello stato MAM
let mamState = Mam.init(provider)




const publish = async packet => {
    // Creazione MAM payload (stringa di trytes)
    const trytes = asciiToTrytes(JSON.stringify(packet))
    const message = Mam.create(mamState, trytes)

    // Salvataggio del nuovo stato MAM
    mamState = message.state

    // Aggiungere il payload
    await Mam.attach(message.payload, message.address, 3, 9)

	//Stampare l'uscita , serve soltanto con il server locale
    console.log('Published', packet, '\n');
    return message.root
}


async function  doit(dataSensor){
	const root = await publish({
    message: dataSensor,
    timestamp: (new Date()).toLocaleString()
  })
  console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`);
  console.log(JSON.stringify(root));
  return root;
}


// Creazione del roure per l'app avendo un get request
app.get('/:data',async (req, res) => {
	var root=await doit(req.params.data);
	const ll=String(root);
	res.send(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`)

});

// Fa che il server ascolti i requesto
app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
  console.log('request');
  
});
