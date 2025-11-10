# 🩺 Doctor Chat Widget - AI Health Assistant

An intelligent, AI-powered health consultation chatbot widget integrated into your Ayurveda eCommerce website. Provides instant Ayurvedic guidance and health advice using Google's Gemini API.

## 🌟 Features

### Core Functionality
- ✅ **AI-Powered Responses**: Uses Google Gemini API for intelligent health consultations
- ✅ **Topic Restriction**: Only responds to health, wellness, and Ayurveda-related queries
- ✅ **Urgent Warning System**: Detects emergency symptoms and advises immediate medical care
- ✅ **Quick Actions**: Pre-defined prompts for common health queries
- ✅ **Chat History**: Persistent storage in browser localStorage
- ✅ **Context Awareness**: Maintains conversation context (last 5 messages)
- ✅ **Real-time Typing Indicator**: Shows when AI is thinking
- ✅ **Beautiful Animations**: Smooth Framer Motion animations throughout

### UI/UX Features
- 🎨 **Floating Chat Button**: Animated stethoscope icon in bottom-right corner
- 💬 **WhatsApp-style Chat Interface**: Familiar bubble design
- 🎭 **Minimize/Maximize**: Toggle chat window visibility
- 🔄 **Clear Chat**: Reset conversation with one click
- 📱 **Fully Responsive**: Works on all screen sizes
- 🌈 **Theme Integration**: Matches Ayurveda brand colors

### Security & Privacy
- 🔒 **Backend API Proxy**: No API keys exposed to frontend
- 🛡️ **Content Filtering**: Built-in safety settings
- 💾 **Local Storage Only**: Chat history stays in browser
- 🚫 **No PHI Storage**: Personal health information not permanently stored

## 📁 File Structure

```
ayurveda-shop/
├── components/
│   └── shared/
│       └── DoctorChatWidget.tsx          # Main widget component
├── app/
│   ├── api/
│   │   └── doctor-chat/
│   │       └── route.ts                  # Gemini API proxy endpoint
│   └── layout.tsx                        # Global widget integration
├── lib/
│   └── config/
│       └── doctorChatConfig.ts           # Configuration & customization
└── .env.example                          # Environment variables template
```

## 🚀 Setup Instructions

### 1. Get Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure Environment Variables

1. Create a `.env.local` file in the project root:

```bash
cd ayurveda-shop
touch .env.local
```

2. Add your API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

3. **Important**: Never commit `.env.local` to version control!

### 3. Install Dependencies (if not already done)

```bash
npm install
```

