import React, { useState, useEffect } from 'react';

interface ReCaptchaProps {
  onChange: (token: string | null) => void;
  error?: string;
  className?: string;
}

const ReCaptchaComponent: React.FC<ReCaptchaProps> = ({ 
  onChange, 
  error,
  className = ''
}) => {
  const [captchaText, setCaptchaText] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  // Generate random text for CAPTCHA
  const generateCaptchaText = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Draw the CAPTCHA on canvas
  const drawCaptcha = (text: string) => {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add noise (lines)
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.strokeStyle = `rgb(${Math.random() * 200}, ${Math.random() * 200}, ${Math.random() * 200})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    
    // Add dots
    for (let i = 0; i < 100; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        1,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = `rgb(${Math.random() * 200}, ${Math.random() * 200}, ${Math.random() * 200})`;
      ctx.fill();
    }
    
    // Text
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#333';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    
    // Draw each character with slight rotation for added security
    const textWidth = ctx.measureText(text).width;
    const startX = (canvas.width - textWidth) / 2;
    
    for (let i = 0; i < text.length; i++) {
      // Calculate character position
      const charX = startX + i * (textWidth / text.length) + 10;
      const charY = canvas.height / 2 + (Math.random() * 10 - 5);
      
      // Save state
      ctx.save();
      
      // Apply random transformations
      ctx.translate(charX, charY);
      ctx.rotate((Math.random() * 0.6) - 0.3); // Random rotation between -0.3 and 0.3 radians
      
      // Draw character
      ctx.fillText(text[i], 0, 0);
      
      // Restore state
      ctx.restore();
    }
  };

  const refreshCaptcha = () => {
    const newText = generateCaptchaText();
    setCaptchaText(newText);
    setUserInput('');
    
    // Reset CAPTCHA validation
    onChange(null);
    
    // Redraw with new text
    setTimeout(() => {
      drawCaptcha(newText);
    }, 100);
  };

  useEffect(() => {
    // Initialize CAPTCHA
    const newText = generateCaptchaText();
    setCaptchaText(newText);
  }, []);

  useEffect(() => {
    if (canvas) {
      drawCaptcha(captchaText);
    }
  }, [canvas, captchaText]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    
    // Check if the input matches the CAPTCHA text
    if (e.target.value.toLowerCase() === captchaText.toLowerCase()) {
      onChange(captchaText); // Pass the CAPTCHA text as the token
    } else {
      onChange(null);
    }
  };

  const handleCanvasRef = (ref: HTMLCanvasElement | null) => {
    if (ref) {
      setCanvas(ref);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-4">
        <label htmlFor="captcha" className="block text-sm font-medium text-gray-700 mb-2">
          CAPTCHA Verification
        </label>
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative bg-gray-100 border border-gray-300 rounded-md w-full md:w-1/2 h-16 flex items-center justify-center">
            <canvas 
              ref={handleCanvasRef} 
              width={200} 
              height={60} 
              className="rounded-md"
            />
            <button 
              type="button" 
              onClick={refreshCaptcha}
              className="absolute top-1 right-1 p-1 text-gray-600 hover:text-gray-900"
              aria-label="Refresh CAPTCHA"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          <div className="flex-1">
            <input
              type="text"
              id="captcha"
              value={userInput}
              onChange={handleInputChange}
              placeholder="Enter the text you see above"
              className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black text-sm md:text-base"
              autoComplete="off"
            />
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500">Please enter the characters you see in the image</p>
      </div>
      {error && <p className="mt-2 text-xs md:text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default ReCaptchaComponent; 