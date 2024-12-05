# Lettercraft

Lettercraft is a web application designed to help users craft personalized cover letters with the assistance of AI. By uploading a resume and job description, users can generate a tailored cover letter in various languages and tones, enhancing their job application process.

## Features

- **AI-Powered Cover Letter Generation:** Uses AI to create customized cover letters based on the uploaded resume and job description.
- **File Upload Support:** Supports uploading of PDF and image files for resumes and job descriptions.
- **Multi-Language and Tone Options:** Allows selection from various languages and tones to fit the job application requirements.
- **Progress Indication:** Displays the progress of the cover letter generation process.
- **Clipboard Copying:** Easily copy the generated cover letter to the clipboard.
- **Download Option:** Allows downloading the generated cover letter as a PDF.

## Getting Started

### Prerequisites

- Node.js and npm
- A Google Gemini API Key, set in an `.env` file as `GEMINI_API_KEY`

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/hafizhlf/lettercraft.git
   ```

2. **Navigate to the Directory:**

   ```bash
   cd lettercraft
   ```

3. **Install Dependencies:**

   ```bash
   npm install
   ```

4. **Set up Environment Variables:**

   Create a `.env` file in the root directory and add your API key:

   ```plaintext
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

5. **Run the Application:**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## Usage

1. **Upload Files:** Upload your resume and job description as PDF or image files.
2. **Configure Settings:** Choose the preferred language and tone for your cover letter.
3. **Generate Cover Letter:** Click on "Generate Cover Letter" to create a personalized letter.
4. **Copy or Download:** Copy the generated cover letter to your clipboard or download it as a PDF.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or report an issue.

## License

Distributed under the GPL-3.0 License. See `LICENSE` for more information.

## Contact

- **GitHub:** [@hafizhlf](https://github.com/hafizhlf)
- **Email:** hafizhlf@outlook.com
