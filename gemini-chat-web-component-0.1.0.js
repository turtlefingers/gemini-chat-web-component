class GeminiChat extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // ⭐️ 1. 대화 기록을 저장할 배열을 초기화합니다.
    this.conversationHistory = [];
    
    // 모델명을 attribute에서 가져오거나 기본값 사용
    this.modelName = this.getAttribute('model') || 'gemini-2.0-flash';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-family: sans-serif;
        }
        .api-key-container {
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        label {
          font-weight: bold;
        }
        input[type="password"] {
          flex-grow: 1;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
      </style>
      <div class="api-key-container">
        <input type="password" id="apiKey" placeholder="Gemini API 키를 입력하세요">
      </div>
      <slot></slot>
    `;

    this.apiKeyInput = this.shadowRoot.querySelector('#apiKey');
    this.userInput = null;
    this.chatContainer = null;
    
    // 로컬스토리지에서 API 키 불러오기
    const savedApiKey = localStorage.getItem('gemini-api-key');
    if (savedApiKey) {
      this.apiKeyInput.value = savedApiKey;
    }
    
    // API 키 입력 시 로컬스토리지에 자동 저장
    this.apiKeyInput.addEventListener('input', (event) => {
      localStorage.setItem('gemini-api-key', event.target.value);
    });
    
    // DOMContentLoaded 이벤트로 초기화
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.initInnerElementsEvent();
      });
    } else {
      // 이미 로드된 경우 즉시 실행
      this.initInnerElementsEvent();
    }
  }

  initInnerElementsEvent(){
    this.userInput = this.querySelector('input:not([type="password"])');
    this.chatContainer = this.querySelector('div');

    if (!this.userInput || !this.chatContainer) {
      console.error('gemini-chat 엘리먼트 내부에 질문용 input과 대화용 div를 추가해야 합니다.');
      return;
    }

    this.userInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter' && this.userInput.value.trim() !== '') {
        this.sendMessage(this.userInput.value.trim());
      }
    });
  }


  async sendMessage(message) {
    const apiKey = this.apiKeyInput.value;
    if (!apiKey) {
      alert('API 키를 먼저 입력해주세요.');
      return;
    }

    this.addMessage('You', message);
    this.userInput.value = '';

    // ⭐️ 2. 사용자의 메시지를 정해진 형식으로 대화 기록에 추가합니다.
    this.conversationHistory.push({
      role: 'user',
      parts: [{ text: message }]
    });

    try {
      const loadingPara = this.addMessage('Gemini', '생각 중...');

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey
        },
        // ⭐️ 3. API 요청 시, 단일 메시지가 아닌 전체 대화 기록을 전송합니다.
        body: JSON.stringify({
          "contents": this.conversationHistory
        })
      });

      if (!response.ok) {
        // API에서 에러가 발생하면, 마지막 사용자 메시지를 기록에서 제거하여 재시도할 수 있게 합니다.
        this.conversationHistory.pop();
        const errorData = await response.json();
        throw new Error(`API 요청 실패: ${errorData.error.message}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;
      
      // ⭐️ 4. AI의 응답도 대화 기록에 추가합니다.
      this.conversationHistory.push({
          role: 'model',
          parts: [{ text: aiResponse }]
      });

      loadingPara.textContent = `Gemini: ${aiResponse}`;

    } catch (error) {
      console.error('오류 발생:', error);
      this.addMessage('Error', `메시지를 가져오는 데 실패했습니다: ${error.message}`);
    }
  }

  addMessage(sender, text) {
    const p = document.createElement('p');
    p.textContent = `${sender === 'You' ? 'You' : sender === 'Gemini' ? this.modelName : '❗️ Error'}: ${text}`;
    this.chatContainer.appendChild(p);
    this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    return p;
  }
  
  // attribute 변경 감지
  static get observedAttributes() {
    return ['model'];
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'model' && oldValue !== newValue) {
      this.modelName = newValue || 'gemini-2.0-flash';
    }
  }
}

customElements.define('gemini-chat', GeminiChat);
