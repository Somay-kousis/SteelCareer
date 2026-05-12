# Steelcareer - Complete Platform

Steelcareer is a premium international hiring and career guidance platform built with Next.js 16, Supabase, and TypeScript.

## Quick Links

- **Setup Guide**: See `SETUP.md` for complete deployment instructions
- **Testing**: See `TEST_CHECKLIST.md` for manual testing procedures
- **Security**: See `SECURITY_AUDIT.md` for security details
- **Database**: See `supabase/migrations/001_init_steelcareer.sql` for schema
- **Deployment**: See `DEPLOYMENT_CHECKLIST.md` before going to production

---

## Project Structure

```
steelcareer/
├── app/
│   ├── auth/              # Authentication pages (signin, signup)
│   ├── seeker/            # Seeker dashboard & onboarding
│   ├── provider/          # Provider dashboard & job posting
│   ├── admin/             # Admin workspace
│   ├── api/               # API routes
│   └── page.tsx           # Homepage
│
├── components/
│   ├── auth/              # Auth components (forms)
│   ├── seeker/            # Seeker onboarding steps
│   ├── provider/          # Provider components
│   ├── shared/            # Shared components
│   └── ui/                # shadcn/ui components
│
├── lib/
│   ├── supabase/          # Supabase client setup
│   └── api.ts             # API utilities
│
├── supabase/
│   └── migrations/        # Database migration
│
├── SETUP.md               # Setup instructions
├── TEST_CHECKLIST.md      # Testing checklist
├── DEPLOYMENT_CHECKLIST.md  # Pre-deployment guide
├── SECURITY_AUDIT.md      # Security audit report
├── SECURITY_AUDIT_SUMMARY.md  # Security summary
└── BACKEND.md             # Backend documentation
```

---

## Technology Stack

- **Frontend**: Next.js 16 with React 19, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with email/password
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Deployment**: Vercel
- **ORM**: Direct SQL queries with RLS

---

## Key Features

### For Seekers
- Premium guided onboarding (7 steps)
- Profile management
- Career goal tracking
- Document upload & verification
- Support request system
- Dashboard with progress tracking

### For Providers (Recruiters/Companies)
- Company profile setup
- Job posting creation
- Application management
- Meeting coordination
- Seeker browsing

### For Admins
- Seeker management dashboard
- Provider verification
- Document verification workflow
- Support request management

---

## Database Schema

### Core Tables
- **profiles**: User roles and metadata
- **seekers**: Seeker profiles and onboarding data
- **providers**: Company/recruiter information
- **job_postings**: Job opportunities
- **meetings**: Scheduled meetings
- **documents**: Resume/document uploads
- **applications**: Job applications
- **support_requests**: Support tickets

All tables have Row Level Security (RLS) enabled. See `supabase/migrations/001_init_steelcareer.sql` for complete schema.

---

## Security Features

✅ Row Level Security (RLS) on all tables
✅ Admin role immutability (cannot self-assign)
✅ Email confirmation required for operations
✅ Proper user isolation (seekers ↔ providers)
✅ API authentication on server routes
✅ Service role key protection (server-side only)
✅ No mock authentication or test accounts
✅ Database triggers for data consistency
✅ Input validation and error handling

See `SECURITY_AUDIT.md` for full details.

---

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- Supabase account
- Vercel account (for deployment)

### Quick Start (Local Development)

1. **Clone repository**
   ```bash
   git clone <your-repo>
   cd steelcareer
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup Supabase**
   - Create project on [supabase.com](https://supabase.com)
   - Run SQL migration (see SETUP.md)
   - Get API credentials

4. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

5. **Run dev server**
   ```bash
   pnpm dev
   ```
   
   Server runs on http://localhost:3000

6. **Test signup**
   - Go to http://localhost:3000/auth/signup
   - Create seeker/provider account
   - Confirm email
   - Verify onboarding flow works

### Deployment (Production)

See `SETUP.md` → "Vercel Deployment" for complete instructions.

**TL;DR**:
1. Push code to git repository
2. Connect repository to Vercel
3. Set environment variables in Vercel
4. Deploy
5. Update Supabase auth redirect URL
6. Test in production

---

## API Routes

### Public
- `GET /api/jobs` - List active job postings

### Authenticated User
- `GET /api/seeker` - Get own seeker profile
- `PUT /api/seeker` - Update own profile
- `GET /api/provider` - Get own provider profile
- `PUT /api/provider` - Update own provider profile

### Admin Only
- `GET /api/admin/seekers` - List all seekers
- `GET /api/admin/providers` - List all providers
- `GET /api/admin/documents` - List documents
- `PATCH /api/admin/documents/{id}` - Verify/reject documents

All API routes verify:
1. User is authenticated
2. User has proper role/permissions
3. User isn't accessing other users' data

---

## Development

### Environment Variables
See `.env.example` for all required variables.

**Critical**: 
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public client key
- `SUPABASE_SERVICE_ROLE_KEY` - Private (server-only), never expose
- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` - Auth callback URL

