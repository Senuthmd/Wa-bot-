const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Create a new client instance
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

// Generate QR code for authentication
client.on('qr', qr => {
  console.log('Scan the QR code below to log in:');
  qrcode.generate(qr, { small: true });
});

// When client is ready
client.on('ready', () => {
  console.log('WhatsApp Bot is ready!');
});

// When client is authenticated
client.on('authenticated', () => {
  console.log('Authenticated successfully!');
});

// When client authentication fails
client.on('auth_failure', msg => {
  console.error('Authentication failed:', msg);
});

// Listen for incoming messages
client.on('message', async message => {
  // Ignore messages from status broadcasts
  if (message.from === 'status@broadcast') return;
  
  const content = message.body.toLowerCase().trim();
  const sender = message.from;
  
  console.log(`Received message from ${sender}: ${content}`);
  
  // Simple command handling
  if (content === '!ping') {
    message.reply('Pong! 🏓');
  } 
  else if (content === '!help') {
    const helpText = `
🤖 *WhatsApp Bot Help* 🤖
    
Available commands:
• !ping - Check if bot is alive
• !help - Show this help message
• !time - Get current time
• !info - Get chat information
    `;
    message.reply(helpText);
  }
  else if (content === '!time') {
    const now = new Date();
    message.reply(`Current time: ${now.toLocaleString()}`);
  }
  else if (content === '!info') {
    const chat = await message.getChat();
    let infoText = `
Chat ID: ${chat.id._serialized}
Name: ${chat.name}
Is Group: ${chat.isGroup}
Participants: ${chat.participants.length}
    `;
    message.reply(infoText);
  }
  else if (content.startsWith('!echo ')) {
    const text = content.substring(6);
    message.reply(`You said: ${text}`);
  }
});

// Initialize the client
client.initialize();
