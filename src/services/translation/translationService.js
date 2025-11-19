import axios from 'axios'

// 模拟翻译服务，实际项目中可以使用Google翻译API或其他翻译服务
export const translateWord = async (word, targetLanguage = 'zh-CN') => {
  try {
    // 模拟翻译数据
    const mockTranslations = {
      'Hello': '你好',
      'welcome': '欢迎',
      'video': '视频',
      'Today': '今天',
      'learn': '学习',
      'about': '关于',
      'React': 'React',
      'is': '是',
      'a': '一个',
      'JavaScript': 'JavaScript',
      'library': '库',
      'for': '用于',
      'building': '构建',
      'user': '用户',
      'interfaces': '界面',
      'Hello,': '你好，',
      'welcome,': '欢迎，',
      'video.': '视频。',
      'Today,': '今天，',
      'learn,': '学习，',
      'about,': '关于，',
      'React.': 'React。',
      'is,': '是，',
      'a,': '一个，',
      'JavaScript,': 'JavaScript，',
      'library,': '库，',
      'for,': '用于，',
      'building,': '构建，',
      'user,': '用户，',
      'interfaces.': '界面。'
    }
    
    return {
      word,
      translation: mockTranslations[word] || mockTranslations[word.trim()] || `[未找到翻译: ${word}]`,
      definitions: [`${word} 的中文释义是 ${mockTranslations[word] || mockTranslations[word.trim()] || '未知'}`],
      examples: [`This is an example with "${word}".`]
    }
    
    // 实际API调用示例
    // const response = await axios.get(`https://translation-api.example.com/translate`, {
    //   params: {
    //     q: word,
    //     target: targetLanguage
    //   }
    // })
    // return response.data
  } catch (error) {
    console.error('Translation error:', error)
    throw error
  }
}