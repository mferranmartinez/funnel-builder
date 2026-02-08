# Upsell Funnel Builder

## How to Run Locally

### Prerequisites
- Node.js 18+ and npm

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## Usage

### Adding Nodes
1. **Drag from Palette**: Drag a node type from the left sidebar onto the canvas
2. **Click to Add**: Click a node type in the palette to add it to the center

### Connecting Nodes
1. Click and drag from the bottom handle (source) of a node
2. Connect to the top handle (target) of another node
3. Connections are animated and styled as smooth curves

### Keyboard Shortcuts
- `Ctrl+Z`: Undo
- `Ctrl+Y`: Redo
- `Delete`: Delete selected nodes/edges

### Persistence
- **Save**: Saves current funnel to browser localStorage
- **Load**: Loads funnel from localStorage
- **Export**: Downloads funnel as JSON file
- **Import**: Uploads JSON file to restore funnel

## Project Structure

```
src/
├── components/
│   ├── FunnelNode.tsx      # Custom node component
│   ├── Palette.tsx         # Left sidebar with node types
│   ├── Controls.tsx        # Top-right toolbar (save/load/undo/redo)
│   └── ValidationPanel.tsx # Bottom-right validation messages
├── hooks/
│   └── useUndoRedo.ts     # Undo/redo state management
├── utils/
│   ├── validation.ts       # Funnel validation logic
│   └── storage.ts          # localStorage & JSON import/export
├── types.ts                # TypeScript type definitions
├── constants.ts            # Node templates & configuration
├── App.tsx                 # Main application component
└── index.css               # Tailwind directives & global styles
```

## What I'd Improve Next

-  Style update
-  Backend integration
-  Dark mode
-  Multi selection(to move and delete)
-  Templates(pre built funnel templates)
-  Unit tests
