console.log("Notion AI Enhancer content script loaded.");

let popup = null;

// Theme detection
function isNotionDarkTheme() {
    // Check various Notion dark theme indicators
    return document.documentElement.classList.contains('dark') ||
           document.documentElement.getAttribute('data-theme') === 'dark' ||
           document.body.classList.contains('dark-theme') ||
           document.body.classList.contains('notion-dark-theme');
}

// Theme observer
function setupThemeObserver() {
    const observer = new MutationObserver((mutations) => {
        if (popup) {
            const isDark = isNotionDarkTheme();
            popup.classList.toggle('dark-theme', isDark);
        }
    });

    // Observe both html and body for theme changes
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class', 'data-theme']
    });
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });
}

// Call setup once DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupThemeObserver);
} else {
    setupThemeObserver();
}

document.addEventListener('mouseup', handleSelection);
document.addEventListener('mousedown', handleMouseDown);

function handleSelection(event) {
    // Small delay to ensure selection is registered
    setTimeout(() => {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        if (selectedText) {
            console.log("Text selected:", selectedText);
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect(); // Get rect directly from range
            createPopup(rect, selectedText);
        } else {
            if (popup && !popup.contains(event.target)) {
                removePopup();
            }
        }
    }, 10);
}

function handleMouseDown(event) {
    // Remove popup if clicking outside the popup itself
    if (popup && !popup.contains(event.target)) {
        const selectedText = window.getSelection().toString().trim();
        if (!selectedText) {
             removePopup();
        }
    }
}

function createPopup(rect, selectedText) {
    removePopup();

    popup = document.createElement('div');
    popup.id = 'notion-ai-enhancer-popup';
    
    // Set initial theme
    if (isNotionDarkTheme()) {
        popup.classList.add('dark-theme');
    }

    // Action buttons
    const actions = [
        { label: 'Paraphrase', action: 'paraphrase' },
        { label: 'Summarize', action: 'summarize' },
        { label: 'Elaborate', action: 'elaborate' },
        { label: 'Improve', action: 'improve' },
    ];

    actions.forEach(({ label, action }) => {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.onclick = () => handleAction(action, selectedText);
        popup.appendChild(btn);
    });

    // Positioning
    popup.style.position = 'absolute';
    popup.style.left = `${window.scrollX + rect.left}px`;
    popup.style.top = `${window.scrollY + rect.bottom + 5}px`;
    popup.style.zIndex = '10000';

    document.body.appendChild(popup);
}

function removePopup() {
    if (popup) {
        popup.remove();
        popup = null;
    }
}

async function handleAction(action, text) {
    console.log(`Action: ${action}, Text: ${text}`);

    // Show loading spinner
    popup.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <div class="loading-text">Enhancing your text...</div>
        </div>
    `;

    const apiKey = await getApiKey();
    if (!apiKey) {
        popup.innerHTML = '<div style="color: var(--error-color);">Error: API Key not set. Please reload the extension/page after setting it.</div>';
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.onclick = removePopup;
        popup.appendChild(closeBtn);
        return;
    }

    const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
    let prompt = '';

    switch (action) {
        case 'paraphrase':
            prompt = `Paraphrase the following text to maintain the same meaning but with different wording:\n\n${text}`;
            break;
        case 'summarize':
            prompt = `Provide a concise summary of the following text:\n\n${text}`;
            break;
        case 'elaborate':
            prompt = `Elaborate and expand upon the following text with more details and examples:\n\n${text}`;
            break;
        case 'improve':
            prompt = `Improve the following text by enhancing its clarity, flow, and professional tone while maintaining its core message:\n\n${text}`;
            break;
        default:
            console.error('Unknown action:', action);
            popup.innerHTML = '<div style="color: var(--error-color);">Error: Unknown action.</div>';
            const closeBtnUnknown = document.createElement('button');
            closeBtnUnknown.textContent = 'Close';
            closeBtnUnknown.onclick = removePopup;
            popup.appendChild(closeBtnUnknown);
            return;
    }

    try {
        const response = await fetch(OPENAI_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 3000
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('OpenAI API Error:', errorData);
            throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const result = data.choices[0]?.message?.content.trim();

        if (result) {
            popup.innerHTML = '';

            const resultDiv = document.createElement('div');
            resultDiv.innerHTML = result.replace(/\n/g, '<br>');
            popup.appendChild(resultDiv);

            const copyBtn = document.createElement('button');
            copyBtn.textContent = 'Copy';
            copyBtn.style.marginRight = '8px';
            copyBtn.onclick = () => {
                navigator.clipboard.writeText(result).then(() => {
                    copyBtn.textContent = '✓ Copied!';
                    setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1500);
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                    alert('Failed to copy text.');
                });
            };
            popup.appendChild(copyBtn);

        } else {
            popup.innerHTML = '<div style="color: var(--error-color);">No result received from AI.</div>';
        }

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.onclick = removePopup;
        popup.appendChild(closeBtn);

    } catch (error) {
        console.error('Error calling AI API:', error);
        popup.innerHTML = `<div style="color: var(--error-color);">Error: ${error.message}</div>`;
        
        const closeBtnError = document.createElement('button');
        closeBtnError.textContent = 'Close';
        closeBtnError.onclick = removePopup;
        popup.appendChild(closeBtnError);
    }
}

// Function to get API key (placeholder - prompts user for now)
// In a real extension, use chrome.storage or an options page
async function getApiKey() {
     // Check chrome.storage first
    const result = await chrome.storage.sync.get(['openaiApiKey']);
    if (result.openaiApiKey) {
        return result.openaiApiKey;
    }

    // If not in storage, prompt the user
    const apiKey = prompt("Please enter your OpenAI API Key:");
    if (apiKey) {
        // Save to storage for future use
        await chrome.storage.sync.set({ openaiApiKey: apiKey });
        return apiKey;
    }
    return null;
} 