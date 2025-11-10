# 🏗️ Doctor Chat Widget Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      USER'S BROWSER                          │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         DoctorChatWidget Component                 │    │
│  │                                                     │    │
│  │  ┌──────────────┐  ┌──────────────┐              │    │
│  │  │ Floating Icon│  │  Chat Window │              │    │
│  │  │   (Closed)   │  │   (Open)     │              │    │
│  │  └──────────────┘  └──────────────┘              │    │
│  │                                                     │    │
│  │  Features:                                         │    │
│  │  • Quick Actions                                   │    │
│  │  • Message Input                                   │    │
│  │  • Chat History                                    │    │
│  │  • Urgent Detection                                │    │
│  │  • Minimize/Maximize                               │    │
│  └─────────────────────┬──────────────────────────────┘    │
│                        │                                    │
│                        │ POST /api/doctor-chat             │
│                        │ { message, history }              │
│                        ▼                                    │
│  ┌─────────────────────────────────────────────────────┐  │
│  │            localStorage                              │  │
│  │  Key: "doctorChatMessages"                          │  │
│  │  Value: [...message history]                        │  │
│  └─────────────────────────────────────────────────────┘  │
└──────────────────────────┬───────────────────────────────────┘
                          │
                          │ HTTP Request
                          │
┌──────────────────────────▼───────────────────────────────────┐
│                  NEXT.JS SERVER (Your Backend)               │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │    API Route: /api/doctor-chat/route.ts           │    │
│  │                                                     │    │
│  │  1. Validate request                               │    │
│  │  2. Build conversation context                     │    │
│  │  3. Add system prompt                              │    │
│  │  4. Forward to Gemini API                          │    │
│  │  5. Process response                               │    │
│  │  6. Return to client                               │    │
│  └─────────────────────┬──────────────────────────────┘    │
│                        │                                    │
│                        │ Reads GEMINI_API_KEY              │
│                        │ from process.env                   │
│                        ▼                                    │
│  ┌─────────────────────────────────────────────────────┐  │
│  │         Environment Variables (.env.local)          │  │
│  │  GEMINI_API_KEY=abc123...                           │  │
│  └─────────────────────────────────────────────────────┘  │
└──────────────────────────┬───────────────────────────────────┘
                          │
                          │ HTTPS Request
                          │
┌──────────────────────────▼───────────────────────────────────┐
│              GOOGLE GEMINI API (External)                    │
│                                                              │
│  • AI Model: gemini-pro                                     │
│  • Processes natural language                               │
│  • Returns AI-generated response                            │
│  • Safety filters applied                                   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Sends Message

```
User Types Message
       │
       ▼
DoctorChatWidget.tsx
       │
       ├─> Add to local state (optimistic update)
       │
       ├─> Save to localStorage
       │
       └─> POST to /api/doctor-chat
           - message: string
           - history: Message[]
```

### 2. Backend Processing

```
/api/doctor-chat/route.ts
       │
       ├─> Validate input
       │   └─> Check message is not empty
       │
       ├─> Build context
       │   └─> Last 5 messages from history
       │
       ├─> Construct prompt
       │   ├─> System prompt (role & restrictions)
       │   ├─> Conversation context
       │   └─> User message
       │
       └─> Call Gemini API
           ├─> Send prompt
           ├─> Apply safety settings
           ├─> Set generation config
           └─> Wait for response
```

### 3. Response Handling

```
Gemini API Response
       │
       ▼
Parse & Validate
       │
       ├─> Extract text from response
       │
       ├─> Check for errors
       │
       └─> Return JSON
           {
             response: string,
             timestamp: string
           }
```

### 4. Client Update

```
DoctorChatWidget receives response
       │
       ├─> Add AI message to state
       │
       ├─> Save to localStorage
       │
       ├─> Check for urgent keywords
       │   └─> Show warning if needed
       │
       ├─> Scroll to bottom
       │
       └─> Enable input (stop loading)
```

## Component Hierarchy

```
RootLayout (app/layout.tsx)
│
└─> DoctorChatWidget (mounted globally)
    │
    ├─> Floating Button (when closed)
    │
    └─> Chat Window (when open)
        │
        ├─> Header
        │   ├─> Doctor Info (avatar, name, status)
        │   └─> Controls (clear, minimize, close)
        │
        ├─> Urgent Warning Banner (conditional)
        │
        ├─> Messages Area
        │   ├─> Welcome Message
        │   ├─> User Messages (bubbles right)
        │   ├─> AI Messages (bubbles left)
        │   └─> Typing Indicator (when loading)
        │
        ├─> Quick Actions (conditional)
        │   └─> Action Buttons
        │
        └─> Input Area
            ├─> Text Input
            ├─> Send Button
            └─> Disclaimer Text
```

## State Management

### React State (DoctorChatWidget)

```typescript
const [isOpen, setIsOpen] = useState(false);
// Widget open/closed state

const [isMinimized, setIsMinimized] = useState(false);
// Chat window minimized state

const [messages, setMessages] = useState<Message[]>([]);
// All conversation messages

const [inputValue, setInputValue] = useState("");
// Current input text

const [isLoading, setIsLoading] = useState(false);
// API request in progress

const [showUrgentWarning, setShowUrgentWarning] = useState(false);
// Emergency warning banner
```

