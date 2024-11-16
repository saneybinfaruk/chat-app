"use client";
import Link from "next/link";
import React from "react";
import { BsCameraVideo } from "react-icons/bs";
import { FaRegSmileWink } from "react-icons/fa";
import { FiSearch, FiMoreVertical } from "react-icons/fi";
import { GrAttachment } from "react-icons/gr";
import { HiOutlineCamera } from "react-icons/hi2";
import { IoCallOutline, IoSendSharp } from "react-icons/io5";
import { PiChecksBold } from "react-icons/pi";

const Messages = () => {
  const iconSize = 25;
  const iconColor = "#9747FF";
  const mockChatMessages = [
    {
      id: 1,
      username: "Alice",
      message: "Hey there! How's it going?",
      timestamp: "2024-09-25T14:30:00Z",
    },
    {
      id: 2,
      username: "Bob",
      message: "I'm doing great, thanks for asking! What about you?",
      timestamp: "2024-09-25T14:32:00Z",
    },
    {
      id: 3,
      username: "Alice",
      message: "Not too bad, just working on a new project.",
      timestamp: "2024-09-25T14:34:00Z",
    },
    {
      id: 4,
      username: "Bob",
      message: "That sounds interesting! What's the project about?",
      timestamp: "2024-09-25T14:35:30Z",
    },
    {
      id: 5,
      username: "Alice",
      message: "I'm building a chat app with React and Node.js!",
      timestamp: "2024-09-25T14:37:00Z",
    },
    {
      id: 6,
      username: "Bob",
      message: "Nice! Do you need any help with that?",
      timestamp: "2024-09-25T14:38:30Z",
    },
    {
      id: 7,
      username: "Alice",
      message: "Maybe later, but thanks! 😊",
      timestamp: "2024-09-25T14:40:00Z",
    },
    {
      id: 8,
      username: "Charlie",
      message: "Hey guys, what's up?",
      timestamp: "2024-09-25T14:42:00Z",
    },
    {
      id: 9,
      username: "Alice",
      message: "Hey Charlie! We're just talking about a project.",
      timestamp: "2024-09-25T14:43:30Z",
    },
    {
      id: 10,
      username: "Charlie",
      message: "Cool! Let me know if I can pitch in.",
      timestamp: "2024-09-25T14:45:00Z",
    },
    // 50 more messages generated below
    {
      id: 11,
      username: "Bob",
      message: "What are you working on, Charlie?",
      timestamp: "2024-09-25T14:46:00Z",
    },
    {
      id: 12,
      username: "Charlie",
      message: "I'm currently doing some front-end design.",
      timestamp: "2024-09-25T14:47:30Z",
    },
    {
      id: 13,
      username: "Alice",
      message: "That sounds cool, which framework are you using?",
      timestamp: "2024-09-25T14:49:00Z",
    },
    {
      id: 14,
      username: "Charlie",
      message: "I'm using Tailwind with React!",
      timestamp: "2024-09-25T14:50:00Z",
    },
    {
      id: 15,
      username: "Bob",
      message: "Great choice, Tailwind makes things so much faster.",
      timestamp: "2024-09-25T14:52:00Z",
    },
    {
      id: 16,
      username: "Charlie",
      message: "Yeah, I love how customizable it is.",
      timestamp: "2024-09-25T14:53:30Z",
    },
    {
      id: 17,
      username: "Alice",
      message: "Have you worked with any other CSS frameworks?",
      timestamp: "2024-09-25T14:55:00Z",
    },
    {
      id: 18,
      username: "Charlie",
      message: "I've used Bootstrap a lot, but Tailwind is a game changer.",
      timestamp: "2024-09-25T14:57:00Z",
    },
    {
      id: 19,
      username: "Bob",
      message: "I agree, Tailwind's utility-first approach is super handy.",
      timestamp: "2024-09-25T14:59:00Z",
    },
    {
      id: 20,
      username: "Alice",
      message: "By the way, have you tried deploying on Vercel?",
      timestamp: "2024-09-25T15:01:00Z",
    },
    {
      id: 21,
      username: "Charlie",
      message: "Yes, Vercel makes deployment really easy with Next.js.",
      timestamp: "2024-09-25T15:03:00Z",
    },
    {
      id: 22,
      username: "Bob",
      message: "I'm thinking of using Vercel for my next project too.",
      timestamp: "2024-09-25T15:05:00Z",
    },
    {
      id: 23,
      username: "Alice",
      message: "It's definitely worth it, super smooth experience.",
      timestamp: "2024-09-25T15:07:00Z",
    },
    {
      id: 24,
      username: "Charlie",
      message: "Have you guys worked with any other cloud platforms?",
      timestamp: "2024-09-25T15:08:30Z",
    },
    {
      id: 25,
      username: "Bob",
      message: "I've used AWS, but it's a bit more complex than Vercel.",
      timestamp: "2024-09-25T15:10:00Z",
    },
    {
      id: 26,
      username: "Alice",
      message:
        "True, AWS offers more control but has a steeper learning curve.",
      timestamp: "2024-09-25T15:12:00Z",
    },
    {
      id: 27,
      username: "Charlie",
      message: "Agreed. Vercel is simpler, especially for static sites.",
      timestamp: "2024-09-25T15:13:30Z",
    },
    {
      id: 28,
      username: "Alice",
      message: "Have you considered using Docker in your workflow?",
      timestamp: "2024-09-25T15:15:00Z",
    },
    {
      id: 29,
      username: "Charlie",
      message: "Yes, Docker is a must for consistent environments.",
      timestamp: "2024-09-25T15:17:00Z",
    },
    {
      id: 30,
      username: "Bob",
      message: "I love how Docker ensures the app runs the same everywhere.",
      timestamp: "2024-09-25T15:18:30Z",
    },
    {
      id: 31,
      username: "Alice",
      message: "Exactly, especially for team collaboration.",
      timestamp: "2024-09-25T15:20:00Z",
    },
    {
      id: 32,
      username: "Charlie",
      message: "I've set up Docker for my backend, and it's been a lifesaver.",
      timestamp: "2024-09-25T15:22:00Z",
    },
    {
      id: 33,
      username: "Bob",
      message: "Do you use Docker for your databases too?",
      timestamp: "2024-09-25T15:23:30Z",
    },
    {
      id: 34,
      username: "Alice",
      message:
        "Yes, running databases in Docker containers is super convenient.",
      timestamp: "2024-09-25T15:25:00Z",
    },
    {
      id: 35,
      username: "Charlie",
      message: "I'm running MongoDB in a container, works like a charm.",
      timestamp: "2024-09-25T15:26:30Z",
    },
    {
      id: 36,
      username: "Bob",
      message:
        "I've been thinking about switching to MongoDB, how's it going for you?",
      timestamp: "2024-09-25T15:28:00Z",
    },
    {
      id: 37,
      username: "Alice",
      message:
        "I prefer MongoDB for flexible schemas, but it depends on the project.",
      timestamp: "2024-09-25T15:30:00Z",
    },
    {
      id: 38,
      username: "Charlie",
      message: "Totally agree, it's great for rapid prototyping.",
      timestamp: "2024-09-25T15:31:30Z",
    },
    {
      id: 39,
      username: "Bob",
      message: "Do you use Mongoose for MongoDB?",
      timestamp: "2024-09-25T15:33:00Z",
    },
    {
      id: 40,
      username: "Alice",
      message: "Yes, Mongoose helps with schema enforcement.",
      timestamp: "2024-09-25T15:35:00Z",
    },
    {
      id: 41,
      username: "Charlie",
      message: "Mongoose is great for data validation too.",
      timestamp: "2024-09-25T15:36:30Z",
    },
    {
      id: 42,
      username: "Bob",
      message: "Sounds like it's time for me to dive into MongoDB!",
      timestamp: "2024-09-25T15:38:00Z",
    },
    {
      id: 43,
      username: "Alice",
      message:
        "You'll love it, it's a different experience from relational DBs.",
      timestamp: "2024-09-25T15:40:00Z",
    },
    {
      id: 44,
      username: "Charlie",
      message:
        "Yeah, once you get used to the NoSQL approach, it's super flexible.",
      timestamp: "2024-09-25T15:41:30Z",
    },
    {
      id: 45,
      username: "Bob",
      message: "What about serverless functions? Do you guys use them?",
      timestamp: "2024-09-25T15:43:00Z",
    },
    {
      id: 46,
      username: "Alice",
      message: "I do! They're great for quick API setups.",
      timestamp: "2024-09-25T15:45:00Z",
    },
    {
      id: 47,
      username: "Charlie",
      message: "I use them for lightweight operations, super cost-effective.",
      timestamp: "2024-09-25T15:47:00Z",
    },
    {
      id: 48,
      username: "Bob",
      message: "I should explore those next.",
      timestamp: "2024-09-25T15:49:00Z",
    },
    {
      id: 49,
      username: "Alice",
      message: "Definitely worth it, you can get things up and running fast.",
      timestamp: "2024-09-25T15:51:00Z",
    },
    {
      id: 50,
      username: "Charlie",
      message: "Let's continue this discussion in our next standup!",
      timestamp: "2024-09-25T15:53:00Z",
    },
    {
      id: 51,
      username: "Bob",
      message: "Sounds good, looking forward to it!",
      timestamp: "2024-09-25T15:55:00Z",
    },
  ];
  return <div>Boga</div>;
};

export default Messages;
