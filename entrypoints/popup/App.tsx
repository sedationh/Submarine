import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentPosition, setCurrentPosition] = useState<'default' | 'custom'>('default');
  const [captionsEnabled, setCaptionsEnabled] = useState<boolean>(false);

  // Function to send message to content script
  const sendMessageToContent = async (action: 'setCustom' | 'setDefault' | 'checkCaptions' | 'enableCaptions') => {
    try {
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      const activeTab = tabs[0];
      if (activeTab.id) {
        const response = await browser.tabs.sendMessage(activeTab.id, { action });
        return response;
      }
    } catch (error) {
      console.error('Failed to send message to content script:', error);
    }
  };

  // Check caption status when popup opens
  useEffect(() => {
    const checkCaptionStatus = async () => {
      const response = await sendMessageToContent('checkCaptions');
      if (response && response.captionsEnabled !== undefined) {
        setCaptionsEnabled(response.captionsEnabled);
      }
    };
    
    checkCaptionStatus();
  }, []);

  // Handle custom position
  const handleCustomPosition = async () => {
    const response = await sendMessageToContent('setCustom');
    if (response && response.success) {
      setCurrentPosition('custom');
      setCaptionsEnabled(true); // Captions will be enabled when setting custom position
    }
  };

  // Handle default position
  const handleDefaultPosition = async () => {
    const response = await sendMessageToContent('setDefault');
    if (response && response.success) {
      setCurrentPosition('default');
    }
  };

  // Handle enable captions
  const handleEnableCaptions = async () => {
    const response = await sendMessageToContent('enableCaptions');
    if (response && response.success) {
      setCaptionsEnabled(response.captionsEnabled);
    }
  };

  return (
    <div className="popup-container">
      <h1>Submarine</h1>
      <p className="subtitle">YouTube 字幕位置控制器</p>
      
      <div className="caption-status">
        <p>字幕状态：<span className={captionsEnabled ? 'enabled' : 'disabled'}>
          {captionsEnabled ? '已开启' : '未开启'}
        </span></p>
        {!captionsEnabled && (
          <button 
            className="enable-captions-btn"
            onClick={handleEnableCaptions}
          >
            开启字幕
          </button>
        )}
      </div>
      
      <div className="controls">
        <button 
          className={`control-btn ${currentPosition === 'custom' ? 'active' : ''}`}
          onClick={handleCustomPosition}
        >
          自定义位置 (CP)
        </button>
        
        <button 
          className={`control-btn ${currentPosition === 'default' ? 'active' : ''}`}
          onClick={handleDefaultPosition}
        >
          默认位置 (DP)
        </button>
      </div>
      
      <div className="info">
        <p>支持的字幕类型：</p>
        <ul>
          <li>YouTube 原生字幕</li>
        </ul>
        <p className="note">* 设置自定义位置时会自动开启字幕</p>
      </div>
      
      <div className="status">
        <p>当前状态：<span className={currentPosition}>{currentPosition === 'custom' ? '自定义位置' : '默认位置'}</span></p>
      </div>
    </div>
  );
}

export default App;
