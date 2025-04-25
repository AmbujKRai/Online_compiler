# Online Code Compiler

A web-based application that allows users to write, compile, and run code in multiple programming languages. The application also includes a snippet library feature for saving and managing code snippets.

## Features

- **Multi-language Support**: Write and compile code in JavaScript, HTML, CSS, Python, Java, C++, and C
- **Real-time Compilation**: See results instantly as you type
- **Code Snippet Library**: Save, organize, and manage your code snippets
- **User Authentication**: Secure login and registration system
- **Search and Filter**: Easily find snippets by title, description, tags, or language

## Technologies Used

- **Frontend**: React.js
- **Styling**: CSS, Bootstrap
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Code Execution**: Backend API integration

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/online-compiler.git
   cd online-compiler
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up Firebase:
   - Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Enable Authentication and Firestore
   - Copy your Firebase configuration to `src/firebaseConfig.js`

4. Start the development server:
   ```
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`