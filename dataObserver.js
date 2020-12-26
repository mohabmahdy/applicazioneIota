const Mam = require('@iota/mam')
const { asciiToTrytes, trytesToAscii } = require('@iota/converter')

const mode = 'public'
const provider = 'https://nodes.devnet.iota.org'

const mamExplorerLink = `https://mam-explorer.firebaseapp.com/?provider=${encodeURIComponent(provider)}&mode=${mode}&root=`

//Inizializzazione dello stato MAM
let mamState = Mam.init(provider)


const root='/*aggiungi il tuo root*/';

async function doit(root){

const result = await Mam.fetch(root, mode,null,function(data){
	while(!data){
		continue;
	}
	console.log(JSON.parse(trytesToAscii(data)));
		
	});
root=result.nextRoot;
doit(root);
}
doit(root);
