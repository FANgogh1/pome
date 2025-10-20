/**
 * n8n 工作流集成测试脚本
 * 用于验证前端与 n8n 工作流的集成是否正常工作
 */

// 模拟前端发送的数据格式
const testPayload = {
  clientId: 'test-client-' + Date.now(),
  messages: [
    {
      role: 'system',
      content: '你是一个专业的诗词鉴赏助手，擅长解释古诗词的含义、背景和艺术特色。请用简洁易懂的语言回答用户的问题。'
    },
    {
      role: 'user',
      content: '请解释一下李白的《静夜思》这首诗的含义'
    }
  ],
  meta: {
    model: 'deepseek-chat',
    temperature: 0.7
  }
};

// 测试函数
async function testN8nIntegration() {
  const webhookUrl = 'https://fanan77.app.n8n.cloud/webhook/ai-chat';
  
  console.log('🧪 开始测试 n8n 工作流集成...');
  console.log('📤 发送测试数据:', JSON.stringify(testPayload, null, 2));
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });
    
    console.log('📊 响应状态:', response.status, response.statusText);
    
    const responseText = await response.text();
    console.log('📥 响应内容:', responseText);
    
    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        console.log('✅ 解析后的数据:', data);
        
        if (data.ok && data.reply) {
          console.log('🎉 测试成功！AI 回复:', data.reply);
        } else {
          console.log('⚠️ 响应格式异常:', data);
        }
      } catch (parseError) {
        console.log('❌ JSON 解析失败:', parseError.message);
      }
    } else {
      console.log('❌ 请求失败:', response.status, response.statusText);
    }
    
  } catch (error) {
    console.log('💥 网络错误:', error.message);
  }
}

// 在浏览器控制台中运行
if (typeof window !== 'undefined') {
  console.log('在浏览器中运行测试...');
  testN8nIntegration();
} else {
  console.log('请在浏览器控制台中运行此脚本');
}
