# CLAUDE.md - AI Assistant Guide for Pair Wine & Food Pairing App

**Last Updated**: 2025-11-15
**Repository**: Pair - Wine & Food Pairing iOS/Android Application
**Tech Stack**: React Native (Expo) + Node.js/Express + MongoDB

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Repository Structure](#repository-structure)
3. [Tech Stack](#tech-stack)
4. [Quick Start](#quick-start)
5. [Architecture Patterns](#architecture-patterns)
6. [File Organization & Naming Conventions](#file-organization--naming-conventions)
7. [Database Models](#database-models)
8. [API Endpoints](#api-endpoints)
9. [Authentication & Authorization](#authentication--authorization)
10. [State Management](#state-management)
11. [Key Conventions & Best Practices](#key-conventions--best-practices)
12. [Common Development Workflows](#common-development-workflows)
13. [Testing](#testing)
14. [Deployment](#deployment)
15. [Important Gotchas](#important-gotchas)

---

## Project Overview

**Pair** is a wine and food pairing application that helps users:
- Scan wine labels using their device camera
- Get AI-powered food pairing recommendations
- Browse and save favorite wines and pairings
- Share pairings with a community
- Manage user profiles and preferences

**Architecture**: Monorepo containing both frontend (React Native/Expo) and backend (Node.js/Express/TypeScript)

---

## Repository Structure

```
/home/user/Pair/
├── app/                                    # Frontend screens + Backend API
│   ├── wine-recognition-backend/           # Backend service (Node.js/Express/TypeScript)
│   │   ├── src/
│   │   │   ├── api/
│   │   │   │   ├── controllers/            # Route handlers
│   │   │   │   └── routes/                 # Route definitions
│   │   │   ├── config/                     # Database connection
│   │   │   ├── middleware/                 # Auth, logging, etc.
│   │   │   ├── models/                     # Mongoose schemas
│   │   │   ├── services/                   # Business logic
│   │   │   ├── ml/                         # ML pipeline orchestration
│   │   │   ├── utils/                      # Utilities
│   │   │   ├── app.ts                      # Express app configuration
│   │   │   └── index.ts                    # Server entry point
│   │   ├── tests/                          # Backend tests
│   │   ├── dist/                           # Compiled JavaScript (gitignored)
│   │   ├── package.json                    # Backend dependencies
│   │   └── tsconfig.json                   # Backend TypeScript config
│   ├── *.tsx                               # Frontend screens (Expo Router)
│   ├── config/                             # Frontend configuration
│   └── services/                           # Frontend API client
├── components/                             # Reusable React components
├── contexts/                               # React Context providers
├── constants/                              # App-wide constants
├── utils/                                  # Utility functions
├── data/                                   # Data files and ML datasets
│   └── kaggle/                             # Wine-food pairing dataset
├── node_modules/                           # Frontend dependencies
├── package.json                            # Frontend dependencies
├── tsconfig.json                           # Frontend TypeScript config
├── app.json                                # Expo configuration
├── metro.config.js                         # Metro bundler config
├── railway.json                            # Railway deployment config
└── README.md, DEPLOYMENT_GUIDE.md          # Documentation
```

**Key Insight**: This is a **monorepo** with two separate `package.json` files - one for frontend (root) and one for backend (`app/wine-recognition-backend/`).

---

## Tech Stack

### Frontend

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Framework** | React Native | 0.79.1 | Mobile app framework |
| | Expo | 53.0.4 | Development platform |
| | React | 19.0.0 | UI library |
| **Routing** | Expo Router | 5.0.3 | File-based routing |
| **State** | React Context API | - | Auth & app state |
| | TanStack Query | 5.90.5 | Server state (underutilized) |
| | Zustand | 5.0.2 | Alternative state (unused) |
| **Styling** | NativeWind | 4.1.23 | Tailwind for RN |
| | StyleSheet API | - | React Native styles |
| **UI Components** | Lucide React Native | 0.475.0 | Icons |
| | Expo Blur | 14.1.4 | Blur effects |
| | Expo Linear Gradient | 14.1.4 | Gradients |
| **Device** | Expo Camera | 16.1.11 | Camera access |
| | Expo Image Picker | 16.1.4 | Photo library |
| | Expo Location | 18.1.4 | Geolocation |
| | Expo Haptics | 14.1.4 | Haptic feedback |
| **Data/API** | Axios | 1.13.1 | HTTP client |
| | Zod | 4.1.12 | Schema validation |
| **Storage** | AsyncStorage | 2.1.2 | Persistent storage |

### Backend

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Runtime** | Node.js | >=18.0.0 | JavaScript runtime |
| **Framework** | Express | 4.18.2 | Web framework |
| **Language** | TypeScript | 5.3.3 | Type safety |
| **Database** | MongoDB | 6.20.0 | NoSQL database |
| | Mongoose | 8.19.2 | ODM/ORM |
| **Auth** | JWT | 9.0.2 | Token-based auth |
| | bcryptjs | 3.0.2 | Password hashing |
| **Middleware** | CORS | 2.8.5 | Cross-origin requests |
| | Multer | 1.4.5 | File uploads |
| | Body Parser | 1.20.2 | Request parsing |
| **Dev Tools** | ts-node | - | TypeScript execution |
| | nodemon | - | Auto-restart |

---

## Quick Start

### Prerequisites
```bash
# Required
node --version    # Should be v18+
npm --version
expo --version

# Verify installations
git --version
```

### Frontend Setup
```bash
# From repository root
npm install
npm start          # Starts Expo dev server
# OR use the convenience script
./start-frontend.sh
```

### Backend Setup
```bash
# Navigate to backend directory
cd app/wine-recognition-backend

# Install dependencies
npm install

# Set up environment variables (create .env file)
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/pair_wine_db
JWT_SECRET=your-super-secret-key

# Run in development mode
npm run dev        # Uses nodemon + ts-node
# OR use the convenience script from root
./start-backend.sh
```

### Database Setup
```bash
# Local MongoDB
# Install MongoDB locally or use Docker:
docker run -d -p 27017:27017 --name pair-mongo mongo:latest

# Production MongoDB Atlas
# See DEPLOYMENT_GUIDE.md for detailed instructions
```

---

## Architecture Patterns

### 1. Monorepo Architecture

**Critical Pattern**: Two separate Node.js projects in one repository:
- **Frontend**: Root level (`package.json`, `tsconfig.json`)
- **Backend**: Subdirectory (`app/wine-recognition-backend/package.json`)

**Metro Bundler Exclusion**: The frontend Metro bundler explicitly excludes the backend:
```javascript
// metro.config.js
config.resolver.blockList = [
  /app\/wine-recognition-backend\/.*/,
];
```

### 2. File-Based Routing (Expo Router)

Screens in `/app/` directory map directly to routes:

| File Path | Route | Description |
|-----------|-------|-------------|
| `app/index.tsx` | `/` | Home screen |
| `app/login.tsx` | `/login` | Login screen |
| `app/register.tsx` | `/register` | Registration |
| `app/scan-wine.tsx` | `/scan-wine` | Wine scanner |
| `app/profile.tsx` | `/profile` | User profile |
| `app/_layout.tsx` | - | Root layout/providers |
| `app/+not-found.tsx` | `*` | 404 handler |

### 3. Backend MVC Pattern

**Controller → Service → Model** architecture:

```
Request → Route → Controller → Service → Model → Database
                              ↓
                          Response
```

**Example Flow**:
```typescript
// Route (app/wine-recognition-backend/src/api/routes/wines.ts)
router.get('/wines', getWines);

// Controller (src/api/controllers/wineController.ts)
export const getWines = async (req, res) => {
  const wines = await wineService.getAll();
  res.json({ success: true, data: wines });
};

// Service (src/services/wineService.ts)
class WineService {
  async getAll() {
    return await Wine.find();
  }
}

// Model (src/models/Wine.ts)
const Wine = mongoose.model('Wine', WineSchema);
```

### 4. Context-Based State Management

**Two Primary Contexts**:
1. **AuthContext**: User authentication, token management
2. **AppContext**: App-wide state (posts, saved items)

**Pattern**: Context + Custom Hook
```typescript
// contexts/AuthContext.tsx
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // ... logic
  return <AuthContext.Provider value={...}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

// Usage in components
const { user, login, logout } = useAuth();
```

### 5. API Client Pattern

**Single Axios Instance** (`app/services/api.ts`):
```typescript
const apiClient = axios.create({
  baseURL: __DEV__
    ? 'http://localhost:3001/api'
    : 'https://pair-wine-backend-production.up.railway.app/api',
  timeout: 10000,
});

// Token injection via useEffect in AuthContext
if (token) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
```

---

## File Organization & Naming Conventions

### Frontend

| Type | Convention | Example | Location |
|------|------------|---------|----------|
| **Screens** | kebab-case.tsx | `scan-wine.tsx` | `/app/` |
| **Components** | PascalCase.tsx | `ProtectedRoute.tsx` | `/components/` |
| **Contexts** | PascalCase + Context suffix | `AuthContext.tsx` | `/contexts/` |
| **Utils** | camelCase.ts | `matchingLogic.ts` | `/utils/` |
| **Constants** | camelCase.ts | `pairings.ts` | `/constants/` |

### Backend

| Type | Convention | Example | Location |
|------|------------|---------|----------|
| **Models** | PascalCase.ts | `User.ts`, `Wine.ts` | `src/models/` |
| **Controllers** | camelCase + Controller suffix | `authController.ts` | `src/api/controllers/` |
| **Routes** | camelCase plural | `wines.ts`, `pairings.ts` | `src/api/routes/` |
| **Services** | camelCase + Service suffix | `pairingService.ts` | `src/services/` |
| **Middleware** | camelCase | `auth.ts` | `src/middleware/` |

### Code Style Patterns

**Controllers**: Export named functions
```typescript
export const register = async (req: Request, res: Response) => { ... };
export const login = async (req: Request, res: Response) => { ... };
```

**Services**: Export class instances or classes
```typescript
export class PairingService {
  async findPairings(wineId: string) { ... }
}
```

**Models**: Export Mongoose model as default
```typescript
export default mongoose.model<IUser>('User', UserSchema);
```

---

## Database Models

### User Model
**Location**: `app/wine-recognition-backend/src/models/User.ts`

```typescript
interface IUser {
  email: string;                      // unique, indexed, lowercase
  username: string;                   // unique, indexed
  passwordHash?: string;              // bcrypt hashed, select: false
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  preferences?: {
    favoriteWineTypes?: string[];
    favoriteRegions?: string[];
    favoriteGrapeVarieties?: string[];
    dietaryRestrictions?: string[];
    spicePreference?: number;         // 1-5
    sweetnessPreference?: number;     // 1-5
  };
  savedWines?: ObjectId[];            // ref: 'Wine'
  savedPairings?: ObjectId[];         // ref: 'Pairing'
  favoriteRestaurants?: string[];
  isPremium: boolean;                 // default: false, indexed
  isActive: boolean;                  // default: true, indexed
  lastLoginAt?: Date;
  createdAt: Date;                    // auto-managed
  updatedAt: Date;                    // auto-managed
}
```

**Indexes**:
- Single: `email`, `username`, `isPremium`, `isActive`
- Compound: `email + isActive`, `username + isActive`

**Methods**:
```typescript
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean>
```

**Middleware**:
- Pre-save: Auto-hashes password with bcrypt (10 rounds)

---

### Wine Model
**Location**: `app/wine-recognition-backend/src/models/Wine.ts`

```typescript
interface IWine {
  name: string;                       // required, indexed
  type: 'red' | 'white' | 'rosé' | 'sparkling' | 'dessert'; // required, indexed
  category?: string;
  region: string;                     // required, indexed
  country?: string;
  vintage?: number;                   // 1800-present
  grapeVariety?: string;              // indexed
  description?: string;
  body?: number;                      // 1-4 scale
  sweetness?: number;                 // 1-4 scale
  acidity?: number;                   // 1-4 scale
  tannin?: number;                    // 1-4 scale
  alcohol?: number;                   // 0-25 ABV
  aromas?: string[];
  flavors?: string[];
  imageUrl?: string;
  rating?: number;                    // 0-5 stars
  price?: number;
  winery?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes**:
- Single: `name`, `type`, `region`, `grapeVariety`
- Compound: `type + region`, `grapeVariety + vintage (desc)`
- Text: `name + description` (full-text search)

---

### Pairing Model
**Location**: `app/wine-recognition-backend/src/models/Pairing.ts`

```typescript
interface IPairing {
  wineId: ObjectId;                   // ref: 'Wine', required, indexed
  wineName?: string;                  // denormalized for performance
  wineType?: string;                  // denormalized for performance
  foodCategory: string;               // required, indexed
  foodName: string;                   // required, indexed
  foodDescription?: string;
  pairingScore: number;               // 0-100, indexed
  pairingReason?: string;
  complementaryFlavors?: string[];
  contrastingFlavors?: string[];
  imageUrl?: string;
  userId?: ObjectId;                  // ref: 'User', indexed
  isVerified: boolean;                // default: false, indexed
  votes?: number;                     // default: 0
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes**:
- Single: `wineId`, `foodCategory`, `foodName`, `pairingScore`, `userId`, `isVerified`
- Compound: `wineId + foodCategory`, `pairingScore (desc) + isVerified`
- Text: `foodName + foodDescription`

**Design Pattern**: Denormalization for performance
- Stores wine name/type directly to avoid joins on common queries

---

## API Endpoints

**Base URL**:
- **Development**: `http://localhost:3001/api`
- **Production**: `https://pair-wine-backend-production.up.railway.app/api`

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Auth | Controller | Description |
|--------|----------|------|------------|-------------|
| POST | `/api/auth/register` | No | `register` | Create new user account |
| POST | `/api/auth/login` | No | `login` | Authenticate user |
| GET | `/api/auth/me` | Yes | `getMe` | Get current user profile |
| PUT | `/api/auth/profile` | Yes | `updateProfile` | Update user profile |
| PUT | `/api/auth/change-password` | Yes | `changePassword` | Change password |

**Request/Response Examples**:

```typescript
// POST /api/auth/register
{
  "email": "user@example.com",
  "username": "wineuser",
  "password": "securepass123",
  "firstName": "John",
  "lastName": "Doe"
}

// Response
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "username": "wineuser",
      // ... other user fields (no passwordHash)
    }
  }
}

// POST /api/auth/login
{
  "emailOrUsername": "user@example.com",  // or "wineuser"
  "password": "securepass123"
}

// Response: Same as register
```

---

### Wine Routes (`/api/wines`)

| Method | Endpoint | Auth | Controller | Description |
|--------|----------|------|------------|-------------|
| GET | `/api/wines` | No | `getAllWines` | Get all wines (with filters) |
| GET | `/api/wines/:id` | No | `getWine` | Get single wine by ID |
| POST | `/api/wines` | Yes | `addWine` | Add new wine |
| PUT | `/api/wines/:id` | Yes | `updateWine` | Update wine |

---

### Pairing Routes (`/api/pairings`)

| Method | Endpoint | Auth | Controller | Description |
|--------|----------|------|------------|-------------|
| GET | `/api/pairings` | No | `getPairings` | Get all pairings |
| POST | `/api/pairings` | Yes | `addPairing` | Add new pairing |
| GET | `/api/pairings/expert` | No | `getExpertPairings` | Get verified pairings |

---

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Backend health check |

**Response**:
```json
{
  "message": "WineMate Backend API",
  "status": "running"
}
```

---

## Authentication & Authorization

### Authentication Flow

#### 1. Registration Flow
**File**: `app/wine-recognition-backend/src/api/controllers/authController.ts:register`

```typescript
// Steps:
1. Validate input (email, username, password)
2. Check password length (min 6 chars)
3. Check for existing user (email or username)
4. Create user → triggers pre-save hook → hashes password
5. Generate JWT token (7-day expiration)
6. Return token + user data (passwordHash excluded)
```

#### 2. Login Flow
**File**: `app/wine-recognition-backend/src/api/controllers/authController.ts:login`

```typescript
// Steps:
1. Find user by email OR username
2. Explicitly select passwordHash: User.findOne(...).select('+passwordHash')
3. Verify account is active (isActive === true)
4. Compare password using bcrypt: user.comparePassword(password)
5. Update lastLoginAt timestamp
6. Generate JWT token
7. Return token + user data (passwordHash excluded)
```

#### 3. Token Verification
**File**: `app/wine-recognition-backend/src/middleware/auth.ts:authenticate`

```typescript
// Middleware usage:
router.get('/profile', authenticate, getProfile);

// Process:
1. Extract token from Authorization header: "Bearer <token>"
2. Verify JWT signature and decode
3. Extract userId from token payload
4. Query user from database (exclude passwordHash)
5. Check user exists and isActive === true
6. Attach user to req.user
7. Call next()

// Error handling:
- No token → 401 "Access denied"
- Invalid token → 401 "Invalid token"
- Expired token → 401 "Token expired"
- User not found → 401 "User not found"
- Account deactivated → 401 "Account deactivated"
```

### Frontend Authentication

**File**: `contexts/AuthContext.tsx`

```typescript
// Authentication state
const { user, token, loading, isAuthenticated } = useAuth();

// Available methods
await login(emailOrUsername, password);      // Login and store token
await register(userData);                     // Register new user
await logout();                               // Clear token and user data
await updateProfile(data);                    // Update user profile

// Token persistence
AsyncStorage.setItem('authToken', token);     // Store on login
AsyncStorage.setItem('user', JSON.stringify(user));

// Token injection
apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Auto-verification on app start
useEffect(() => {
  const storedToken = await AsyncStorage.getItem('authToken');
  if (storedToken) {
    // Verify token is still valid
    await apiClient.get('/auth/me');
  }
}, []);
```

### Protected Routes

**Component**: `components/ProtectedRoute.tsx`

```typescript
// Usage pattern
<ProtectedRoute>
  <ProfileScreen />
</ProtectedRoute>

// Behavior:
if (!loading && !isAuthenticated) {
  router.replace('/login');  // Redirect to login
}
```

### Authorization Patterns

**Premium Features** (optional):
```typescript
// Middleware: src/middleware/auth.ts:requirePremium
export const requirePremium = (req, res, next) => {
  if (!req.user?.isPremium) {
    return res.status(403).json({ error: 'Premium subscription required' });
  }
  next();
};

// Usage (currently not actively used):
router.get('/premium-feature', authenticate, requirePremium, handler);
```

---

## State Management

### 1. AuthContext (Primary Authentication State)
**File**: `contexts/AuthContext.tsx`

**Responsibilities**:
- User authentication state
- JWT token management
- Login/logout/register methods
- Profile updates
- Token persistence via AsyncStorage
- Automatic token injection into API client

**Usage**:
```typescript
import { useAuth } from '@/contexts/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <LoginPrompt />;

  return <div>Welcome, {user.username}!</div>;
};
```

---

### 2. AppContext (Application State)
**File**: `contexts/AppContext.tsx`

**Responsibilities**:
- Community posts state
- Saved wines and pairings
- App-wide data management

**Pattern**: Uses `@nkzw/create-context-hook` for cleaner context creation

**Usage**:
```typescript
import { useApp } from '@/contexts/AppContext';

const MyComponent = () => {
  const { posts, addPost, savedWines, saveWine } = useApp();

  const handleSaveWine = (wine) => {
    saveWine(wine);
  };

  return <WineList wines={savedWines} onSave={handleSaveWine} />;
};
```

---

### 3. TanStack Query (React Query)
**Setup**: QueryClientProvider in `app/_layout.tsx`

**Current Status**: Installed but **underutilized** - opportunity for improvement

**Potential Usage**:
```typescript
// Example implementation (not currently in codebase)
import { useQuery, useMutation } from '@tanstack/react-query';

const { data: wines, isLoading } = useQuery({
  queryKey: ['wines'],
  queryFn: () => apiClient.get('/wines').then(res => res.data),
});

const mutation = useMutation({
  mutationFn: (newWine) => apiClient.post('/wines', newWine),
  onSuccess: () => queryClient.invalidateQueries(['wines']),
});
```

---

### 4. AsyncStorage (Persistence Layer)

**Stored Keys**:
- `authToken` - JWT authentication token
- `user` - Stringified user object
- `savedWines` - Array of saved wine IDs (via AppContext)
- `savedPairings` - Array of saved pairing IDs (via AppContext)

**Pattern**:
```typescript
// Save
await AsyncStorage.setItem('authToken', token);
await AsyncStorage.setItem('user', JSON.stringify(user));

// Retrieve
const token = await AsyncStorage.getItem('authToken');
const user = JSON.parse(await AsyncStorage.getItem('user') || 'null');

// Remove
await AsyncStorage.removeItem('authToken');
```

---

## Key Conventions & Best Practices

### 1. TypeScript Strict Mode

Both frontend and backend use strict TypeScript:
```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

**Implication**: Always provide type annotations, handle null/undefined cases.

---

### 2. Interface-First Design

**Pattern**: Define interfaces before implementation

```typescript
// Models
export interface IUser extends Document { ... }
const UserSchema = new Schema<IUser>({ ... });

// Controllers
interface AuthRequest extends Request {
  user?: IUser;
}
```

---

### 3. Error Response Format

**Standardized Error Response**:
```typescript
// Success
{
  "success": true,
  "data": { ... }
}

// Error
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

**Example**:
```typescript
// In controllers
try {
  const result = await service.doSomething();
  res.json({ success: true, data: result });
} catch (error) {
  res.status(500).json({
    success: false,
    message: 'Operation failed',
    error: error.message
  });
}
```

---

### 4. Mongoose Model Exports

**Convention**: Export model as default
```typescript
// models/User.ts
export interface IUser extends Document { ... }
const UserSchema = new Schema<IUser>({ ... });
export default mongoose.model<IUser>('User', UserSchema);

// Usage in other files
import User from '../models/User';
const users = await User.find();
```

---

### 5. Controller Function Exports

**Convention**: Export named functions
```typescript
// controllers/wineController.ts
export const getAllWines = async (req, res) => { ... };
export const getWine = async (req, res) => { ... };
export const addWine = async (req, res) => { ... };

// routes/wines.ts
import { getAllWines, getWine, addWine } from '../controllers/wineController';
router.get('/wines', getAllWines);
router.get('/wines/:id', getWine);
router.post('/wines', authenticate, addWine);
```

---

### 6. Service Class Pattern

**Convention**: Use classes for services
```typescript
// services/pairingService.ts
export class PairingService {
  async findPairings(wineId: string) {
    // Business logic here
  }

  async calculateScore(wine, food) {
    // Scoring algorithm
  }
}

// Usage
import { PairingService } from '../services/pairingService';
const pairingService = new PairingService();
const pairings = await pairingService.findPairings(wineId);
```

---

### 7. Platform-Specific Styling

**Pattern**: Use `Platform.select()` for iOS/Android differences
```typescript
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  card: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
```

---

### 8. Environment-Aware Configuration

**Frontend**: Use `__DEV__` global
```typescript
// app/config/api.ts
const ENV = {
  dev: {
    apiUrl: 'http://localhost:3001/api',
  },
  prod: {
    apiUrl: 'https://pair-wine-backend-production.up.railway.app/api',
  },
};

export default __DEV__ ? ENV.dev : ENV.prod;
```

**Backend**: Use `process.env.NODE_ENV`
```typescript
const isDevelopment = process.env.NODE_ENV === 'development';
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pair_wine_db';
```

---

### 9. Password Security

**Always use select: false for passwordHash**:
```typescript
// Model definition
const UserSchema = new Schema({
  passwordHash: { type: String, select: false },  // ← Important!
});

// Explicitly select when needed
const user = await User.findOne({ email }).select('+passwordHash');
await user.comparePassword(password);

// Default queries exclude passwordHash
const user = await User.findById(id);  // passwordHash not included
```

---

### 10. Database Indexing Strategy

**Pattern**: Index all frequently queried fields
```typescript
// Single field indexes
name: { type: String, index: true }

// Compound indexes
UserSchema.index({ email: 1, isActive: 1 });
WineSchema.index({ type: 1, region: 1 });

// Text search indexes
WineSchema.index({ name: 'text', description: 'text' });
```

**Use Case**:
- Single: Direct lookups (`email`, `username`)
- Compound: Filtered queries (`type + region`)
- Text: Full-text search capabilities

---

## Common Development Workflows

### 1. Adding a New API Endpoint

**Steps**:

1. **Define the route** (`src/api/routes/*.ts`)
```typescript
// src/api/routes/wines.ts
import { getWineByRegion } from '../controllers/wineController';
router.get('/wines/region/:region', getWineByRegion);
```

2. **Create the controller** (`src/api/controllers/*.ts`)
```typescript
// src/api/controllers/wineController.ts
export const getWineByRegion = async (req: Request, res: Response) => {
  try {
    const { region } = req.params;
    const wines = await wineService.findByRegion(region);
    res.json({ success: true, data: wines });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wines',
      error: error.message
    });
  }
};
```

3. **Add service method** (`src/services/*.ts`)
```typescript
// src/services/wineService.ts
export class WineService {
  async findByRegion(region: string) {
    return await Wine.find({ region }).sort({ rating: -1 });
  }
}
```

4. **Update frontend API client** (`app/services/api.ts` or screen file)
```typescript
// In component
const fetchWinesByRegion = async (region: string) => {
  const response = await apiClient.get(`/wines/region/${region}`);
  return response.data.data;
};
```

---

### 2. Adding a New Screen (Frontend)

**Steps**:

1. **Create screen file** (`app/new-feature.tsx`)
```typescript
// app/wine-detail.tsx
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function WineDetailScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Wine Detail for ID: {id}</Text>
    </View>
  );
}
```

2. **Navigation** - Expo Router handles routes automatically
```typescript
// Navigate from another screen
import { router } from 'expo-router';
router.push('/wine-detail?id=123');
// OR
router.push({ pathname: '/wine-detail', params: { id: '123' } });
```

3. **Add to navigation stack** (if needed in `app/_layout.tsx`)
```typescript
<Stack>
  <Stack.Screen name="wine-detail" options={{ title: 'Wine Detail' }} />
</Stack>
```

---

### 3. Adding a New Database Model

**Steps**:

1. **Define interface and schema** (`src/models/NewModel.ts`)
```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface INewModel extends Document {
  field1: string;
  field2: number;
  createdAt: Date;
  updatedAt: Date;
}

const NewModelSchema = new Schema<INewModel>({
  field1: { type: String, required: true, index: true },
  field2: { type: Number, default: 0 },
}, { timestamps: true });

// Indexes
NewModelSchema.index({ field1: 1, createdAt: -1 });

export default mongoose.model<INewModel>('NewModel', NewModelSchema);
```

2. **Create service** (`src/services/newModelService.ts`)
```typescript
import NewModel from '../models/NewModel';

export class NewModelService {
  async create(data) {
    return await NewModel.create(data);
  }

  async findAll() {
    return await NewModel.find().sort({ createdAt: -1 });
  }
}
```

3. **Create routes and controllers** (follow pattern from step 1)

---

### 4. Implementing Protected Routes

**Backend**:
```typescript
// src/api/routes/example.ts
import { authenticate } from '../../middleware/auth';
import { protectedHandler } from '../controllers/exampleController';

router.get('/protected-endpoint', authenticate, protectedHandler);
```

**Frontend**:
```typescript
// app/protected-screen.tsx
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ProtectedScreen() {
  return (
    <ProtectedRoute>
      <View>
        <Text>This content requires authentication</Text>
      </View>
    </ProtectedRoute>
  );
}
```

---

### 5. Adding State to AppContext

**Steps**:

1. **Update context** (`contexts/AppContext.tsx`)
```typescript
export const [AppProvider, useApp] = createContextHook(() => {
  const [newState, setNewState] = useState(initialValue);

  const newMethod = async (data) => {
    // Logic here
    setNewState(updatedValue);
    await AsyncStorage.setItem('newState', JSON.stringify(updatedValue));
  };

  // Load on mount
  useEffect(() => {
    const loadData = async () => {
      const stored = await AsyncStorage.getItem('newState');
      if (stored) setNewState(JSON.parse(stored));
    };
    loadData();
  }, []);

  return useMemo(() => ({
    newState,
    newMethod,
    // ... other state
  }), [newState, /* ... */]);
});
```

2. **Use in components**
```typescript
const { newState, newMethod } = useApp();
```

---

## Testing

### Backend Testing

**Location**: `app/wine-recognition-backend/tests/`

**Structure**:
```
tests/
├── unit/
│   └── recognition.test.ts
└── integration/
    └── api.test.ts
```

**Framework**: Jest (based on package.json)

**Run Tests**:
```bash
cd app/wine-recognition-backend
npm test
```

**Current Status**: Test files exist but implementation is minimal/placeholder

**Best Practice for Adding Tests**:
```typescript
// tests/unit/wineService.test.ts
import { WineService } from '../../src/services/wineService';

describe('WineService', () => {
  let wineService: WineService;

  beforeEach(() => {
    wineService = new WineService();
  });

  describe('findByRegion', () => {
    it('should return wines from specified region', async () => {
      const wines = await wineService.findByRegion('Bordeaux');
      expect(wines).toBeInstanceOf(Array);
      expect(wines[0].region).toBe('Bordeaux');
    });
  });
});
```

---

### Frontend Testing

**Current Status**: No test framework configured

**Linting**:
```bash
npm run lint
```

**Potential Additions**:
- Jest + React Native Testing Library
- Detox for E2E testing

---

## Deployment

### Backend Deployment (Railway)

**Configuration**: `railway.json`

**Steps**:
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Link to existing project or create new
railway link

# 4. Set environment variables
railway variables set MONGODB_URI="mongodb+srv://..."
railway variables set PORT=3001
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=$(openssl rand -base64 32)

# 5. Deploy
railway up

# 6. Get deployment URL
railway domain
```

**Build Process**:
1. Detects Node.js via Nixpacks
2. Runs `cd app/wine-recognition-backend && npm install`
3. Runs `npm run build` (TypeScript compilation)
4. Starts with `npm start` → `node dist/index.js`

**Production URL**: `https://pair-wine-backend-production.up.railway.app`

---

### Frontend Deployment (Expo)

**iOS Build**:
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure build
eas build:configure

# Build for iOS
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios --profile production
```

**Over-The-Air Updates** (for JS-only changes):
```bash
eas update --branch production --message "Fix pairing algorithm"
```

**App Configuration**: `app.json`
- Bundle ID: `com.winepairing.app`
- Permissions: Camera, Photo Library, Storage

---

### Database Deployment (MongoDB Atlas)

**Steps**:
1. Create free M0 cluster at https://cloud.mongodb.com
2. Create database user with read/write permissions
3. Whitelist IP addresses (0.0.0.0/0 for Railway)
4. Get connection string
5. Set as `MONGODB_URI` environment variable

**Connection String Format**:
```
mongodb+srv://username:password@cluster.mongodb.net/pair_wine_db?retryWrites=true&w=majority
```

**See**: `DEPLOYMENT_GUIDE.md` for detailed instructions

---

## Important Gotchas

### 1. Monorepo npm install

**Problem**: Running `npm install` at root only installs frontend dependencies

**Solution**: Install backend dependencies separately
```bash
# Frontend
npm install

# Backend
cd app/wine-recognition-backend && npm install
```

---

### 2. Metro Bundler Includes Backend

**Problem**: Without proper exclusion, Metro tries to bundle backend code

**Solution**: Already configured in `metro.config.js`
```javascript
config.resolver.blockList = [
  /app\/wine-recognition-backend\/.*/,
];
```

**Gotcha**: If you move backend location, update this path!

---

### 3. Password Hash Selection

**Problem**: Forgetting to select passwordHash causes authentication to fail

**Wrong**:
```typescript
const user = await User.findOne({ email });
await user.comparePassword(password);  // ❌ passwordHash is undefined
```

**Correct**:
```typescript
const user = await User.findOne({ email }).select('+passwordHash');
await user.comparePassword(password);  // ✅ Works
```

---

### 4. Token Not Persisting

**Problem**: Token lost on app restart

**Solution**: Ensure AsyncStorage is used
```typescript
// Save on login
await AsyncStorage.setItem('authToken', token);

// Load on app start (in AuthContext)
useEffect(() => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    // Verify and set user
  }
}, []);
```

---

### 5. CORS Issues in Development

**Problem**: Frontend can't connect to backend locally

**Solution**: Ensure CORS is configured in backend
```typescript
// src/app.ts
import cors from 'cors';
app.use(cors({
  origin: ['http://localhost:19006', 'exp://localhost:19000'],
  credentials: true,
}));
```

---

### 6. Environment Variables in Expo

**Problem**: `process.env` doesn't work in React Native

**Solution**: Use `__DEV__` global or expo-constants
```typescript
// ✅ Works
const apiUrl = __DEV__
  ? 'http://localhost:3001/api'
  : 'https://production-url.com/api';

// ❌ Doesn't work
const apiUrl = process.env.API_URL;
```

---

### 7. TypeScript Compilation Before Deployment

**Problem**: Forgetting to compile TypeScript causes runtime errors

**Solution**: Use `postinstall` script (already configured)
```json
// package.json
{
  "scripts": {
    "postinstall": "npm run build"
  }
}
```

**Railway**: Automatically runs this on deployment

---

### 8. Image Uploads Path

**Problem**: Multer saves images to `uploads/` but it's not publicly accessible

**Current Status**: Placeholder - images not yet persisted to CDN

**TODO**: Integrate with Cloudinary or AWS S3
```typescript
// Future implementation
import cloudinary from 'cloudinary';
const result = await cloudinary.uploader.upload(file.path);
return result.secure_url;
```

---

### 9. ML Recognition Service is Placeholder

**Problem**: `recognitionService.ts` has placeholder implementation

**Current Status**: Returns mock data
```typescript
async recognizeWine(image: Buffer): Promise<string> {
  return 'Placeholder wine label';  // ← Not real ML
}
```

**TODO**: Integrate actual ML model or external API

---

### 10. React Query Underutilized

**Opportunity**: TanStack Query is installed but not used

**Benefit**: Better server state management, automatic caching, background refetching

**Example Migration**:
```typescript
// Current pattern (in components)
const [wines, setWines] = useState([]);
useEffect(() => {
  const fetchWines = async () => {
    const data = await apiClient.get('/wines');
    setWines(data.data);
  };
  fetchWines();
}, []);

// Recommended pattern (with React Query)
const { data: wines, isLoading, error } = useQuery({
  queryKey: ['wines'],
  queryFn: () => apiClient.get('/wines').then(res => res.data.data),
});
```

---

## Additional Resources

- **Expo Documentation**: https://docs.expo.dev
- **Expo Router**: https://expo.github.io/router/docs
- **Mongoose**: https://mongoosejs.com/docs
- **Railway**: https://docs.railway.app
- **MongoDB Atlas**: https://docs.mongodb.com/atlas
- **TanStack Query**: https://tanstack.com/query/latest

---

## Quick Reference Commands

```bash
# Frontend
npm start                              # Start Expo dev server
npm run lint                          # Run ESLint
./start-frontend.sh                   # Convenience script

# Backend
cd app/wine-recognition-backend
npm run dev                           # Start with nodemon + ts-node
npm run build                         # Compile TypeScript
npm start                             # Run production build
npm test                              # Run tests
./start-backend.sh                    # Convenience script (from root)

# Deployment
railway login                         # Login to Railway
railway up                            # Deploy backend
eas build --platform ios              # Build iOS app
eas submit --platform ios             # Submit to App Store
eas update                            # OTA update

# Database
mongosh "connection-string"           # Connect to MongoDB
```

---

## Summary for AI Assistants

**When working on this codebase**:

1. ✅ **Understand the monorepo structure** - two separate `package.json` files
2. ✅ **Use TypeScript strictly** - always provide type annotations
3. ✅ **Follow naming conventions** - PascalCase for components/models, camelCase for utils/services
4. ✅ **Respect the MVC pattern** - Controller → Service → Model
5. ✅ **Use the standard error format** - `{ success, message, data/error }`
6. ✅ **Always exclude passwordHash** - use `select: false` in schema
7. ✅ **Index frequently queried fields** - add indexes to schemas
8. ✅ **Use Context for state** - AuthContext and AppContext are primary
9. ✅ **Protect sensitive routes** - use `authenticate` middleware
10. ✅ **Test locally before deployment** - run both frontend and backend

**Remember**: This codebase is production-ready for deployment but has areas for enhancement (testing, ML implementation, React Query usage).

---

**Last Updated**: 2025-11-15
**Version**: 1.0.0
