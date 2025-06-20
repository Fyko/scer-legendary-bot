# Frontend Refactor Plan 🚀

## Current State Analysis

**Problems Identified:**
- Massive components (400+ lines)
- No proper file organization
- Duplicate type definitions
- Hardcoded API URLs
- No custom hooks
- Poor separation of concerns
- Missing performance optimizations
- Inconsistent error handling

**Tech Stack:**
- React 18 + TypeScript
- TanStack Query for data fetching
- React Router for navigation
- Tailwind CSS for styling
- Bun as package manager

---

## Phase 1: Foundation & File Structure 🏗️

**Goal:** Establish proper project structure and shared utilities

**Tasks:**
1. Create new folder structure
2. Extract shared types
3. Set up API client
4. Create utility functions

**Instructions for AI:**
```
When working on Phase 1:
- Create the folder structure exactly as specified below
- Move existing code carefully to preserve functionality
- Test that the app still works after each major move
- Don't change component logic yet, just reorganize files
```

**New Folder Structure:**
```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── layout/          # Layout components (Nav, Footer, etc)
│   └── features/        # Feature-specific components
├── hooks/               # Custom hooks
├── services/            # API & external services
├── types/               # Shared type definitions
├── utils/               # Utility functions
├── constants/           # App constants
└── pages/               # Page components (keep existing for now)
```

**Specific Steps:**
1. Create all folders
2. Move types to `types/index.ts`
3. Create `services/api.ts` with centralized client
4. Create `constants/config.ts` for environment variables
5. Create `utils/date.ts` for date formatting functions
6. Update imports in existing files

---

## Phase 2: Type System & API Layer 🔧

**Goal:** Establish robust type safety and centralized API management

**Instructions for AI:**
```
Focus on type safety and API consistency:
- Extract ALL duplicate interfaces to shared types
- Create proper API client with error handling
- Add environment variable support
- Ensure all API calls use the centralized client
```

**Tasks:**
1. **Types (`types/index.ts`):**
   ```typescript
   // Extract these from existing components:
   export interface User {
     id: string;
     username: string;
     avatar_url: string;
   }
   
   export interface LatestEvent {
     id: string;
     index: number;
     url: string;
     user: User;
     created_at: string;
   }
   
   export interface LeaderboardEntry {
     user_id: string;
     total: number;
     display_name: string;
     avatar_url: string;
   }
   
   // Add these new types:
   export interface ApiError {
     message: string;
     status: number;
   }
   
   export interface PaginatedResponse<T> {
     data: T[];
     pagination: {
       page: number;
       limit: number;
       total: number;
       hasNext: boolean;
     }
   }
   ```

2. **API Client (`services/api.ts`):**
   - Create base API client class
   - Add proper error handling
   - Support for different environments
   - Typed request/response methods

3. **Constants (`constants/config.ts`):**
   ```typescript
   export const API_CONFIG = {
     BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:22291',
     ENDPOINTS: {
       LATEST: '/api/v1/latest',
       LEADERBOARD: '/api/v1/leaderboard',
       USER_LEGGIES: '/api/v1/users'
     }
   } as const;
   ```

---

## Phase 3: Custom Hooks Extraction 🪝

**Goal:** Extract business logic into reusable custom hooks

**Instructions for AI:**
```
Create custom hooks that:
- Handle data fetching logic
- Manage component state
- Provide clean APIs for components
- Include proper error handling and loading states
```

**Hooks to Create:**

1. **`hooks/useTheme.ts`:**
   - Extract theme management from App.tsx
   - Provide theme toggle functionality
   - Persist theme preference

2. **`hooks/useLeaderboard.ts`:**
   - Handle leaderboard data fetching
   - Include error and loading states
   - Auto-refresh functionality

3. **`hooks/useLatestEvents.ts`:**
   - Handle infinite scroll logic
   - Manage pagination state
   - Scroll detection

4. **`hooks/useUserLeggies.ts`:**
   - Fetch user-specific data
   - Handle loading and error states

5. **`hooks/useIntersectionObserver.ts`:**
   - Generic intersection observer hook
   - For infinite scroll functionality

**Example Hook Structure:**
```typescript
export function useLeaderboard() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => apiClient.getLeaderboard(),
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });

  return {
    leaderboard: data || [],
    isLoading,
    error,
    refetch,
    groupedLeaderboard: useMemo(() => groupByTotal(data), [data])
  };
}
```

---

## Phase 4: Component Decomposition 🧩

**Goal:** Break down massive components into smaller, focused pieces

**Instructions for AI:**
```
When breaking down components:
- Each component should have a single responsibility
- Extract UI components to components/ui/
- Keep business logic in custom hooks
- Maintain existing functionality exactly
- Test thoroughly after each extraction
```

**Components to Extract:**

1. **From LeaderboardPage.tsx (411 lines → ~100 lines):**
   - `components/ui/Avatar.tsx` - User avatar with status indicator
   - `components/ui/EventCard.tsx` - Individual event card
   - `components/ui/LeaderboardCard.tsx` - Individual leaderboard entry
   - `components/ui/PodiumCard.tsx` - Top 3 podium display
   - `components/ui/LoadingSpinner.tsx` - Loading states
   - `components/layout/Navigation.tsx` - Navigation bar
   - `components/features/LatestEvents.tsx` - Recent drops section
   - `components/features/Leaderboard.tsx` - Hall of fame section

