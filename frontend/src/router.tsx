import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/layout';
import Dashboard from '@/pages/Dashboard';
import Markets from '@/pages/Markets';
import Symbol from '@/pages/Symbol'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Dashboard />
            },
            {
                path: 'markets',
                element: <Markets />
            },
            {
                path: 'symbol',
                element: <Symbol />
            }
        ]
    }
])