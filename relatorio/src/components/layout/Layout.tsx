import { Outlet } from 'react-router-dom';

export function Layout() {
    return (
        <div className="cenbrap-dashboard">
            <main className="cenbrap-main" style={{ overflow: 'auto' }}>
                <Outlet />
            </main>
        </div>
    );
}
