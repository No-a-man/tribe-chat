import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MentionList from './MentionList';

export default function ChatInput() {
  const [text, setText] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const inputRef = useRef(null);

  const handleTextChange = (value) => {
    setText(value);
    
    // Detect @mention trigger
    const lastAtPos = value.lastIndexOf('@');
    if (lastAtPos > -1 && !value.substring(lastAtPos).includes(' ')) {
      setMentionQuery(value.substring(lastAtPos + 1));
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  const handleSelectMention = (user) => {
    const newText = text.replace(/@[^ ]*$/, `@${user.name} `);
    setText(newText);
    setShowMentions(false);
    inputRef.current.focus();
  };

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        style={styles.input}
        value={text}
        onChangeText={handleTextChange}
        placeholder="Type a message..."
        multiline
      />
      
      {showMentions && (
        <MentionList 
          query={mentionQuery}
          onSelect={handleSelectMention}
        />
      )}

      <TouchableOpacity style={styles.sendButton}>
        <Ionicons name="send" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: 'white',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }
});