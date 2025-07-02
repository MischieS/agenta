"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChatHeader } from "./chat/chat-header"
import { ChatList } from "./chat/chat-list"
import { MessageBubble } from "./chat/message-bubble"
import { Button } from "@/components/ui/button"
import { X, MessageCircle } from "lucide-react"

const dummyMessages = [
  {
    content: "Hi! How can we help you today?",
    isCurrentUser: false,
    senderName: "Support",
    timestamp: new Date().toISOString(),
  },
]

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(dummyMessages)

  return (
    <>
      {/* Floating Chat Icon */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 bg-accent text-white rounded-full shadow-lg p-4 hover:scale-110 transition-transform focus:outline-none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setOpen(true)}
        aria-label="Open chat support"
        style={{ display: open ? 'none' : 'block' }}
      >
        <MessageCircle className="w-7 h-7" />
      </motion.button>

      {/* Floating Chat Box */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chatbox"
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 right-6 z-50 w-[340px] max-w-[95vw] bg-background border border-accent rounded-xl shadow-2xl flex flex-col overflow-hidden"
          >
            <ChatHeader
              title="Support"
              avatarInitial="S"
              showBackButton={false}
              className="bg-accent text-white"
              subtitle="Chat with our team"
              onBack={() => setOpen(false)}
            />
            <div className="flex-1 p-4 overflow-y-auto bg-muted/30" style={{ maxHeight: 350 }}>
              {messages.map((msg, idx) => (
                <MessageBubble key={idx} {...msg} />
              ))}
            </div>
            <div className="p-2 border-t bg-muted/60 flex items-center">
              <input
                className="flex-1 rounded-lg px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                type="text"
                placeholder="Type your message..."
                disabled
              />
              <Button size="icon" variant="ghost" className="ml-2" disabled>
                <span role="img" aria-label="Send">📤</span>
              </Button>
              <Button size="icon" variant="ghost" className="ml-2" onClick={() => setOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
