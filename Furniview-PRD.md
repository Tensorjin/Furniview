```markdown project="Apple-inspired Furniview" file="documentation.md"
...
```

### Props Handling

- Use TypeScript interfaces to define props
- Extend HTML element props when appropriate
- Use destructuring to access props
- Provide default values for optional props
- Use the `cn()` utility for merging class names


## Styling Guidelines

### Tailwind CSS Usage

The project uses Tailwind CSS with a custom configuration that defines the Apple-inspired color palette and design tokens.

#### Color Palette

```typescript
// From tailwind.config.ts
colors: {
  background: {
    DEFAULT: "#FAFAF8",
    subtle: "#F0EFEA",
    muted: "#F6F1EB",
  },
  foreground: {
    DEFAULT: "#141413",
    subtle: "#3A3935",
    muted: "#605F5B",
  },
  primary: {
    DEFAULT: "#141413",
    soft: "#23241F",
    dark: "#191919",
  },
  secondary: {
    DEFAULT: "#C4C3BB",
    soft: "#A3A299",
    light: "#E6E4DD",
  },
  accent: {
    blue: "#61AAF2",
    green: "#7EBF8E",
    yellow: "#F2FF44",
    beige: "#EBDBBC",
    peach: "#D2886F",
    tan: "#D4A27F",
  },
  // ...other colors
}
```

#### Spacing and Layout

- Use Tailwind's spacing scale consistently
- Use container class for consistent width constraints
- Use flex and grid for layouts
- Use responsive prefixes for adaptive designs


#### Component Styling

- Use composition of Tailwind classes
- Group related styles together
- Use consistent spacing patterns
- Leverage the `cn()` utility for conditional classes


### Custom Animations

Custom animations are defined in `styles/animations.css` and include:

- `animate-fade-in`: Fade in animation
- `animate-slide-up`: Slide up animation
- `animate-slide-down`: Slide down animation
- `animate-scale-in`: Scale in animation
- `animate-float`: Floating animation
- `animate-pulse-subtle`: Subtle pulse animation


Use the `stagger-1` through `stagger-5` classes to create staggered animations.

### Responsive Design

- Mobile-first approach
- Use Tailwind's responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
- Test on multiple device sizes
- Ensure touch-friendly targets on mobile
- Use appropriate text sizes for each breakpoint


## State Management

### Local Component State

For component-specific state, use React's `useState` hook:

```typescriptreact
const [isOpen, setIsOpen] = useState(false)
```

### Shared State

For state shared between components, use React Context:

```typescriptreact
// Create context
export const AppContext = createContext<AppContextType | undefined>(undefined)

// Provider component
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initialState)
  
  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  )
}

// Custom hook for using the context
export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
```

### Form State

For form handling, use controlled components with React state:

```typescriptreact
const [formData, setFormData] = useState({
  name: '',
  email: '',
  message: ''
})

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target
  setFormData(prev => ({ ...prev, [name]: value }))
}
```

## Backend Integration

### Supabase Setup

The project uses Supabase for authentication, database, and storage. The Supabase client is configured in `lib/supabase/`.

#### Client-side Supabase

```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a singleton instance for client-side usage
let supabaseClient: ReturnType<typeof createClient> | null = null

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseClient
}
```

#### Server-side Supabase

```typescript
// lib/supabase/server.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const getSupabaseAdmin = () => {
  return createClient(supabaseUrl, supabaseServiceKey)
}
```

### Authentication

Implement authentication using Supabase Auth:

```typescript
// Example signup function
async function signUp(email: string, password: string) {
  const supabase = getSupabaseClient()
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  
  if (error) {
    throw error
  }
  
  return data
}

// Example login function
async function signIn(email: string, password: string) {
  const supabase = getSupabaseClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    throw error
  }
  
  return data
}
```

### Database Operations

Use Supabase client to interact with the database:

```typescript
// Example function to fetch furniture models
async function getFurnitureModels() {
  const supabase = getSupabaseClient()
  
  const { data, error } = await supabase
    .from('furniture_models')
    .select('*')
  
  if (error) {
    throw error
  }
  
  return data
}

// Example function to create a furniture model
async function createFurnitureModel(model: FurnitureModelData) {
  const supabase = getSupabaseClient()
  
  const { data, error } = await supabase
    .from('furniture_models')
    .insert([model])
    .select()
  
  if (error) {
    throw error
  }
  
  return data[0]
}
```

