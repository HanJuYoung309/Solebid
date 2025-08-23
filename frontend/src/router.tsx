import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import MainPage from './features/main/pages/MainPage';
import OrderPage from "./features/order/pages/OrderPage.tsx";
import AuctionBidPage from './features/product/pages/AuctionBidPage';
import AuctionPage from './features/product/pages/AuctionPage';
import BrandPage from './features/product/pages/BrandPage';
import CategoryPage from './features/product/pages/CategoryPage';
import RankingPage from './features/product/pages/RankingPage';
import SearchPage from './features/product/pages/SearchPage';
import ProfilePage from './features/profile/pages/ProfilePage';
import Login from "./features/user/pages/Login.tsx";
import NicknameSetup from "./features/user/pages/NicknameSetup.tsx";
import OAuth2Callback from "./features/user/pages/OAuth2Callback.tsx";
import Signup from "./features/user/pages/Signup.tsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route path="/" element={<MainPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback/:provider" element={<OAuth2Callback />} />
            <Route path="/nickname-setup" element={<NicknameSetup />} />
            <Route path="/auction" element={<AuctionPage />} />
            <Route path="/auction/bid" element={<AuctionBidPage />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/brand" element={<BrandPage />} />
            <Route path="/ranking" element={<RankingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/order" element={<OrderPage />} />
        </Route>
    )
)

export default router;
