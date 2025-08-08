# LearningTok MVP

TikTok-style learning MVP (React + Vite + Tailwind + Framer Motion).

## Run locally

```bash
npm install
npm run dev
```

## Import your own deck

Click **Import** and choose a JSON file of cards. Example:

```json
[
  {
    "id": "q1",
    "type": "mcq",
    "topic": "Python",
    "prompt": "What does `len([1,2,3])` return?",
    "choices": ["2", "3", "Error", "None"],
    "correctIndex": 1,
    "explain": "There are 3 elements in the list."
  },
  {
    "id": "f2",
    "type": "flashcard",
    "topic": "Hebrew",
    "front": "סבבה",
    "back": "Cool / fine"
  }
]
```
