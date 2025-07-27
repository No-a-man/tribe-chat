
interface Reaction {
  uuid: string;
  participantUuid: string;
  value: string; 
}
interface Message {
  uuid: string;
  authorUuid: string; // The ID of the sender
  text: string;
  sentAt: number; 
  attachments?: {
    uuid: string;
    type: string;
    url: string;
    width?: number;
    height?: number;
  }[];
reactions?: Reaction[]; 
  updatedAt: number;
    replyToMessageUuid?: string;

}

/**

 *
 * @param messages 
 * @returns 
 */
export const groupMessages = (messages: Message[]): Message[][] => {
 
  return messages.reduce((groups: Message[][], currentMsg: Message, index: number) => {
    const prevMsg = messages[index - 1]; // Get the message immediately preceding the current one

    // Determine if the current message is from the same sender as the previous one
    const sameSender = prevMsg?.authorUuid === currentMsg.authorUuid;


    if (sameSender ) {
      // If same sender then add the current message to the last group
      groups[groups.length - 1].push(currentMsg);
    } else {
      // Otherwise, start a new group with the current message
      groups.push([currentMsg]);
    }

    return groups; // Return the updated groups array for the next iteration
  }, []); // Initialize 'groups' as an empty array
};