### Build & Test
```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Type check
npx tsc --noEmit

# View build output
pnpm start
```

### Database Queries

Using Supabase client:
```typescript
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
const { data, error } = await supabase
  .from('seekers')
  .select('*')
  .eq('user_id', userId);
```

**Important**: RLS policies automatically filter data based on `auth.uid()`.

### Adding Features

1. **Plan database changes**
   - Create SQL migration
   - Test in Supabase
   - Add RLS policies

2. **Build API routes**
   - Create `/app/api/...` route
   - Verify user authentication
   - Check permissions
   - Validate input

3. **Build UI components**
   - Create client component
   - Call API route or direct SQL
   - Handle errors
   - Show loading states

---

## Testing

Run the manual test checklist in `TEST_CHECKLIST.md`:

- Seeker signup/login
- Provider signup/login
- Onboarding flow
- Job posting
- File uploads
- RLS security
- Protected routes
- API endpoints

---

## Common Tasks

### Create Admin User
```sql
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'),
  '{role}',
  '"admin"'
)
WHERE email = 'admin@example.com';
```

### Reset User Password (Supabase Dashboard)
1. Go to Authentication → Users
2. Find user
3. Click options → Reset password

### View Database Logs
1. Go to Supabase → Logs
2. Select "Database" tab
3. Filter by time/query

### Monitor API Usage
1. Go to Vercel → Analytics
2. View request distribution
3. Monitor error rates

---

## Troubleshooting

### Build Fails
- Run `npm install` to ensure deps are installed
- Check `.env.local` has all required variables
- Run `npx tsc --noEmit` to find type errors

### Login Doesn't Work
- Verify email confirmation is enabled in Supabase
- Check user has confirmed email
- Verify auth redirect URL is correct

### RLS Prevents Inserts
- User must be authenticated (no unconfirmed emails)
- Verify `user_id` is passed when creating records
- Check RLS policy allows the operation

### File Upload Fails
- Verify storage bucket exists
- Check bucket is set to public
- Verify RLS policies allow authenticated uploads

See `SETUP.md` → "Troubleshooting" for more help.

---

## Performance

- Homepage: <2s load time
- API responses: <500ms
- Database queries: Indexed for common operations
- Static files: Cached on Vercel CDN
- Images: Optimized with Next.js Image component

---

## Security Notes

⚠️ **CRITICAL**:
- Never expose `SUPABASE_SERVICE_ROLE_KEY` in client code
- Never commit `.env.local` to git
- Always verify user authentication on server
- Always use RLS on sensitive tables
- Always validate user input

See `SECURITY_AUDIT.md` for full security review.

---

## Contributing

1. Create feature branch
2. Make changes
3. Run tests (manual checklist)
4. Commit with clear messages
5. Push and create PR
6. Deploy to staging for review
7. Merge to main
8. Deploy to production

---

## Documentation

- **Setup**: `SETUP.md`
- **Testing**: `TEST_CHECKLIST.md`
- **Deployment**: `DEPLOYMENT_CHECKLIST.md`
- **Security**: `SECURITY_AUDIT.md`, `SECURITY_AUDIT_SUMMARY.md`
- **Backend**: `BACKEND.md`
- **Database**: `supabase/migrations/001_init_steelcareer.sql`

---

## Support

For issues:

1. Check relevant documentation above
2. Check Supabase logs
3. Check Vercel logs
4. Review error in browser console
5. Test in local dev environment

---

## License

[Add your license here]

---

**Status**: Production Ready ✓
**Last Updated**: 2026-05-12
