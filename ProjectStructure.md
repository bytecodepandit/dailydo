DailyDo/
├src/
│   ├── app/             # Core application setup and navigation
│   │   ├── index.tsx      # Root component, app initialization
│   │   ├── navigation/    # Navigation setup (e.g., using React Navigation)
│   │   │   ├── index.tsx
│   │   │   ├── AppNavigator.tsx
│   │   │   ├── AuthNavigator.tsx
│   │   │   └── ... (other navigators)
│   │   ├── theme/         # Application-wide theming (colors, typography, spacing)
│   │   │   ├── index.ts
│   │   │   ├── colors.ts
│   │   │   ├── typography.ts
│   │   │   └── spacing.ts
│   │   └── globalStyles.ts # Global or reset styles
│   ├── assets/          # Static assets (images, fonts, etc.)
│   ├── components/      # Reusable UI components (atomic and molecular)
│   │   ├── Button/
│   │   │   ├── index.tsx
│   │   │   ├── styles.ts
│   │   │   └── Button.test.tsx
│   │   ├── Card/
│   │   │   ├── index.tsx
│   │   │   ├── styles.ts
│   │   │   └── Card.test.tsx
│   │   └── ... (other reusable components)
│   ├── constants/       # Application-wide constants (API endpoints, etc.)
│   ├── hooks/           # Custom React Hooks for reusable logic
│   │   ├── useAuth.ts
│   │   ├── useDebounce.ts
│   │   └── ...
│   ├── models/          # Data models/interfaces (TypeScript)
│   │   ├── Task.ts
│   │   ├── User.ts
│   │   └── ...
│   ├── modules/         # Feature-specific modules (e.g., todos, user profile)
│   │   ├── todos/
│   │   │   ├── components/   # Components specific to the todos feature
│   │   │   │   ├── TodoItem.tsx
│   │   │   │   └── AddTodoForm.tsx
│   │   │   ├── hooks/        # Hooks specific to the todos feature
│   │   │   │   └── useTodoOperations.ts
│   │   │   ├── screens/      # Screens related to the todos feature
│   │   │   │   ├── TodoListScreen.tsx
│   │   │   │   └── TodoDetailScreen.tsx
│   │   │   ├── services/     # Services/API calls related to todos
│   │   │   │   └── todosApi.ts
│   │   │   ├── store/        # State management specific to todos (if needed)
│   │   │   │   └── index.ts
│   │   │   └── types/        # Types/interfaces specific to todos
│   │   │       └── index.ts
│   │   ├── userProfile/
│   │   │   └── ... (similar structure to the todos module)
│   │   └── ... (other features)
│   ├── services/        # Core services (API client, authentication service, etc.)
│   │   ├── api/
│   │   │   ├── index.ts       # Base API client setup (e.g., using Axios)
│   │   │   └── auth.ts
│   │   ├── auth/
│   │   │   ├── index.ts
│   │   │   └── AuthContext.tsx # If using Context API for auth
│   │   └── storage/       # Abstraction for local storage (AsyncStorage)
│   │       ├── index.ts
│   │       └── storageHelpers.ts
│   ├── store/           # Global state management (if using Redux, Zustand, etc.)
│   │   ├── index.ts       # Root store configuration
│   │   ├── reducers/      # (for Redux)
│   │   ├── actions/       # (for Redux)
│   │   ├── slices/        # (for Redux Toolkit or Zustand)
│   │   ├── selectors/     # (for Redux or Zustand)
│   │   └── middleware/    # (for Redux)
│   ├── types/           # Global type definitions
│   ├── utils/           # Utility functions (helpers, formatters, etc.)
│   └── __tests__/       # Unit and integration tests