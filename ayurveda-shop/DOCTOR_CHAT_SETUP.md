# 🚀 Quick Setup Guide - Doctor Chat Widget

## Step 1: Get Your Gemini API Key

1. Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the generated key

## Step 2: Create Environment File

1. In your project root (`ayurveda-shop/`), create a file named `.env.local`:

```bash
# Windows
type nul > .env.local

# Mac/Linux
touch .env.local
```

2. Open `.env.local` and add:

```env
GEMINI_API_KEY=paste_your_api_key_here
```

**Example:**
```env
GEMINI_API_KEY=AIzaSyAbc123def456ghi789jkl012mno345pqr678
```

## Step 3: Install Dependencies (if needed)

```bash
npm install
```

## Step 4: Run the Development Server

```bash
npm run dev
```

## Step 5: Test the Widget

1. Open [http://localhost:3000](http://localhost:3000)
2. Look for the **stethoscope icon** in the bottom-right corner
3. Click it to open the chat
4. Try asking: "What is Ayurveda?"

## ✅ Success Indicators

If everything works, you should see:
- 🩺 Animated stethoscope icon floating in bottom-right
- 💬 Chat window opens when clicked
- 🤖 AI responds to health questions
- 💾 Chat history persists after page refresh

## ⚠️ Troubleshooting

### Widget doesn't appear?
- Check browser console (F12) for errors
- Verify you're on `http://localhost:3000`
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### Chat shows "Chat service not configured"?
- Your `.env.local` file might be missing or incorrectly named
- Verify the API key is correct (no extra spaces)
- Restart the dev server: `Ctrl+C`, then `npm run dev` again

### AI doesn't respond?
1. Check Network tab in DevTools (F12)
2. Look for `/api/doctor-chat` request
3. If it's red (failed), check the Response tab for error details
4. Common issues:
   - Invalid API key
   - API quota exceeded (free tier limits)
   - Network connectivity issues

### Still having issues?
See the full [DOCTOR_CHAT_WIDGET_README.md](DOCTOR_CHAT_WIDGET_README.md) for detailed troubleshooting.

## 🎨 Quick Customization

### Change Widget Position

Edit `lib/config/doctorChatConfig.ts`:

```typescript
position: "bottom-left"  // Options: bottom-right, bottom-left, top-right, top-left
```

### Change Doctor Name

```typescript
doctorName: "Dr. Wellness"  // Your custom name
doctorTitle: "Your Health Guide"  // Your custom title
```

### Change Colors

```typescript
theme: {
  primaryColor: "#YOUR_COLOR",    // Main color
  accentColor: "#YOUR_COLOR",     // Accent color
}
```

## 📚 Next Steps

1. Read the full [DOCTOR_CHAT_WIDGET_README.md](DOCTOR_CHAT_WIDGET_README.md)
2. Customize the widget to match your brand
3. Test with various health queries
4. Deploy to production (remember to set `GEMINI_API_KEY` in production environment)

## 🔒 Important Notes

- ⚠️ **Never commit `.env.local` to Git!** (It's already in `.gitignore`)
- 🔑 Keep your API key secret
- 📊 Monitor your API usage at [Google AI Studio](https://makersuite.google.com)
- 💰 Be aware of rate limits on free tier

## 🎉 You're All Set!

Your AI Doctor Chat Widget is now ready to provide health guidance to your website visitors!

---

Need help? Check the full documentation or contact support.
