const express = require('express');
const app = express();

app.use(express.json());

// L'API Token dyal l'Bot ghadi njibouh mn l'environnement dyal l'hébergement
const BOT_TOKEN = process.env.BOT_TOKEN; 

app.post('/webhook', async (req, res) => {
  try {
    const { callback_query } = req.body;

    if (callback_query) {
      const chatId = callback_query.message.chat.id;
      const messageId = callback_query.message.message_id;
      const originalText = callback_query.message.text;
      const data = callback_query.data; 

      let newText = originalText;
      if (data === 'sent') {
        newText += '\n\n✅ SENT - validated';
      } else {
        newText += '\n\n❌ Skipped';
      }

      // 1. Editer l'message f Telegram
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: messageId,
          text: newText,
          reply_markup: { inline_keyboard: [] } 
        })
      });

      // 2. Jawb l'Callback bach thiyed l'icone dyal chargement mn l'bouton
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: callback_query.id })
      });
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error:', error);
    res.sendStatus(500);
  }
});

// Route sghira bach t-testi wach l'serveur khdam
app.get('/', (req, res) => {
  res.send('Bot Webhook is running!');
});

module.exports = app;