// src/utils/groupMessages.ts

// Assuming your Message interface looks something like this:
// (It's good practice to define this in a shared types file)
interface Message {
  uuid: string;
  authorUuid: string; // The ID of the sender
  text: string;
  sentAt: number; // Timestamp (e.g., milliseconds since epoch)
  editedAt?: number;
  attachment?: {
    imageUrl?: string;  
  };
}

/**
 * Groups an array of messages into sub-arrays based on sender and time proximity.
 * Consecutive messages from the same sender within a 5-minute window are grouped together.
 *
 * @param messages An array of message objects, ideally sorted by `sentAt` in ascending order (oldest first).
 * @returns An array of message groups, where each group is an array of Message objects.
 */
export const groupMessages = (messages: Message[]): Message[][] => {
  // The accumulator 'groups' will be an array of arrays (e.g., [[msg1, msg2], [msg3]])
  return messages.reduce((groups: Message[][], currentMsg: Message, index: number) => {
    const prevMsg = messages[index - 1]; // Get the message immediately preceding the current one

    // Determine if the current message is from the same sender as the previous one
    const sameSender = prevMsg?.authorUuid === currentMsg.authorUuid;

    // Determine if the current message was sent within 5 minutes of the previous one
    // 300000 milliseconds = 5 minutes (5 * 60 * 1000)
    const within5Min = prevMsg
      ? (new Date(currentMsg.sentAt).getTime() - new Date(prevMsg.sentAt).getTime()) < 300000
      : false; // If there's no previous message, it's not "within 5 min" of one

    // Logic to decide whether to add to the last group or start a new one
    if (sameSender && within5Min) {
      // If same sender and within 5 minutes, add the current message to the last group
      groups[groups.length - 1].push(currentMsg);
    } else {
      // Otherwise, start a new group with the current message
      groups.push([currentMsg]);
    }

    return groups; // Return the updated groups array for the next iteration
  }, []); // Initialize 'groups' as an empty array
};