Required packages (already in package.json):
- `framer-motion` - Animations
- `lucide-react` - Icons
- `next` - Framework
- `react` - UI library

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` - the chat widget should appear in the bottom-right corner.

## 🎨 Customization

### Modify Widget Configuration

Edit [`lib/config/doctorChatConfig.ts`](lib/config/doctorChatConfig.ts):

```typescript
export const defaultDoctorChatConfig: DoctorChatConfig = {
  theme: {
    primaryColor: "#2E7D32",    // Change primary color
    secondaryColor: "#A5D6A7",  // Change secondary color
    accentColor: "#C9A66B",     // Change accent color
    backgroundColor: "#FFFFFF",  // Change background
  },

  doctorName: "Dr. AI",                        // Change bot name
  doctorTitle: "Ayurvedic Health Assistant",   // Change subtitle
  welcomeMessage: "Your custom welcome...",    // Change greeting

  position: "bottom-right",  // Options: bottom-right, bottom-left, top-right, top-left

  features: {
    quickActions: true,       // Show/hide quick action buttons
    urgentWarnings: true,     // Show/hide emergency warnings
    chatHistory: true,        // Enable/disable chat persistence
  },

  maxHistoryMessages: 5,      // Context window size
  autoGreet: false,           // Auto-open widget with greeting
};
```

### Modify Quick Actions

Edit the `quickActionTemplates` array in `doctorChatConfig.ts`:

```typescript
export const quickActionTemplates = [
  {
    label: "Your Label",
    prompt: "Your prompt text",
    category: "general",
  },
  // Add more...
];
```

### Change Widget Position

In `doctorChatConfig.ts`:

```typescript
position: "bottom-left"  // Will appear in bottom-left corner
```

Then update CSS classes in `DoctorChatWidget.tsx`:
- Change `bottom-6 right-6` to `bottom-6 left-6`

### Modify AI System Prompt

Edit the `SYSTEM_PROMPT` in [`app/api/doctor-chat/route.ts`](app/api/doctor-chat/route.ts):

```typescript
const SYSTEM_PROMPT = `You are Dr. AI, an Ayurvedic health assistant...
Add your custom instructions here...
`;
```

## 🔧 API Endpoints

### POST `/api/doctor-chat`

Send messages to the AI assistant.

**Request Body:**
```json
{
  "message": "I have a headache",
  "history": [
    {
      "role": "user",
      "content": "Previous message"
    },
    {
      "role": "assistant",
      "content": "Previous response"
    }
  ]
}
```

**Response:**
```json
{
  "response": "AI response text...",
  "timestamp": "2025-01-10T12:00:00.000Z"
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "response": "Fallback message for user"
}
```

## 🎯 Usage Examples

### Example 1: User Asks About Symptoms

**User:** "I have a sore throat and fever"

**AI Response:**
> "🌿 I understand you're experiencing a sore throat and fever. These symptoms could indicate various conditions. From an Ayurvedic perspective, this may suggest a Pitta or Kapha imbalance.
>
> Some natural remedies to consider:
> - Warm water with turmeric and honey
> - Tulsi (holy basil) tea
> - Gargling with salt water
>
> However, if your fever is high (above 101°F) or persists for more than 3 days, please consult a healthcare professional. Stay hydrated and get plenty of rest. 💚
>
> *Disclaimer: This is educational guidance only, not a medical diagnosis.*"

### Example 2: User Asks Non-Medical Question

**User:** "What's the weather today?"

**AI Response:**
> "I'm here to help with health and wellness topics only. How can I assist you with your health today? 🌿"

### Example 3: Emergency Detection

**User:** "I'm having chest pain"

**AI Response:**
> "⚠️ **URGENT**: Chest pain can be a sign of a serious medical emergency. Please:
>
> 1. Call emergency services (911/108) immediately
> 2. Do NOT drive yourself to the hospital
> 3. Chew an aspirin if available and not allergic
> 4. Sit down and try to remain calm
>
> I'm an AI assistant and cannot provide emergency care. Your safety is paramount - please seek immediate medical attention."

## 🧪 Testing

### Test Chat Functionality

1. Open the website
2. Click the floating stethoscope icon
3. Try these test prompts:
   - "What is Ayurveda?" ✅ Should respond
   - "Tell me about Ashwagandha" ✅ Should respond
   - "What's the weather?" ❌ Should redirect
   - "I have chest pain" ⚠️ Should show urgent warning

### Test Quick Actions

1. Open chat (should see quick action buttons if `messages.length <= 2`)
2. Click any quick action
3. Verify AI responds appropriately

### Test Chat History

1. Have a conversation
2. Close the widget
3. Refresh the page
4. Reopen widget
5. Verify conversation is restored

### Test Clear Chat

1. Have a conversation
2. Click the reset icon (↻) in header
3. Confirm the alert
4. Verify chat is cleared and welcome message appears

## 🛡️ Safety Features

### 1. Topic Restriction
AI is instructed to ONLY respond to health/wellness topics. Other queries are politely redirected.

### 2. Urgent Keyword Detection
Monitors for emergency keywords:
- chest pain
- can't breathe
- severe bleeding
- unconscious
- heart attack
- stroke
- suicide/suicidal

Shows red warning banner and advises immediate medical care.

### 3. Medical Disclaimers
Every response includes implicit disclaimer language reminding users this is educational, not diagnosis.

### 4. Content Safety
Gemini API configured with safety filters:
- `HARM_CATEGORY_HARASSMENT`: BLOCK_MEDIUM_AND_ABOVE
- `HARM_CATEGORY_HATE_SPEECH`: BLOCK_MEDIUM_AND_ABOVE
- `HARM_CATEGORY_SEXUALLY_EXPLICIT`: BLOCK_MEDIUM_AND_ABOVE
- `HARM_CATEGORY_DANGEROUS_CONTENT`: BLOCK_MEDIUM_AND_ABOVE

### 5. Rate Limiting (Recommended)
Consider adding rate limiting to the API route to prevent abuse:

```typescript
// Example using next-rate-limit
import rateLimit from 'next-rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500,
});