### localStorage Persistence

```typescript
Key: "doctorChatMessages"
Value: JSON.stringify([
  {
    id: "1",
    role: "assistant",
    content: "Welcome message...",
    timestamp: "2025-01-10T12:00:00.000Z"
  },
  {
    id: "2",
    role: "user",
    content: "I have a headache",
    timestamp: "2025-01-10T12:01:00.000Z"
  },
  // ... more messages
])
```

## Configuration System

### Config File Structure

```typescript
// lib/config/doctorChatConfig.ts

interface DoctorChatConfig {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
  };
  doctorName: string;
  doctorTitle: string;
  welcomeMessage: string;
  position: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  features: {
    quickActions: boolean;
    urgentWarnings: boolean;
    chatHistory: boolean;
  };
  maxHistoryMessages: number;
}
```

### Usage in Component

```typescript
import { defaultDoctorChatConfig } from '@/lib/config/doctorChatConfig';

// Use config values
const { doctorName, welcomeMessage } = defaultDoctorChatConfig;
```

## Security Architecture

### 1. API Key Protection

```
Frontend (Public)              Backend (Private)
     │                              │
     │  No API key stored           │  GEMINI_API_KEY
     │  here - secure!              │  in environment
     │                              │  variables
     │                              │
     └─────── API calls ───────────>│
              via proxy             │
```

### 2. Request Flow

```
User Message
    │
    ├─> Client validation (not empty)
    │
    └─> POST to /api/doctor-chat (same origin)
        │
        └─> Server validation
            │
            ├─> Check API key exists
            ├─> Validate message format
            ├─> Sanitize input (strip HTML, etc.)
            └─> Rate limit (optional but recommended)
```

### 3. Content Safety

```
Gemini API Safety Settings
    │
    ├─> HARM_CATEGORY_HARASSMENT: BLOCK_MEDIUM_AND_ABOVE
    ├─> HARM_CATEGORY_HATE_SPEECH: BLOCK_MEDIUM_AND_ABOVE
    ├─> HARM_CATEGORY_SEXUALLY_EXPLICIT: BLOCK_MEDIUM_AND_ABOVE
    └─> HARM_CATEGORY_DANGEROUS_CONTENT: BLOCK_MEDIUM_AND_ABOVE
```

## Error Handling Strategy

### Network Errors

```
User sends message
    │
    └─> API call fails (network issue)
        │
        ├─> Catch error in try/catch
        ├─> Log to console
        ├─> Show fallback message to user
        │   "I'm having trouble connecting..."
        └─> Keep input enabled for retry
```

### API Errors

```
Gemini API error
    │
    ├─> Rate limit exceeded
    │   └─> Return 429 status
    │       └─> User sees: "Too many requests"
    │
    ├─> Invalid API key
    │   └─> Return 500 status
    │       └─> User sees: "Service not configured"
    │
    └─> Malformed response
        └─> Parse error
            └─> Return fallback message
```

### Input Validation

```
User input
    │
    ├─> Empty string
    │   └─> Button disabled (prevent send)
    │
    ├─> Too long (>1000 chars)
    │   └─> Truncate or show warning
    │
    └─> Valid
        └─> Process normally
```

## Performance Optimizations

### 1. Lazy Loading

```
Widget appears on all pages BUT:
    │
    ├─> Gemini API only called when user sends message
    ├─> No initial API calls
    └─> Minimal JavaScript until interaction
```

### 2. Context Window

```
Conversation history
    │
    └─> Only send last 5 messages to API
        │
        ├─> Reduces token usage
        ├─> Faster API response
        └─> Lower costs
```

### 3. localStorage Caching

```
Messages stored locally
    │
    ├─> No server calls on page load
    ├─> Instant chat history restore
    └─> Works offline (reading old messages)
```

### 4. Optimistic Updates

```
User sends message
    │
    ├─> Immediately show in UI (optimistic)
    ├─> Make API call in background
    └─> Update with response when ready
```

## Deployment Considerations

### Environment Variables

```
Development (.env.local)
    GEMINI_API_KEY=your_dev_key

Production (Hosting Platform)
    Set GEMINI_API_KEY in:
    - Vercel: Project Settings > Environment Variables
    - Netlify: Site Settings > Build & Deploy > Environment
    - AWS: Systems Manager > Parameter Store
```

### Build Time

```
next build
    │
    ├─> Builds static pages (blog, etc.)
    ├─> API routes included in output
    └─> Environment variables read at runtime (not build time)
```

### CORS (Not an Issue)

```
Frontend and Backend are same origin
    │
    └─> No CORS preflight needed
        └─> API route at /api/doctor-chat
            └─> Same domain as frontend
```

---

## Diagram Legend

```
┌─────┐
│ Box │  = Component, System, or Process
└─────┘

   │
   ▼     = Data flow direction
   │

   ├─>   = Branching logic
```

---

This architecture ensures:
✅ Security (API key protected)
✅ Privacy (local storage only)
✅ Performance (optimized API calls)
✅ Reliability (error handling)
✅ Scalability (stateless API)
