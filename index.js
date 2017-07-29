/* eslint-disable no-console */
'use strict';

let Lime = require('lime-js');
let WebSocketTransport = require('lime-transport-websocket');
let MessagingHub = require('messaginghub-client');
let request = require('request-promise');
let status = [];
let passo = '';
let dados = [
    {
        nome: 'Davidson Nogueira',
        placa: 'abc1234',
        aniversario: '29/07/2017'
    }
];

// These are the MessagingHub credentials for this bot.
// If you want to create your own bot, see http://blip.ai
const IDENTIFIER = 'botcare';
const ACCESS_KEY = 'czhNYnFXRm1jY2lYVnRNQ1F6RWs=';

// Cria uma instância do cliente, informando o identifier e accessKey do seu chatbot
var client = new MessagingHub.ClientBuilder()
    .withIdentifier(IDENTIFIER)
    .withAccessKey(ACCESS_KEY)
    .withTransportFactory(() => new WebSocketTransport())
    .build();

// Registra um receiver para mensagens do tipo 'text/plain'
client.addMessageReceiver((m) => m.type == 'text/plain', function(message) {
    var msg = {};

    console.log(message);
    console.log('STATUS: ' + status[message.from]);
    switch (status[message.from]) {
        case 's1':
            var encontrado = false;
            var nome = '';

            for (var i = 0; i < dados.length; i++) {
                if (dados[i].placa == message.content) {
                    encontrado = true;
                    passo = 's2';
                    var conteudo = 'Ótimo, ' + dados[i].nome + ' já te encontramos, agora preciso da data do seu nascimento.';
                    msg = { id: Lime.Guid(), type: "text/plain", content: conteudo, to: message.from };
                    break;
                }
            }

            console.log(encontrado);

            if (encontrado == false) {
                passo = 's1';
                msg = { id: Lime.Guid(), type: "text/plain", content: "Ops, não encontramos o seu registro. Por favor, digite novamente.", to: message.from };
            }
            break;
        case 's2':
            var encontrado = false;
            var nome = '';

            for (var i = 0; i < dados.length; i++) {
                if (dados[i].aniversario == message.content) {
                    encontrado = true;
                    passo = 's3';
                    msg = {
                        id: Lime.Guid(),
                        to: message.from,
                        type: "application/vnd.lime.select+json",
                        content:{
                            text:"Aqui estão os problemas mais recorrentes. Clique em uma das opções:",
                            options:[
                                {
                                    value: 's4',
                                    order: 1,
                                    text:"Pneu furado"
                                },
                                {
                                    value: 's5',
                                    order: 2,
                                    text:"Carro não funciona"
                                },
                                {
                                    value: 's6',
                                    order: 3,
                                    text:"Bateria"
                                    // ,type:"application/json",
                                    // value:{
                                    //     "key1":"value1",
                                    //     "key2":2
                                    // }
                                }
                            ]
                        }
                    };
                    break;
                }
            }

            if (encontrado == false) {
                passo = 's2';
                msg = { id: Lime.Guid(), type: "text/plain", content: "Ops, não encontramos o seu registro. Por favor, digite novamente.", to: message.from };
            }
            break;
        case 's3':
            var conteudo = '';
            if (message.content == 'Pneu furado') {
                passo = 's4';
                msg = {
                    id: Lime.Guid(),
                    to: message.from,
                    type: "application/vnd.lime.select+json",
                    content:{
                        text:"Ok, você está no endereço Rua Paraguassu, 83 - Prado?",
                        options:[
                            {
                                order: 1,
                                text:"Sim"
                            },
                            {
                                order: 2,
                                text:"Não"
                            }
                        ]
                    }
                };
            } else if (message.content == 'Carro não funciona') {
                passo = 's5';
                conteudo = "Você selecionou Carro não funciona";
            } else if (message.content == 'Bateria') {
                passo = 's6';
                msg = {
                    id: Lime.Guid(),
                    to: message.from,
                    type: "application/vnd.lime.select+json",
                    content:{
                        text:"Ok, você está no endereço Rua Paraguassu, 83 - Prado?",
                        options:[
                            {
                                order: 1,
                                text:"Sim"
                            },
                            {
                                order: 2,
                                text:"Não"
                            }
                        ]
                    }
                };
            } else {
                passo = undefined;
                conteudo = 'Ops, preciso de mais detalhes, poderia ligar na nossa central de relacionamento?';
                msg = { id: Lime.Guid(), type: "text/plain", content: conteudo, to: message.from };
            }
            break;
        case 's4':
            passo = 's3';
            if (message.content == 'Sim') {
                conteudo = 'Aguarde um pouco, já estamos enviando ajuda. Se precisar de mais ajuda ligue para nossa central';
            } else {
                conteudo = 'Ops, preciso de mais detalhes, poderia ligar na nossa central de relacionamento?';
            }

            msg = { id: Lime.Guid(), type: "text/plain", content: conteudo, to: message.from };
            break;
        case 's5':
            passo = 's3';

            msg = { id: Lime.Guid(), type: "text/plain", content: 'Ainda estou aprendendo, poderia ligar na nossa central de relacionamento?', to: message.from };
            break;
        case 's6':
            passo = 's3';
            if (message.content == 'Sim') {
                conteudo = 'Aguarde um pouco, já estamos enviando ajuda. Se precisar de mais ajuda ligue para nossa central';
            } else {
                conteudo = 'Ops, preciso de mais detalhes, poderia ligar na nossa central de relacionamento?';
            }

            msg = { id: Lime.Guid(), type: "text/plain", content: conteudo, to: message.from };
            break;
        default:
            passo = 's1';
            msg = {
                id: Lime.Guid(),
                type: "text/plain",
                content: "Oi, eu sou o Botcare, assistente virtual da Seguradora Pão de Queijo.Estou aqui para lhe ajudar com os problemas do seu carro.\n\nPor favor, informe sua placa.",
                to: message.from
            };

            break;
    }

    console.log(msg);
    console.log(passo);

    client.sendMessage(msg);
    status[message.from] = passo;
});

// Registra um receiver para qualquer notificação
client.addNotificationReceiver(true, function(notification) {
  // TODO: Processe a notificação recebida
});

// Conecta com o servidor de forma assíncrona.
// A conexão ocorre via websocket, na porta 8081.
client.connect() // O retorno deste método é uma 'promise'.
    .then(function(session) {
        // Conexão bem sucedida. A partir deste momento, é possível enviar e receber envelopes do servidor. */
        })
    .catch(function(err) { /* Falha de conexão. */ });
