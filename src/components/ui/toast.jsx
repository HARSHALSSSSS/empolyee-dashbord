import { Toaster } from 'react-hot-toast'

export { Toaster }

export const toastConfig = {
  duration: 4000,
  position: 'top-right',
  style: {
    background: 'hsl(var(--card))',
    color: 'hsl(var(--card-foreground))',
    border: '1px solid hsl(var(--border))',
  },
  success: {
    iconTheme: {
      primary: 'hsl(var(--primary))',
      secondary: 'white',
    },
  },
  error: {
    iconTheme: {
      primary: 'hsl(var(--destructive))',
      secondary: 'white',
    },
  },
}
