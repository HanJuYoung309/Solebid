import { ProfileAccount, ProfileHeader, ProfileInfo, ProfileMenu, ProfileOrder, ProfileStats, ProfileUser } from "../components";
import ProfilePoint from "../components/ProfilePoint";
import ProfileWish from "../components/ProfileWish";

const App = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <ProfileHeader />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-12 gap-8">
                    {/* Left Sidebar */}
                    <aside className="col-span-3">
                        <ProfileUser />
                        <ProfileMenu />
                    </aside>
                    {/* Main Content */}
                    <section className="col-span-6">
                        <ProfileStats />
                        <ProfileOrder />
                        <ProfileWish />
                    </section>
                    {/* Right Sidebar */}
                    <aside className="col-span-3">
                        <ProfileInfo />
                        <ProfilePoint />
                        <ProfileAccount />
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default App;