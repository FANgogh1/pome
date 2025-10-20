/**
 * 最终版 n8n 工作流测试脚本
 * 用于验证使用 Merge 节点的工作流是否正常工作
 */

// 测试数据
const testData = {
  clientId: 'test-client-' + Date.now(),
  messages: [
    {
      role: 'user',
      content: '你好，请介绍一下李白的《静夜思》这首诗'
    }
  ],
  meta: {
    model: 'deepseek-chat',
    temperature: 0.7,
    system: '你是一个专业的诗词鉴赏助手，擅长解释古诗词的含义、背景和艺术特色。请用简洁易懂的语言回答用户的问题。'
  }
};

// 测试函数
async function testFinalWorkflow() {
  const webhookUrl = 'https://fanan77.app.n8n.cloud/webhook/ai-chat';
  
  console.log('🧪 测试最终版 n8n 工作流...');
  console.log('📤 发送数据:', JSON.stringify(testData, null, 2));
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log('📊 HTTP 状态:', response.status, response.statusText);
    
    const responseText = await response.text();
    console.log('📥 原始响应:', responseText);
    
    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        console.log('✅ 解析后的数据:', data);
        
        if (data.ok && data.reply) {
          console.log('🎉 测试成功！');
          console.log('🤖 AI 回复:', data.reply);
          console.log('📋 会话ID:', data.clientId);
          console.log('🔧 模型:', data.model);
          console.log('⏰ 时间戳:', new Date(data.timestamp).toLocaleString());
          if (data.usage) {
            console.log('📊 Token 使用:', data.usage);
          }
        } else {
          console.log('⚠️ 响应格式异常:', data);
          if (data.debug) {
            console.log('🔍 调试信息:', data.debug);
          }
        }
      } catch (parseError) {
        console.log('❌ JSON 解析失败:', parseError.message);
        console.log('📄 原始文本:', responseText);
      }
    } else {
      console.log('❌ HTTP 请求失败:', response.status, response.statusText);
      console.log('📄 错误响应:', responseText);
    }
    
  } catch (error) {
    console.log('💥 网络错误:', error.message);
  }
}

// 在浏览器控制台中运行
if (typeof window !== 'undefined') {
  console.log('🌐 在浏览器中运行测试...');
  testFinalWorkflow();
} else {
  console.log('请在浏览器控制台中运行此脚本');
}

// 导出函数供手动调用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testFinalWorkflow, testData };
}
