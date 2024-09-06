const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

// Objeto para rastrear o estado de cada conversa
const userStates = {};

// Lista de opções iniciais
const options = {
    1: "Informações Gerais",
    2: "Estrutura e Infraestrutura",
    3: "Monitoria, Iniciação Científica, Inovação e Extensão",
    4: "Suporte ao Aluno",
    5: "Estágios e Empregabilidade",
    6: "Eventos e Notícias",
    7: "Processos Seletivos Simplificados"
};

// Lista de opções de Informações Gerais
const optionsInfo = {
    0: "Voltar ao menu anterior",
    1: "Localização",
    2: "Horários",
    3: "Contatos",
    4: "ENEM"
};

// Função para enviar a lista de opções
function sendOptions(chatId) {
    let optionsText = "Escolha uma das opções abaixo:\n";
    for (let key in options) {
        optionsText += `${key}. ${options[key]}\n`;
    }
    client.sendMessage(chatId, optionsText);
}

// Função para enviar a lista de opções de Informações Gerais
function sendOptionsInfo(chatId) {
    let optionsText = "Escolha uma das opções abaixo:\n";
    for (let key in optionsInfo) {
        optionsText += `${key}. ${optionsInfo[key]}\n`;
    }
    client.sendMessage(chatId, optionsText);
}

// Evento quando o QR Code é gerado
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

// Evento quando o cliente está pronto
client.on('ready', () => {
    console.log('Cliente está pronto!');
});

// Evento quando uma mensagem é recebida
client.on('message', message => {
    const chatId = message.from;

    // Verifica se o usuário já está em um fluxo
    if (!userStates[chatId]) {
        // Se o usuário não tiver estado, envia as opções iniciais e define o estado
        client.sendMessage(chatId, 'Olá! Bem-vindo ao Curso de Ciência da Computação do CCEA da UEPB. Estou aqui para ajudar você com informações e serviços.');
        sendOptions(chatId);
        userStates[chatId] = 'awaiting_selection';
    } else if (userStates[chatId] === 'awaiting_selection') {
        // Verifica a escolha do usuário e entra no fluxo apropriado
        switch (message.body) {
            case '1':
                client.sendMessage(chatId, 'Você escolheu "Informações Gerais". O que deseja saber?');
                userStates[chatId] = 'info_gerais_flow';
                break;
            case '2':
                client.sendMessage(chatId, 'Você escolheu "Estrutura e Infraestrutura". Qual é o seu problema?');
                userStates[chatId] = 'estrutura_flow';
                break;
            case '3':
                client.sendMessage(chatId, 'Você escolheu "Monitoria, Iniciação Científica, Inovação e Extensão". Conectando...');
                userStates[chatId] = 'monitoria_flow';
                break;
            case '4':
                client.sendMessage(chatId, 'Você escolheu "Suporte ao Aluno". Conectando...');
                userStates[chatId] = 'suporte_flow';
                break;
            case '5':
                client.sendMessage(chatId, 'Você escolheu "Estágios e Empregabilidade". Conectando...');
                userStates[chatId] = 'estagio_flow';
                break;
            case '6':
                client.sendMessage(chatId, 'Você escolheu "Eventos e Notícias". Conectando...');
                userStates[chatId] = 'eventos_flow';
                break;
            case '7':
                client.sendMessage(chatId, 'Você escolheu "Processos Seletivos Simplificados". Conectando...');
                userStates[chatId] = 'processos_flow';
                break;
            default:
                client.sendMessage(chatId, 'Desculpe, não entendi sua mensagem. Por favor, responda com o número correspondente à sua escolha.');
                sendOptions(chatId);
                userStates[chatId] = 'awaiting_selection';
                break;
        }
    } else if (userStates[chatId] === 'info_gerais_flow') {
        sendOptionsInfo(chatId);
        userStates[chatId] = 'awaiting_selection_info';
        
    } else if (userStates[chatId] === 'awaiting_selection_info') {

        switch (message.body) {
            case '0':
                sendOptions(chatId);
                userStates[chatId] = 'awaiting_selection';
                break;
            case '1':
                client.sendMessage(chatId, '*Você escolheu Informações Gerais > Localização*. \n O curso de Ciência da Computação está situado no Campus VII da UEPB, em Patos, PB. Aqui está o endereço completo para sua referência: Rua Alfredo Lustosa Cabral, s/n, Bairro Salgadinho, Patos, PB, 58706-560. \n Se precisar de mais informações gerais digite "0" para voltar ao menu anterior. Caso precise de assistência humana, digite "Ajuda".');
                userStates[chatId] = 'estrutura_flow';
                break;          
            case '2':
                client.sendMessage(chatId, 'Você escolheu "Monitoria, Iniciação Científica, Inovação e Extensão". Conectando...');
                userStates[chatId] = 'monitoria_flow';
                break;
            case '3':
                client.sendMessage(chatId, 'Você escolheu "Suporte ao Aluno". Conectando...');
                userStates[chatId] = 'suporte_flow';
                break;
            case '4':
                client.sendMessage(chatId, 'Você escolheu "Estágios e Empregabilidade". Conectando...');
                userStates[chatId] = 'estagio_flow';
                break;
            default:
                client.sendMessage(chatId, 'Desculpe, não entendi sua mensagem. Por favor, responda com o número correspondente à sua escolha.');
                sendOptionsInfo(chatId);
                userStates[chatId] = 'awaiting_selection_info';
                break;
        }
        
    } else if (userStates[chatId] === 'estrutura_flow') {
        client.sendMessage(chatId, `Nosso suporte técnico está verificando seu problema: ${message.body}`);
        // Resetando o estado para uma nova interação
        userStates[chatId] = null;
    } else if (userStates[chatId] === 'monitoria_flow') {
        client.sendMessage(chatId, 'Estamos conectando você a um atendente...');
        // Aqui, normalmente, você redirecionaria para um atendimento humano ou outro serviço.
        userStates[chatId] = null;
    }else if (userStates[chatId] === 'suporte_flow') {
        client.sendMessage(chatId, 'Estamos conectando você a um atendente...');
        // Aqui, normalmente, você redirecionaria para um atendimento humano ou outro serviço.
        userStates[chatId] = null;
    }else if (userStates[chatId] === 'estagio_flow') {
        client.sendMessage(chatId, 'Estamos conectando você a um atendente...');
        // Aqui, normalmente, você redirecionaria para um atendimento humano ou outro serviço.
        userStates[chatId] = null;
    }else if (userStates[chatId] === 'eventos_flow') {
        client.sendMessage(chatId, 'Estamos conectando você a um atendente...');
        // Aqui, normalmente, você redirecionaria para um atendimento humano ou outro serviço.
        userStates[chatId] = null;
    }else if (userStates[chatId] === 'processos_flow') {
        client.sendMessage(chatId, 'Estamos conectando você a um atendente...');
        // Aqui, normalmente, você redirecionaria para um atendimento humano ou outro serviço.
        userStates[chatId] = null;
    }
});

// Inicializa o cliente
client.initialize();
