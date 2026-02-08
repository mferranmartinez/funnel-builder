# Modern Dashboard Architecture

## Architecture

Project Structure

```
src/
├── features/              # Feature-based modules
│   ├── funnels/
│   │   ├── api/          # API hooks (useFunnels, useFunnelById)
│   │   ├── components/   # Feature-specific components
│   │   ├── routes/       # Route components (FunnelsPage, FunnelDetailPage)
│   │   └── index.ts      # Public API
│   ├── orders/
│   ├── customers/
│   ├── subscriptions/
│   ├── analytics/
│   ├── disputes/
│   └── settings/
├── shared/
│   ├── components/       # Button, Table, Modal, etc.
│   ├── layouts/          # DashboardLayout, AuthLayout
│   ├── hooks/           # useDebounce, useMediaQuery
│   └── utils/           # formatDate, formatCurrency
├── lib/                 # Third-party setup
│   ├── query-client.ts  # TanStack Query config
│   ├── router.ts        # TanStack Router config
│   └── api.ts          # Axios/fetch wrapper
└── types/              # Shared TypeScript types
```

## Design System

### Component Library Choice: I'll create the components myself using Tailwind CSS.

### Enforcing Consistency

// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      brand: { 50: '...', 500: '...', 900: '...' },
      semantic: { success: '...', error: '...', warning: '...' }
    },
    spacing: {  },
    typography: { }
  }
}
```

**Component Library (`shared/components/`):**
- `Button`, `Input`, `Select`, `Table`, `Card`, etc.
- All components accept `asChild` prop for composability
- Variants handled via `cva` (class-variance-authority)

**Storybook:** Document all shared components with accessibility checks via `@storybook/addon-a11y`


## Data Fetching + State

### Server State: **TanStack Query**

Why I use
- Automatic caching, deduplication, background refetching
- Stale-while-revalidate pattern keeps UI fast
- Optimistic updates for mutations


### Loading/Error/Empty States

Patten code:
<QueryBoundary
  loading={<TableSkeleton rows={10} />}
  error={(error) => <ErrorState error={error} />}
  empty={<EmptyState title="No funnels" action={<CreateFunnelButton />} />}
>
  {(data) => <FunnelsTable data={data} />}
</QueryBoundary>
```

### Table State Management

`TanStack Table` for filters, sorting, pagination
Filter/sort params stored in URL query params via TanStack Router for shareable links.

## Performance

### Rendering Optimization

- Memoization: `useMemo` for expensive computations, `React.memo` for large lists
- Debouncing: Search inputs debounced with `useDebounce` hook
- Optimistic updates: Mutations update cache immediately, rollback on error

### Instrumentation

Sentry Performance + Web Vitals**