export async function POST(request: NextRequest) {
  try {
    await limiter.check(request, 10, 'CACHE_TOKEN'); // 10 requests per minute
    // ... rest of code
  } catch {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }
}
```

## 🎨 Styling

### Colors
Widget uses CSS variables from your Tailwind theme:
- `primary` - Main brand color (green)
- `primary-dark` - Darker shade for gradients
- `accent` - Gold/bronze for highlights
- `foreground` - Text color
- `text-secondary` - Muted text

### Animations
All animations use Framer Motion variants:
- Fade in/out
- Slide up
- Scale
- Hover effects
- Typing indicator

### Responsive Design
- Desktop: 400px wide, 600px tall
- Mobile: Full width minus 2rem margin
- Adapts to screen size automatically

## 🚨 Troubleshooting

### Widget Doesn't Appear
1. Check browser console for errors
2. Verify `DoctorChatWidget` is imported in `layout.tsx`
3. Ensure no CSS `display: none` overrides

### API Errors
1. Verify `GEMINI_API_KEY` is set in `.env.local`
2. Check API key is valid at [Google AI Studio](https://makersuite.google.com)
3. Check browser Network tab for API call details
4. Verify no CORS issues (should work since it's same-origin)

### Chat History Not Persisting
1. Check localStorage is enabled in browser
2. Open DevTools > Application > Local Storage
3. Look for `doctorChatMessages` key
4. Verify browser isn't in incognito mode

### Typing Indicator Stuck
1. Check Network tab for failed API calls
2. Verify Gemini API is responding
3. Check for JavaScript errors in console

### Urgent Warning Not Showing
1. Verify `features.urgentWarnings` is `true` in config
2. Check `urgentKeywords` array includes your keyword
3. Test with known urgent keywords like "chest pain"

## 📊 Analytics (Optional)

Track widget usage by adding analytics events:

```typescript
// In DoctorChatWidget.tsx

const handleSendMessage = async () => {
  // Track message sent
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'doctor_chat_message_sent', {
      message_length: messageText.length,
    });
  }

  // ... rest of code
};

const handleQuickAction = (prompt: string) => {
  // Track quick action clicked
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'doctor_chat_quick_action', {
      action_label: prompt,
    });
  }

  handleSendMessage(prompt);
};
```

## 🔮 Future Enhancements

Potential features to add:

1. **Voice Input** - Use Web Speech API for voice messages
2. **File Upload** - Allow users to upload images (rashes, reports)
3. **Multi-language** - Auto-detect and respond in user's language
4. **Doctor Escalation** - Button to "Talk to real doctor" with booking
5. **Chat Export** - Download conversation as PDF
6. **Symptom Checker** - Structured questionnaire flow
7. **Dosha Assessment** - Integrated dosha quiz in chat
8. **Product Recommendations** - Suggest relevant products based on symptoms
9. **Appointment Booking** - Schedule consultation directly from chat
10. **Email Transcript** - Send chat history to user's email

## 📄 License

This Doctor Chat Widget is part of the Ayurveda Haven project. All rights reserved.

## 🤝 Support

For issues or questions:
1. Check this README first
2. Review `doctorChatConfig.ts` for configuration options
3. Check browser console for errors
4. Test API endpoint directly with Postman/curl

---

**Built with ❤️ for holistic wellness and modern healthcare**
