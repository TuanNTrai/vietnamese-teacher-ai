// Next.js API Route: /pages/api/co-linh.js
// Cô Linh Vietnamese Teacher API

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;

  if (!text || text.trim() === '') {
    return res.status(400).json({ 
      reply: 'Xin chào! Hãy nói một câu tiếng Việt để bắt đầu học nhé! 🌸'
    });
  }

  try {
    const response = generateCoLinhResponse(text);
    
    return res.status(200).json({
      reply: response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return res.status(500).json({
      reply: 'Xin lỗi, cô gặp chút vấn đề. Hãy thử lại sau nhé! 🌸'
    });
  }
}

// Generate intelligent Vietnamese teaching responses
function generateCoLinhResponse(text) {
  const input = text.toLowerCase().trim();

  // Greetings
  if (input.includes('xin chào') || input.includes('chào')) {
    return 'Rất tốt! Bạn đã nói: "' + text + '". Câu này có nghĩa là: "Hello!" 👍 Bây giờ hãy thử giới thiệu tên: "Tôi tên là [tên của bạn]" nhé!';
  }

  // Name introduction
  if (input.includes('tôi tên là') || input.includes('tên tôi là')) {
    return 'Tuyệt vời! Bạn đã giới thiệu tên! 🎉 Câu "' + text + '" có nghĩa là "My name is..." Hãy thử hỏi: "Bạn tên là gì?"';
  }

  // Questions about names
  if (input.includes('bạn tên là gì')) {
    return 'Hay quá! Bạn hỏi: "' + text + '" nghĩa là "What is your name?" Tôi trả lời: "Tôi tên là Cô Linh!" 🌸';
  }

  // Learning Vietnamese
  if (input.includes('học tiếng việt') || input.includes('muốn học')) {
    return 'Tuyệt vời! Bạn muốn học tiếng Việt! 📚 Hãy bắt đầu với các số: "một, hai, ba, bốn, năm" (one, two, three, four, five).';
  }

  // Thank you
  if (input.includes('cảm ơn')) {
    return 'Không có chi! "' + text + '" có nghĩa là "Thank you". 😊 Hãy thử nói: "Xin lỗi" (Excuse me).';
  }

  // Default response
  return 'Rất tốt! Bạn đã nói: "' + text + '". Tôi nghe thấy bạn đang cố gắng học! 🌸 Hãy tiếp tục thực hành tiếng Việt nhé!';
}
