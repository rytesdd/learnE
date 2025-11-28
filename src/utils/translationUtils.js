// 模拟翻译API
export const translateText = async (text) => {
  // 在实际应用中，这里会调用真实的翻译API
  // 目前我们使用模拟数据来演示功能
  
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // 模拟翻译结果
  const mockTranslations = {
    'hello': { word: 'hello', translation: '你好', definition: 'Used as a greeting or to begin a telephone conversation.' },
    'world': { word: 'world', translation: '世界', definition: 'The earth, together with all of its countries and peoples.' },
    'document': { word: 'document', translation: '文档', definition: 'A written or printed paper that provides information.' },
    'translation': { word: 'translation', translation: '翻译', definition: 'The process of translating words or text from one language into another.' },
    'language': { word: 'language', translation: '语言', definition: 'The method of human communication, either spoken or written.' },
    'english': { word: 'english', translation: '英语', definition: 'The language of England, widely spoken and used as a lingua franca.' },
    'chinese': { word: 'chinese', translation: '中文', definition: 'The language of China, with various dialects including Mandarin.' },
    'reading': { word: 'reading', translation: '阅读', definition: 'The action or skill of reading written or printed matter.' },
    'learning': { word: 'learning', translation: '学习', definition: 'The acquisition of knowledge or skills through study, experience, or being taught.' },
    'practice': { word: 'practice', translation: '练习', definition: 'The actual application or use of an idea, belief, or method.' },
    'application': { word: 'application', translation: '应用', definition: 'A program or piece of software designed to fulfill a particular purpose.' },
    'development': { word: 'development', translation: '开发', definition: 'The process of developing or being developed.' },
    'programming': { word: 'programming', translation: '编程', definition: 'The process of writing computer programs.' },
    'function': { word: 'function', translation: '函数', definition: 'A relation or expression involving one or more variables.' },
    'component': { word: 'component', translation: '组件', definition: 'A part or element of a larger whole.' },
    'interface': { word: 'interface', translation: '接口', definition: 'A point where two systems, subjects, organizations, etc. meet and interact.' },
    'design': { word: 'design', translation: '设计', definition: 'A plan or drawing produced to show the look or function of something before it is built or made.' },
    'system': { word: 'system', translation: '系统', definition: 'A set of connected things or parts forming a complex whole.' },
    'computer': { word: 'computer', translation: '计算机', definition: 'An electronic device for storing and processing data.' },
    'software': { word: 'software', translation: '软件', definition: 'The programs and other operating information used by a computer.' }
  };
  
  // 返回小写形式的翻译结果
  const lowerText = text.toLowerCase().trim();
  return mockTranslations[lowerText] || {
    word: text,
    translation: `${text} (未找到翻译)`,
    definition: 'Translation not available in mock data.'
  };
};

// 处理句子翻译
export const translateSentence = async (sentence) => {
  // 在实际应用中，这里会调用真实的句子翻译API
  // 目前我们使用模拟数据来演示功能
  
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 模拟句子翻译结果
  const mockSentenceTranslations = {
    'hello world': { original: 'hello world', translation: '你好，世界' },
    'document translation': { original: 'document translation', translation: '文档翻译' },
    'language learning': { original: 'language learning', translation: '语言学习' },
    'reading practice': { original: 'reading practice', translation: '阅读练习' }
  };
  
  // 返回小写形式的翻译结果
  const lowerSentence = sentence.toLowerCase().trim();
  return mockSentenceTranslations[lowerSentence] || {
    original: sentence,
    translation: `${sentence} (未找到翻译)`
  };
};