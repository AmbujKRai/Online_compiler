# Online Code Compiler

A web-based application that allows users to write, compile, and run code in multiple programming languages. The application also includes a snippet library feature for saving and managing code snippets.

## Features

- **Multi-language Support**: Write and compile code in JavaScript, HTML, CSS, Python, Java, C++, and C
- **Real-time Compilation**: See results instantly as you type
- **Code Snippet Library**: Save, organize, and manage your code snippets
- **User Authentication**: Secure login and registration system
- **Responsive Design**: Works on desktop and mobile devices
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

## Usage

### Compiling Code

1. Select your programming language from the dropdown menu
2. Write your code in the editor
3. Click the "Run" button to compile and execute your code
4. View the output in the results panel

### Managing Code Snippets

1. Click "Add New Snippet" to create a new snippet
2. Fill in the title, select language, and paste your code
3. Add an optional description and tags
4. Click "Save Snippet" to store your snippet
5. Use the search and filter options to find your snippets
6. View, edit, or delete snippets as needed

## Project Structure

```
online-compiler/
├── public/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Auth.css
│   │   ├── Compiler/
│   │   │   ├── CodeEditor.jsx
│   │   │   ├── Output.jsx
│   │   │   └── Compiler.css
│   │   ├── SnippetLibrary.jsx
│   │   ├── SnippetLibrary.css
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── firebaseConfig.js
├── package.json
└── README.md
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Firebase for authentication and database services
- React community for excellent documentation and tools
- All contributors who have helped improve this project
