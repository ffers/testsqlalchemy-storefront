# 💬 Live Chat Integration

Кастомний Live Chat модуль з WebSocket підключенням до FastAPI бекенду та Telegram інтеграцією.

## 📋 Огляд

Цей модуль реалізує повнофункціональний live chat, який:
- ✅ Підключається до вашого FastAPI бекенду через WebSocket
- ✅ Зберігає історію чату в localStorage (навіть після перезавантаження)
- ✅ Інтегрований з Saleor - передає дані авторизованого користувача
- ✅ Автоматичне перепідключення при втраті з'єднання
- ✅ Typing indicators (індикатор друку)
- ✅ Адаптивний дизайн (mobile-first)
- ✅ Lazy loading - мінімальний вплив на продуктивність

## 🏗 Архітектура

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  LiveChatWidget (UI Component)                       │  │
│  │    - Floating bubble button                          │  │
│  │    - Chat window (@chatscope/chat-ui-kit-react)     │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                      │
│  ┌────────────────────▼─────────────────────────────────┐  │
│  │  useCrmChat Hook (WebSocket Client)                  │  │
│  │    - WebSocket connection management                 │  │
│  │    - Message sending/receiving                       │  │
│  │    - Auto-reconnect logic                            │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                      │
│  ┌────────────────────▼─────────────────────────────────┐  │
│  │  Session Management (localStorage)                   │  │
│  │    - chat_session_id persistence                     │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬──────────────────────────────────────┘
                        │ WebSocket
                        │ wss://api.domain.com/ws/chat/{session_id}?user_id={saleor_id}
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   FastAPI Backend                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  WebSocket Endpoint                                  │  │
│  │    - /ws/chat/{session_id}                          │  │
│  └────────────┬──────────────────┬──────────────────────┘  │
│               │                  │                          │
│               ▼                  ▼                          │
│  ┌────────────────────┐  ┌──────────────────────┐         │
│  │  PostgreSQL CRM    │  │  Telegram Bot API    │         │
│  │  (Message Storage) │  │  (Notifications)     │         │
│  └────────────────────┘  └──────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Структура файлів

```
src/
├── lib/crm-chat/              # Core WebSocket logic
│   ├── index.ts               # Exports
│   ├── types.ts               # TypeScript types
│   ├── session.ts             # Session management (localStorage)
│   └── useCrmChat.ts          # WebSocket hook
│
└── ui/components/LiveChatWidget/
    ├── index.ts               # Exports
    ├── LiveChatWidget.tsx     # UI Component (Client)
    └── LiveChatProvider.tsx   # Server Component wrapper
```

## ⚙️ Налаштування

### 1. Змінні середовища

Додайте в `.env`:

```bash
# CRM Live Chat WebSocket URL
NEXT_PUBLIC_CRM_WS_URL=wss://api.yourdomain.com/ws/chat

# CRM REST API for chat history (опціонально)
NEXT_PUBLIC_CRM_API_URL=https://api.yourdomain.com/api/v1
```

### 2. FastAPI Backend

Ваш FastAPI бекенд повинен мати WebSocket endpoint:

```python
from fastapi import WebSocket

@app.websocket("/ws/chat/{session_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    session_id: str,
    user_id: str | None = None,
    email: str | None = None
):
    await websocket.accept()

    # Send connection confirmation
    await websocket.send_json({
        "type": "connected",
        "session_id": session_id
    })

    # Send chat history
    messages = get_chat_history(session_id)
    await websocket.send_json({
        "type": "history",
        "messages": messages
    })

    try:
        while True:
            data = await websocket.receive_json()

            if data["type"] == "message":
                # Save to PostgreSQL
                save_message_to_db(session_id, user_id, data["text"])

                # Send to Telegram
                await send_to_telegram(session_id, user_id, data["text"])

            elif data["type"] == "typing":
                # Handle typing indicator
                pass

    except WebSocketDisconnect:
        # Handle disconnect
        pass
```

### 3. Message Format

**Client → Server:**
```json
{
  "type": "message",
  "text": "Hello, I need help!"
}
```

```json
{
  "type": "typing",
  "isTyping": true
}
```

**Server → Client:**
```json
{
  "type": "message",
  "text": "Hi! How can I help you?",
  "sender": "manager",
  "senderName": "Support Team"
}
```

