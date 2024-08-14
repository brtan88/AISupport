"use client";

import { Box, Button, Stack, TextField } from "@mui/material";
import { useState, useRef, useEffect } from "react";

import RatingForm from "./RatingForm";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hey I'm TechBuddy. What Technical Question Can I Help You With Today?",
    },
  ]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [avgRating, setAvgRating] = useState(-1);
  const [isRating, setIsRating] = useState(false);
  const [recentFeedback, setRecentFeedback] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return; // Don't send empty messages

    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...messages, { role: "user", content: message }]),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((messages) => [
        ...messages,
        {
          role: "assistant",
          content:
            "I'm sorry, but I encountered an error. Please try again later.",
        },
      ]);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getRating = async () => {
    try {
      const response = await fetch("/api/getRating", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setAvgRating(parseFloat(data.result.rows[0].avgrating).toFixed(2));
    } catch (error) {
      console.error("Error getting data:", error);
    }
  };
  
  const getFeedback = async () => {
    try {
      const response = await fetch("/api/getFeedback", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setRecentFeedback(data.result);
    } catch (error) {
      console.error("Error getting data:", error);
    }
  };

  useEffect(() => {
    getRating();
    getFeedback();
    scrollToBottom();
  }, [messages]);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="row"
      justifyContent="space-evenly"
      alignItems="center"
    >
      <div>
      <Stack
        direction={"row"}
        width="500px"
        height="50px"
        border="1px solid black"
        p={2}
        spacing={6}
      >
        <Box>Welcome to TechBuddy</Box>
        <Box>Rating: {avgRating}/5</Box>
        <Button>Username</Button>
      </Stack>
      <Stack
        direction={"column"}
        width="500px"
        height="650px"
        border="1px solid black"
        p={2}
        spacing={3}
      >
        <Stack
          direction={"column"}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === "assistant" ? "flex-start" : "flex-end"
              }
            >
              <Box
                bgcolor={
                  message.role === "assistant"
                    ? "primary.main"
                    : "secondary.main"
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <div ref={messagesEndRef} />
        <Stack direction={"row"} spacing={2}>
          <TextField
            label="Enter Your Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
          <Button
            variant="contained"
            onClick={()=> setIsRating(true)} //Used for rating later on
          >
            Rate
          </Button>
        </Stack>
      </Stack>
      
      </div>
      <div>
      
      Past feedback:
      {
        recentFeedback.map((feedback, id) => (
          <Box
            display="flex"
            flexDirection="row"
            width="30vw"
            justifyContent="space-between"
            sx={{
              border: '1px solid black', // Adds a black border
              padding: 2,                // Optional padding for spacing inside the box
              // Additional styling as needed
            }}
            key={id}
        >
            <span><b>Name:</b> {feedback.name}</span>
            <span><b>Feedback:</b> {feedback.feedback}</span>
          </Box>

        ))
      }
        
      {
        isRating && 
        <RatingForm setOpened={() => {
          setIsRating(false);
          getRating();
          getFeedback();
        }}/>
      }
      </div>
    </Box>
  );
}
