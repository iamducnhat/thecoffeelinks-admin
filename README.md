# ☕ The Coffee Links - Admin Panel

Complete back-office management dashboard for store owners and administrators.

---

## 📊 Features

| Feature | Description |
|---------|-------------|
| 📊 **Dashboard** | Overview statistics and quick actions |
| ☕ **Products** | Full CRUD for menu items with images |
| 📅 **Events** | Promotional event management |
| 🏷️ **Vouchers** | Discount code management |
| 🎁 **Rewards** | Loyalty program rewards |
| 📍 **Stores** | Store location management |
| ⚙️ **Settings** | Admin configuration |

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev -- -p 3003
```

Open [http://localhost:3003](http://localhost:3003) in your browser.

---

## ⚙️ Environment Variables

Create a `.env.local` file:

```env
# API Server URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# Admin Authentication Secret
ADMIN_SECRET=your-secure-admin-secret

# Supabase (for image uploads)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 🔐 Authentication

The admin panel uses a simple username/password authentication:

1. Navigate to `/login`
2. Enter admin credentials
3. On success, an `admin_token` cookie is set
4. Middleware protects all dashboard routes

### Default Credentials

Set `ADMIN_SECRET` in your environment. The login format:
- **Username:** `admin`
- **Password:** (must match `ADMIN_SECRET`)

### Changing Password

Update the `ADMIN_SECRET` environment variable in Vercel:

1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Update `ADMIN_SECRET` value
3. Redeploy the application

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/            # Login page
│   │   └── login/
│   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── page.tsx       # Dashboard home
│   │   ├── products/      # Product management
│   │   │   ├── page.tsx   # List products
│   │   │   ├── new/       # Create product
│   │   │   └── [id]/      # Edit product
│   │   ├── events/        # Event management
│   │   ├── vouchers/      # Voucher management
│   │   ├── rewards/       # Reward management
│   │   ├── stores/        # Store management
│   │   └── settings/      # Admin settings
│   ├── api/               # API routes
│   │   ├── login/         # Admin login
│   │   └── logout/        # Admin logout
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
│
├── components/
│   ├── Sidebar.tsx        # Navigation sidebar
│   └── ImageUpload.tsx    # Image upload component
│
├── lib/
│   └── supabase.ts        # Supabase client
│
└── middleware.ts          # Auth middleware
```

---

## 🎨 Design System

The admin panel uses a premium coffee-themed design:

### Color Palette

| Token | Color | Usage |
|-------|-------|-------|
| `caramel` | `#c8956c` | Primary actions |
| `espresso` | `#3d2317` | Sidebar header |
| `gold` | `#d4af37` | Premium accents |
| `cream` | `#f5e6d3` | Highlights |

### UI Components

- **Animated Sidebar** - Gradient icons, active indicators
- **Stat Cards** - Hover lift effect with shadows
- **Data Tables** - Rounded corners, hover states
- **Form Inputs** - Focus glow effects
- **Action Buttons** - Gradient primary buttons

---

## ☕ Product Management

### Creating a Product

1. Navigate to Products → Add Product
2. Fill in product details:
   - Name
   - Description
   - Base Price
   - Category (coffee, tea, smoothies, pastries, seasonal)
   - Upload image (optional)
   - Mark as Popular/New (optional)
3. Save product

### Editing a Product

1. Click on product row in table
2. Modify fields
3. Save changes

### Deleting a Product

1. Click delete button on product row
2. Confirm deletion

---

## 📅 Event Management

Events appear in the client app's hero carousel.

### Event Fields

| Field | Description |
|-------|-------------|
| Title | Event name |
| Subtitle | Short description |
| Type | Event category |
| Background | Color class (e.g., `bg-primary`) |
| Icon | Lucide icon name |

---

## 🏷️ Voucher Management

### Voucher Types

1. **Fixed Amount** - `discount: 50000` (50,000đ off)
2. **Percentage** - `discountPercent: 20` (20% off)

### Voucher Fields

| Field | Description |
|-------|-------------|
| Code | Unique voucher code |
| Discount | Fixed amount (VND) |
| Discount Percent | Percentage off |
| Min Order | Minimum order value |
| Expires At | Expiration date |
| Is Active | Enable/disable voucher |

---

## 🎁 Reward Management

Rewards can be redeemed by customers using points.

### Reward Fields

| Field | Description |
|-------|-------------|
| Name | Reward name |
| Description | Reward details |
| Points Required | Points needed to redeem |
| Type | free_product, discount, etc. |
| Value | Discount amount or product ID |

---

## 📍 Store Management

Manage store locations for order pickup.

### Store Fields

| Field | Description |
|-------|-------------|
| Name | Store name |
| Address | Street address |
| City | City name |
| Phone | Contact number |
| Hours | Operating hours |
| Is Active | Enable/disable store |

---

## 🖼️ Image Upload

Products support image uploads via Supabase Storage:

1. Click "Upload Image" on product form
2. Select image file (JPEG, PNG, WebP)
3. Image is uploaded to Supabase Storage
4. URL is saved with product

### Storage Configuration

Ensure Supabase Storage bucket `product-images` exists with public access.

---

## 🚀 Deployment

### Vercel Deployment

```bash
vercel --prod
```

### Environment Variables in Vercel

Set these in Vercel project settings:

- `NEXT_PUBLIC_API_URL`
- `ADMIN_SECRET`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🧪 Development

### Running Locally

```bash
npm run dev -- -p 3003
```

### Building

```bash
npm run build
```

### Linting

```bash
npm run lint
```

---

## 📄 License

Private and proprietary to The Coffee Links.