```json
{
  "type": "history",
  "messages": [
    {
      "id": "1",
      "text": "Hello",
      "direction": "outgoing",
      "timestamp": "2025-01-03T12:00:00Z"
    },
    {
      "id": "2",
      "text": "Hi! How can I help?",
      "direction": "incoming",
      "timestamp": "2025-01-03T12:01:00Z",
      "sender": "manager",
      "senderName": "Support"
    }
  ]
}
```

```json
{
  "type": "typing",
  "isTyping": true
}
```

## 🎨 Кастомізація

### Зміна кольорів floating button

У файлі `LiveChatWidget.tsx`:

```tsx
<button
  className="... bg-gradient-to-r from-purple-600 to-blue-600 ..."
  // Змініть на свої кольори:
  // from-green-500 to-teal-500
  // from-red-500 to-pink-500
  // тощо
>
```

### Зміна позиції widget

```tsx
// Правий нижній кут (default):
className="fixed bottom-6 right-4 ..."

// Лівий нижній кут:
className="fixed bottom-6 left-4 ..."

// Правий верхній кут:
className="fixed top-6 right-4 ..."
```

### Зміна розміру чат-вікна

```tsx
<div className="... h-[500px] w-[380px] ...">
  // Змініть на бажані розміри
</div>
```

## 🔧 API Хука useCrmChat

```typescript
const {
  messages,           // ChatMessage[] - масив повідомлень
  connectionStatus,   // 'connecting' | 'connected' | 'disconnected' | 'error'
  isTyping,          // boolean - чи друкує менеджер
  sendMessage,       // (text: string) => void
  sendTyping,        // (isTyping: boolean) => void
  connect,           // () => void - підключитися
  disconnect,        // () => void - відключитися
  clearMessages,     // () => void - очистити історію
} = useCrmChat({
  lazyInit: true,           // Підключатися тільки коли потрібно
  autoReconnect: true,      // Автоматичне перепідключення
  reconnectDelay: 3000,     // Затримка перед перепідключенням (мс)
  user: chatUser,           // Saleor user object
});
```

## 🔐 Безпека

1. **Session ID** генерується на клієнті, але зберігається тільки в localStorage
2. **User ID** передається з сервера (Saleor authenticated user)
3. **WebSocket** має бути захищений (`wss://`, не `ws://`)
4. На бекенді додайте **rate limiting** для WebSocket endpoints
5. Валідуйте всі вхідні дані на сервері

## 📊 Monitoring

Логи в консолі браузера:
- `🔌 WebSocket connected` - з'єднання встановлено
- `✅ Connected to CRM chat` - отримано підтвердження від сервера
- `Reconnecting in 3000ms...` - перепідключення
- `❌ CRM chat error: ...` - помилка від сервера

## 🐛 Troubleshooting

### Chat не підключається

1. Перевірте змінну `NEXT_PUBLIC_CRM_WS_URL` в `.env`
2. Переконайтеся, що FastAPI бекенд запущений
3. Відкрийте DevTools → Network → WS - перегляньте WebSocket з'єднання

### Повідомлення не відправляються

1. Перевірте статус підключення (має бути "Онлайн")
2. Подивіться консоль браузера на помилки
3. Перевірте формат повідомлень на бекенді

### Історія чату не завантажується

1. Переконайтеся, що бекенд відправляє повідомлення типу `"history"`
2. Перевірте формат масиву `messages`
3. Очистіть localStorage: `localStorage.removeItem('crm_chat_session_id')`

## 🚀 Deployment

### Vercel / Production

1. Додайте змінні середовища в Vercel Dashboard
2. `NEXT_PUBLIC_CRM_WS_URL=wss://your-api-domain.com/ws/chat`
3. Переконайтеся, що FastAPI бекенд підтримує WSS (HTTPS)

### NGINX Proxy (якщо потрібно)

```nginx
location /ws/chat {
    proxy_pass http://fastapi_backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

## 📝 TODO / Майбутні покращення

- [ ] Підтримка файлів (upload images)
- [ ] Rich text messages (markdown, links)
- [ ] Звукові сповіщення при новому повідомленні
- [ ] Desktop notifications (Web Notifications API)
- [ ] Офлайн режим (queue messages)
- [ ] Локалізація (UA/EN/...)
- [ ] Admin panel для менеджерів

## 📄 Ліцензія

BSD-3-Clause (як і основний проект)

---

**Створено для Jemis W Storefront** 🧦✨