### File Storage

Use Supabase Storage for file uploads:

```typescript
// Example function to upload a 3D model
async function uploadModel(file: File, path: string) {
  const supabase = getSupabaseClient()
  
  const { data, error } = await supabase
    .storage
    .from('models')
    .upload(path, file)
  
  if (error) {
    throw error
  }
  
  return data
}
```

## Deployment

### Vercel Deployment

The project is deployed on Vercel, which provides:

- Automatic deployments from Git
- Preview deployments for pull requests
- Environment variable management
- Analytics and monitoring


### Deployment Process

1. Push changes to the main branch
2. Vercel automatically builds and deploys the application
3. Verify the deployment in the Vercel dashboard


### Environment Variables

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (server-side only)
- `SUPABASE_JWT_SECRET`: JWT secret for Supabase auth


### Continuous Integration

- Automated tests run on each push
- Code quality checks with ESLint
- Type checking with TypeScript


## Performance Considerations

### Code Splitting

Next.js automatically code-splits at the page level. For additional code splitting:

```typescriptreact
import dynamic from 'next/dynamic'

// Dynamically import a component
const DynamicComponent = dynamic(() => import('@/components/heavy-component'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Disable server-side rendering if needed
})
```

### Image Optimization

Use Next.js Image component for automatic optimization:

```typescriptreact
import Image from 'next/image'

<Image
  src="/path/to/image.jpg"
  width={800}
  height={600}
  alt="Description"
  priority={true} // For LCP images
/>
```

### Lazy Loading

- Use the `loading="lazy"` attribute for below-the-fold images
- Use Intersection Observer for custom lazy loading
- Use dynamic imports for non-critical components


### Performance Monitoring

- Use Vercel Analytics to monitor performance
- Set up Core Web Vitals monitoring
- Regularly audit with Lighthouse


## Accessibility

### General Guidelines

- Use semantic HTML elements
- Ensure proper heading hierarchy
- Provide alternative text for images
- Ensure sufficient color contrast
- Support keyboard navigation


### ARIA Attributes

Use ARIA attributes when necessary:

```typescriptreact
<button
  aria-label="Close menu"
  aria-expanded={isOpen}
  onClick={toggleMenu}
>
  {/* Button content */}
</button>
```

### Focus Management

- Ensure visible focus styles
- Manage focus for modals and dialogs
- Use `tabIndex` appropriately


### Screen Reader Support

- Test with screen readers
- Use `aria-live` for dynamic content
- Provide context for screen reader users


### Keyboard Navigation

- Ensure all interactive elements are keyboard accessible
- Use logical tab order
- Provide keyboard shortcuts for power users


---

This documentation provides a comprehensive overview of the Furniview project. It should serve as a guide for understanding the project structure, development practices, and technical decisions. As the project evolves, this documentation should be updated to reflect changes in architecture, technology choices, and best practices.

```plaintext

I've created a comprehensive documentation for the Furniview project that covers all the requested sections. This documentation provides:

1. A detailed project overview explaining what Furniview does
2. User journey maps for both furniture companies and end customers
3. Complete tech stack information including frontend, backend, and development tools
4. Architecture explanation with server and client component usage
5. Detailed folder structure with explanations
6. Naming conventions for files, components, functions, and CSS classes
7. Component structure guidelines with examples
8. Styling guidelines for using Tailwind CSS and custom animations
9. State management approaches for different scenarios
10. Backend integration with Supabase for auth, database, and storage
11. Deployment process on Vercel
12. Performance considerations and optimization techniques
13. Accessibility guidelines and best practices

This documentation will serve as a valuable reference for understanding the project, onboarding new developers, and maintaining consistency as the project grows. It follows Apple's design principles of clarity, simplicity, and attention to detail.

<Actions>
  <Action name="Create database schema" description="Design and implement the database schema for Furniview" />
  <Action name="Implement Supabase auth" description="Add Supabase authentication to the signup and login pages" />
  <Action name="Add user profile page" description="Create a user profile management page" />
  <Action name="Create admin dashboard" description="Build an admin dashboard for furniture companies" />
  <Action name="Add 3D model upload" description="Implement 3D model upload and processing functionality" />
</Actions>


```