// src/components/ChatInput.js
export default function ChatInput() {
  const [text, setText] = useState('');
  const sendMessage = useMessagesStore(state => state.sendMessage);

  const handleSend = async () => {
    if (text.trim()) {
      await sendMessage(text);
      setText('');
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Type a message..."
        multiline
      />
      <TouchableOpacity onPress={handleSend}>
        <Ionicons name="send" size={24} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );
}