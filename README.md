# 🥬 VendorFresh — Farm to Fork Marketplace

A modern, full-stack e-commerce platform that connects consumers directly with local Indian farmers, enabling fresh produce purchasing with seamless authentication, real-time database queries, and integrated payment checkout.

![VendorFresh](https://raw.githubusercontent.com/KAMESH101/Vendorfresh/main/images/Logo.png)

---

## 🌟 Features

- 🛒 **Shopping Cart** — Persistent cart stored in `localStorage` with live item count, quantity controls, and slide-out drawer.
- 🔐 **Authentication** — Powered by [Clerk](https://clerk.dev) with beautiful pre-built Sign In / Sign Up modals.
- 🌾 **Farmers Directory** — Browse 15+ real Indian farmers with their produce and regional backgrounds.
- 🏘️ **Village Heads** — Dedicated page showcasing regional coordinators who manage local farmer listings.
- 💳 **Razorpay Checkout** — Secure, production-ready payment flow with prefilled delivery details.
- 🗄️ **Supabase Database** — PostgreSQL backend with Row-Level Security for products, farmers, and order records.
- 🔒 **Secure Order Persistence** — Every successful payment automatically writes a full order record to Supabase.
- 🎨 **Premium UI/UX** — Glassmorphic design system, smooth Framer Motion animations, and responsive layouts.
- 🌙 **Dark Mode** — Full dark-mode support with CSS custom properties.
- 🔎 **Search & Filter** — Real-time product search and category filter on the Products page.

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 + Vite 8 |
| **Routing** | React Router v7 |
| **Animations** | Framer Motion 12 |
| **Authentication** | Clerk (`@clerk/clerk-react`) |
| **Database** | Supabase (PostgreSQL) |
| **Payments** | Razorpay Checkout JS |
| **Backend (Serverless)** | Supabase Edge Functions (Deno) |
| **Styling** | Vanilla CSS with custom design tokens |
| **Linting** | ESLint with React Hooks & Refresh plugins |

---

## 📁 Project Structure

```
vendorfresh/
├── public/                  # Static assets (favicon, icons)
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── CartDrawer.jsx
│   │   ├── ProductCard.jsx
│   │   ├── SearchBar.jsx
│   │   └── Toast.jsx
│   ├── context/             # React context providers
│   │   ├── AuthContext.jsx  # Clerk authentication wrapper
│   │   └── CartContext.jsx  # Shopping cart state
│   ├── data/                # Static data & Supabase fetch wrappers
│   │   ├── farmers.js
│   │   └── products.js
│   ├── hooks/               # Custom hooks
│   │   ├── useAuth.js
│   │   └── useCart.js
│   ├── lib/                 # SDK clients
│   │   ├── clerk.js         # Clerk key config
│   │   └── supabaseClient.js
│   ├── pages/               # Route-level page components
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── Farmers.jsx
│   │   ├── VillageHeads.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Payment.jsx
│   │   └── NotFound.jsx
│   ├── App.jsx              # Root app with routes
│   ├── main.jsx             # Entry point & ClerkProvider
│   └── index.css            # Global design system & styles
├── supabase/
│   ├── schema.sql           # Database schema (tables + RLS policies)
│   └── functions/
│       └── create-order/
│           └── index.ts     # Deno Edge Function for Razorpay order creation
├── .env.example             # Environment variable template
├── tsconfig.json
└── vite.config.js
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/KAMESH101/Vendorfresh.git
cd Vendorfresh
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example file and fill in your real API keys:

```bash
cp .env.example .env
```

Open `.env` and populate the following values:

```env
# Clerk Authentication — get from https://dashboard.clerk.com
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Supabase — get from https://supabase.com → Project Settings → API
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...

# Razorpay — get from https://dashboard.razorpay.com → Settings → API Keys
VITE_RAZORPAY_KEY_ID=rzp_test_...
```

### 4. Set Up the Supabase Database

1. Open your [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql).
2. Paste the entire contents of `supabase/schema.sql` and click **Run**.
3. This will create the `farmers`, `products`, and `orders` tables with all Row-Level Security policies.

### 5. Seed Initial Data

Run this SQL in the Supabase SQL Editor to populate the product and farmer catalog:

```sql
INSERT INTO public.farmers (id, name, region, quote, image) VALUES
('aman-singh', 'Aman Singh', 'Punjab', 'Cultivating premium basmati rice for generations.', 'https://raw.githubusercontent.com/KAMESH101/Vendorfresh/main/images/Aman%20Singh.png'),
('rashmi-barman', 'Rashmi Barman', 'Assam', 'Tea farming is an art, passed down from my mother.', 'https://raw.githubusercontent.com/KAMESH101/Vendorfresh/main/images/Rashmi%20Barman.png')
-- (and more — see the full seed in the setup guide)
ON CONFLICT (id) DO NOTHING;
```

### 6. Start the Development Server

```bash
npm run dev
```

The app will be live at **[http://localhost:5173](http://localhost:5173)**.

---

## 🗺️ Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Home | Hero section, featured products, and farmers showcase |
| `/products` | Products | Full catalog with search and category filter |
| `/farmers` | Farmers | Individual farmer profiles with their produce |
| `/village-heads` | Village Heads | Regional coordinators and their roles |
| `/about` | About | Mission, values, and story |
| `/contact` | Contact | Contact form and details |
| `/login` | Login | Clerk Sign In component |
| `/signup` | Signup | Clerk Sign Up component |
| `/payment` | Payment | Cart checkout with Razorpay integration |

---

## 🗄️ Database Schema

### `farmers`
| Column | Type | Description |
|---|---|---|
| `id` | TEXT (PK) | Slug-based identifier |
| `name` | TEXT | Farmer's full name |
| `region` | TEXT | State/district |
| `quote` | TEXT | Personal quote |
| `image` | TEXT | Profile image URL |

### `products`
| Column | Type | Description |
|---|---|---|
| `id` | TEXT (PK) | Slug-based identifier |
| `name` | TEXT | Crop/product name |
| `price` | NUMERIC | Price in INR |
| `unit` | TEXT | Unit of measure (kg, 250g, etc.) |
| `farmer_id` | TEXT (FK) | References `farmers.id` |
| `category` | TEXT | Grains / Vegetables / Fruits / Spices etc. |
| `image` | TEXT | Product image URL |

### `orders`
| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Auto-generated order ID |
| `user_id` | TEXT | Clerk User ID |
| `items` | JSONB | Purchased cart items |
| `total_amount` | NUMERIC | Total in INR |
| `payment_status` | TEXT | `pending`, `paid`, or `failed` |
| `razorpay_payment_id` | TEXT | Razorpay transaction ID |
| `delivery_*` | TEXT | Name, email, phone, address |

---

## 🔒 Security

- All API secrets (`RAZORPAY_KEY_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`) are **never** exposed to the frontend.
- The Supabase Edge Function (`create-order`) handles all server-side Razorpay communication.
- Supabase Row-Level Security (RLS) ensures users can only view their own orders.
- The `.env` file is excluded from git via `.gitignore`.

---

## 📦 Available Scripts

```bash
npm run dev       # Start local development server (http://localhost:5173)
npm run build     # Build production bundle to /dist
npm run preview   # Preview production build locally
npm run lint      # Run ESLint across all source files
```

---

## ☁️ Deploying the Supabase Edge Function

```bash
# Install Supabase CLI and log in
npm install -g supabase
supabase login

# Set Razorpay secrets for the edge function
supabase secrets set RAZORPAY_KEY_ID=rzp_test_...
supabase secrets set RAZORPAY_KEY_SECRET=your_secret

# Deploy the edge function
supabase functions deploy create-order --project-ref YOUR_PROJECT_REF
```

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

This project is licensed under the **MIT License**.

---

<p align="center">Made with ❤️ for Indian farmers by <a href="https://github.com/KAMESH101">KAMESH101</a></p>