2. **From UserPage.tsx:**
   - `components/ui/UserHeader.tsx` - User info header
   - `components/ui/UserEventCard.tsx` - User's event card
   - `components/features/UserEventsList.tsx` - List of user events

3. **New UI Components:**
   - `components/ui/Button.tsx` - Reusable button component
   - `components/ui/Badge.tsx` - Number badges and indicators
   - `components/ui/Card.tsx` - Base card component
   - `components/ui/ThemeToggle.tsx` - Theme switcher

**Component Structure Example:**
```typescript
// components/ui/Avatar.tsx
interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
  className?: string;
}

export function Avatar({ src, alt, size = 'md', showStatus, className }: AvatarProps) {
  // Clean, focused component logic
}
```

---

## Phase 5: Performance Optimization ⚡

**Goal:** Optimize rendering performance and bundle size

**Instructions for AI:**
```
Focus on performance without breaking functionality:
- Add React.memo where appropriate
- Implement virtualization for long lists
- Add code splitting with React.lazy
- Optimize re-renders with useMemo/useCallback
```

**Tasks:**
1. **Memoization:**
   - Wrap pure components with `React.memo`
   - Use `useMemo` for expensive calculations
   - Use `useCallback` for event handlers passed to children

2. **Code Splitting:**
   ```typescript
   // pages/LazyUserPage.tsx
   const UserPage = lazy(() => import('./UserPage'));
   
   // In router:
   <Route path="/users/:user_id" element={
     <Suspense fallback={<LoadingSpinner />}>
       <UserPage />
     </Suspense>
   } />
   ```

3. **Virtual Scrolling:**
   - Implement for long user lists
   - Consider `react-window` or `@tanstack/react-virtual`

4. **Bundle Analysis:**
   - Add bundle analyzer
   - Identify large dependencies
   - Optimize imports

---

## Phase 6: Error Handling & UX Polish 🐛

**Goal:** Robust error handling and improved user experience

**Instructions for AI:**
```
Add comprehensive error handling:
- Create error boundary components
- Implement proper loading states
- Add retry mechanisms
- Improve accessibility
```

**Tasks:**
1. **Error Boundaries:**
   ```typescript
   // components/ui/ErrorBoundary.tsx
   class ErrorBoundary extends Component {
     // Catch JavaScript errors anywhere in child tree
   }
   ```

2. **Loading States:**
   - Skeleton components for better perceived performance
   - Progressive loading indicators
   - Optimistic updates where appropriate

3. **Accessibility:**
   - Add proper ARIA labels
   - Improve keyboard navigation
   - Ensure color contrast compliance
   - Add focus management

4. **Error Recovery:**
   - Retry buttons for failed requests
   - Graceful degradation
   - Offline state handling

---

## Phase 7: Developer Experience 🛠️

**Goal:** Improve development workflow and maintainability

**Instructions for AI:**
```
Focus on making the code more maintainable:
- Add proper TypeScript configs
- Improve linting rules
- Add component documentation
- Set up proper barrel exports
```

**Tasks:**
1. **TypeScript Configuration:**
   - Stricter type checking
   - Path mapping for imports
   - Better IDE support

2. **Export Organization:**
   ```typescript
   // components/index.ts (barrel exports)
   export { Avatar } from './ui/Avatar';
   export { Button } from './ui/Button';
   // ... etc
   ```

3. **Documentation:**
   - JSDoc comments for complex functions
   - Component prop documentation
   - README updates

4. **Linting:**
   - Add react-hooks rules
   - Accessibility linting
   - Import organization rules

---

## Phase 8: Testing Setup & Final Polish 🧪

**Goal:** Make components testable and add final improvements

**Instructions for AI:**
```
Prepare for testing and final cleanup:
- Add data-testid attributes
- Separate pure functions for easy testing
- Clean up unused code
- Final performance check
```

**Tasks:**
1. **Testing Preparation:**
   - Add test IDs to key elements
   - Extract pure functions
   - Mock API calls properly

2. **Code Cleanup:**
   - Remove unused imports
   - Clean up commented code
   - Optimize bundle size

3. **Final Review:**
   - Check all components work correctly
   - Verify mobile responsiveness
   - Test theme switching
   - Verify all navigation works

---

## Migration Checklist ✅

**For Each Phase, Verify:**
- [ ] App still runs without errors
- [ ] All existing functionality works
- [ ] Mobile responsiveness maintained
- [ ] Theme switching works
- [ ] Navigation between pages works
- [ ] API calls still function
- [ ] Loading states display correctly
- [ ] Error states handle gracefully

**Testing Commands:**
```bash
# In frontend directory
bun run dev      # Development server
bun run build    # Production build
bun run lint     # Linting check
bun run preview  # Preview build
```

---

## Notes for Future AI Assistants 🤖

**Context:**
- This is a Discord bot leaderboard frontend
- Uses Bun as package manager (not npm/yarn)
- Backend API runs on localhost:22291
- Theme system already implemented
- Mobile-responsive design required

**Important:**
- NEVER break existing functionality
- Test thoroughly after each change
- Maintain the existing visual design
- Keep the gaming/legendary theme
- Preserve all current features (infinite scroll, user pages, etc.)

**Common Pitfalls:**
- Don't change the API contract
- Don't modify the theme toggle behavior
- Don't break the responsive design
- Don't remove the infinite scroll on leaderboard
- Don't change the user page simple scroll behavior

**When in Doubt:**
- Ask the user for clarification
- Make smaller, incremental changes
- Test each change immediately
- Keep backups of working code 
