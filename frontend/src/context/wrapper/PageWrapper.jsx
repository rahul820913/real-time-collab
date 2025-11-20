import React, { useEffect, useRef } from 'react';

const PageWrapper = ({ children }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Set canvas to fill the screen
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Characters for the rain - using a wider set for variety
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{[]}?#@!$%^&*()';
        const charArray = chars.split('');
        
        const fontSize = 14;
        const columns = canvas.width / fontSize;

        // Create an array to track the y-position of each column's character
        const drops = [];
        for (let x = 0; x < columns; x++) {
            drops[x] = Math.random() * canvas.height;
        }

        const draw = () => {
            // Semi-transparent black background to create the fading trail effect
            ctx.fillStyle = 'rgba(15, 23, 42, 0.05)'; // bg-slate-900 with low opacity
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#00F48A'; // A bright, "hacker" green
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                // Get a random character
                const text = charArray[Math.floor(Math.random() * charArray.length)];
                
                // Draw the character
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                // Reset drop to the top randomly to make the rain uneven
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                // Move the drop down
                drops[i]++;
            }
        };

        const intervalId = setInterval(draw, 40); // Adjust speed here

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Recalculate columns and drops on resize
            const newColumns = canvas.width / fontSize;
            drops.length = 0; // Clear old drops
             for (let x = 0; x < newColumns; x++) {
                drops[x] = Math.random() * canvas.height;
            }
        };
        
        window.addEventListener('resize', handleResize);

        // Cleanup function
        return () => {
            clearInterval(intervalId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="relative min-h-screen w-full bg-slate-900">
            {/* The animated background canvas */}
            <canvas 
                ref={canvasRef} 
                className="absolute top-0 left-0 w-full h-full z-0"
            ></canvas>
            
            {/* The content, centered on top of the canvas */}
            <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
                {children}
            </div>
        </div>
    );
};

export default PageWrapper;