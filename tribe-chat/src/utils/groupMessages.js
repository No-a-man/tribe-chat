import dayjs from 'dayjs';

export function groupMessagesWithDates(messages) {
  const grouped = [];
  let currentDate = null;
  
  // Process in reverse (newest first)
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    const msgDate = dayjs(msg.sentAt).format('YYYY-MM-DD');
    
    // Add date separator if needed
    if (msgDate !== currentDate) {
      grouped.push({
        type: 'date',
        id: `date-${msgDate}`,
        date: msgDate
      });
      currentDate = msgDate;
    }
    
    // Group consecutive messages from same sender
    const lastGroup = grouped[grouped.length - 1];
    if (lastGroup?.type === 'message' && 
        lastGroup.messages[0].sender === msg.sender &&
        dayjs(msg.sentAt).diff(lastGroup.messages[0].sentAt, 'minute') < 5) {
      lastGroup.messages.push(msg);
    } else {
      grouped.push({
        type: 'message',
        id: `group-${msg.uuid}`,
        messages: [msg]
      });
    }
  }
  
  return grouped.reverse(); // Return in chronological order
}