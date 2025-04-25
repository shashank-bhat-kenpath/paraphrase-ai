# Paraphrase AI - Chrome Extension

![Paraphrase AI Demo](placeholder.gif) <!-- Optional: Add a GIF demo later -->

Enhance your writing directly on Notion pages with AI-powered text improvements.

## Features

*   **Seamless Integration:** Appears directly on Notion pages when you select text.
*   **AI-Powered Actions:**
    *   **Paraphrase:** Rephrase selected text while retaining the original meaning.
    *   **Summarize:** Generate a concise summary of the selected text.
    *   **Elaborate:** Expand on the selected text with more details and examples.
    *   **Improve:** Enhance clarity, grammar, flow, and tone of the selected text.
*   **Theme Adaptive:** Automatically matches Notion's light or dark theme.
*   **Copy Results:** Easily copy the AI-generated text to your clipboard.
*   **Secure API Key Storage:** Stores your OpenAI API key securely in Chrome's local storage.

## Installation

Since this extension isn't on the Chrome Web Store yet, you need to load it manually:

1.  **Download/Clone:** Download or clone this repository to your local machine.
2.  **Open Chrome Extensions:** Open Google Chrome, navigate to `chrome://extensions/`.
3.  **Enable Developer Mode:** Toggle the "Developer mode" switch (usually in the top-right corner).
4.  **Load Unpacked:** Click the "Load unpacked" button.
5.  **Select Folder:** Navigate to the directory where you downloaded/cloned this repository and select the main folder (the one containing `manifest.json`).
6.  **Done!** The "Paraphrase AI" extension should now appear in your list of extensions.

## Usage

1.  **Navigate to Notion:** Open any page on `notion.so`.
2.  **Select Text:** Highlight the text you want to enhance.
3.  **Choose Action:** A small popup will appear near your selection with buttons: "Paraphrase", "Summarize", "Elaborate", "Improve". Click the desired action.
4.  **Set API Key (First Time):** If this is your first time using the extension, you will be prompted to enter your OpenAI API key. You can get one from [OpenAI](https://platform.openai.com/account/api-keys).
    *   *Note:* The key is stored locally using `chrome.storage.sync` and is only sent directly to OpenAI when you perform an action.
5.  **Processing:** A loading indicator will appear while the request is sent to the OpenAI API (`gpt-4o-mini` model).
6.  **View & Copy:** Once processed, the AI-generated result will be displayed in the popup along with a "Copy" button.
7.  **Copy:** Click "Copy" to copy the result to your clipboard.
8.  **Close:** Click "Close" or click anywhere outside the popup to dismiss it.

## Development

*   Built with plain JavaScript, HTML, and CSS.
*   Uses the OpenAI API (`gpt-4o-mini` model) for text generation.
*   Content script (`content.js`) interacts with the Notion page.
*   Manifest V3.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/paraphrase-ai/issues) (replace with your actual repo link if applicable).

## License

[MIT](LICENSE) <!-- Optional: Add a LICENSE file --> 