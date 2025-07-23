// src/utils/groupMessages.js
export const groupMessages = (messages) => {
  return messages.reduce((groups, msg, index) => {
    const prevMsg = messages[index - 1];
    const sameSender = prevMsg?.sender === msg.sender;
    const within5Min = prevMsg 
      ? new Date(msg.sentAt) - new Date(prevMsg.sentAt) < 300000
      : false;
    
    if (sameSender && within5Min) {
      groups[groups.length - 1].push(msg);
    } else {
      groups.push([msg]);
    }
    return groups;
  }, []);
};

// Usage in ChatScreen:
const groupedMessages = groupMessages(messages);