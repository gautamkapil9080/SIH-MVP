import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const ConsultationContainer = styled.div`
  height: 100vh;
  background: #1a1a1a;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const VideoArea = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
  padding: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 10px;
  }
`;

const MainVideo = styled.div`
  background: #000;
  border-radius: 15px;
  position: relative;
  overflow: hidden;
  min-height: 400px;
  
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const SelfVideo = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 200px;
  height: 150px;
  background: #000;
  border-radius: 10px;
  border: 2px solid #2E8B57;
  overflow: hidden;
  
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 768px) {
    width: 120px;
    height: 90px;
  }
`;

const ChatPanel = styled.div`
  background: white;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    height: 200px;
  }
`;

const ChatHeader = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid #E0E0E0;
  background: ${props => props.theme.colors.primary};
  color: white;
  border-radius: 15px 15px 0 0;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  max-height: 300px;
`;

const Message = styled.div`
  margin-bottom: 15px;
  
  .sender {
    font-weight: bold;
    color: ${props => props.theme.colors.primary};
    margin-bottom: 5px;
  }
  
  .content {
    background: ${props => props.isOwn ? props.theme.colors.primary : '#F5F5F5'};
    color: ${props => props.isOwn ? 'white' : '#333'};
    padding: 10px;
    border-radius: 10px;
    font-size: 14px;
  }
`;

const ChatInput = styled.div`
  padding: 15px;
  border-top: 1px solid #E0E0E0;
  display: flex;
  gap: 10px;
  
  input {
    flex: 1;
    padding: 10px;
    border: 1px solid #E0E0E0;
    border-radius: 20px;
    outline: none;
  }
  
  button {
    background: ${props => props.theme.colors.primary};
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 20px;
    cursor: pointer;
  }
`;

const Controls = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 15px;
  background: rgba(0, 0, 0, 0.8);
  padding: 15px 30px;
  border-radius: 50px;
`;

const ControlButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s ease;
  
  &.mic {
    background: ${props => props.muted ? '#F44336' : '#4CAF50'};
    color: white;
  }
  
  &.video {
    background: ${props => props.videoOff ? '#F44336' : '#4CAF50'};
    color: white;
  }
  
  &.end {
    background: #F44336;
    color: white;
  }
  
  &:hover {
    transform: scale(1.1);
  }
`;

const ConnectionStatus = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 14px;
  
  .indicator {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.connected ? '#4CAF50' : '#F44336'};
    margin-right: 8px;
  }
`;

function VideoConsultation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([]);
  
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  useEffect(() => {
    // Initialize video call
    initializeCall();
    
    // Simulate connection after 2 seconds
    const timer = setTimeout(() => {
      setIsConnected(true);
      addMessage('System', 'Connected to consultation', false);
    }, 2000);
    
    return () => {
      clearTimeout(timer);
      // Cleanup video streams
    };
  }, []);

  const initializeCall = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // Simulate remote video (in real implementation, this would come from WebRTC)
      // For demo purposes, we'll show a placeholder
      
    } catch (error) {
      console.error('Error accessing media devices:', error);
      addMessage('System', 'Camera/microphone access denied', false);
    }
  };

  const addMessage = (sender, content, isOwn) => {
    setMessages(prev => [...prev, { 
      id: Date.now(), 
      sender, 
      content, 
      isOwn,
      timestamp: new Date().toLocaleTimeString() 
    }]);
  };

  const sendMessage = () => {
    if (chatMessage.trim()) {
      addMessage('You', chatMessage, true);
      setChatMessage('');
      
      // Simulate doctor response (in real app, this would come from the other user)
      if (Math.random() > 0.5) {
        setTimeout(() => {
          addMessage('Doctor', 'I understand. Let me help you with that.', false);
        }, 1000);
      }
    }
  };

  const toggleAudio = () => {
    setIsAudioMuted(!isAudioMuted);
    // In real implementation, mute/unmute the audio track
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    // In real implementation, enable/disable the video track
  };

  const endCall = () => {
    // Cleanup and redirect
    navigate('/patient');
  };

  return (
    <ConsultationContainer>
      <ConnectionStatus connected={isConnected}>
        <span className="indicator"></span>
        {isConnected ? 'Connected' : 'Connecting...'}
      </ConnectionStatus>
      
      <VideoArea>
        <MainVideo>
          {/* Remote video would go here */}
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(45deg, #2E8B57, #4CAF50)',
            color: 'white',
            fontSize: '24px'
          }}>
            {isConnected ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '60px', marginBottom: '10px' }}>👨‍⚕️</div>
                <div>Dr. Singh</div>
                <div style={{ fontSize: '14px', opacity: '0.8' }}>Nabha Civil Hospital</div>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div className="spinner" style={{ borderColor: 'white', borderTopColor: 'transparent' }}></div>
                <div style={{ marginTop: '20px' }}>Connecting...</div>
              </div>
            )}
          </div>
          
          <SelfVideo>
            <video 
              ref={localVideoRef}
              autoPlay
              muted
              style={{ display: isVideoOff ? 'none' : 'block' }}
            />
            {isVideoOff && (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#333',
                color: 'white'
              }}>
                📷
              </div>
            )}
          </SelfVideo>
        </MainVideo>
        
        <ChatPanel>
          <ChatHeader>
            💬 Chat
          </ChatHeader>
          <ChatMessages>
            {messages.map(message => (
              <Message key={message.id} isOwn={message.isOwn}>
                <div className="sender">{message.sender}</div>
                <div className="content">{message.content}</div>
              </Message>
            ))}
          </ChatMessages>
          <ChatInput>
            <input
              type="text"
              placeholder="Type a message..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </ChatInput>
        </ChatPanel>
      </VideoArea>
      
      <Controls>
        <ControlButton
          className="mic"
          muted={isAudioMuted}
          onClick={toggleAudio}
          title={isAudioMuted ? 'Unmute' : 'Mute'}
        >
          {isAudioMuted ? '🔇' : '🎤'}
        </ControlButton>
        
        <ControlButton
          className="video"
          videoOff={isVideoOff}
          onClick={toggleVideo}
          title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
        >
          {isVideoOff ? '📷' : '📹'}
        </ControlButton>
        
        <ControlButton
          className="end"
          onClick={endCall}
          title="End call"
        >
          📞
        </ControlButton>
      </Controls>
    </ConsultationContainer>
  );
}

export default VideoConsultation;