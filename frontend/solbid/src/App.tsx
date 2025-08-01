import {  Routes, Route } from 'react-router-dom';
import Index from './pages/index';
import Header from "./pages/components/header";

import ProductRegister from "./pages/product/productRegister";
import ProductListByCategory from "./pages/product/productListByCategory";
import ProductListByAuction from "./pages/product/productListByAuction";
import ProductListBySearch from "./pages/product/productListBySearch";
import ProductListByBrand from "./pages/product/productListByBrand";
import ProductListByRank from "./pages/product/productListByRank";

function App() {
    return (
        <>
        <Header/>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/productRegister" element={<ProductRegister />} />
                <Route path="/productListByCategory/:categoryName" element={<ProductListByCategory />} />
                <Route path="/productListByAuction" element={<ProductListByAuction />} />
                <Route path="/productListBySearch" element={<ProductListBySearch />} />
                <Route path="/productListByBrand" element={<ProductListByBrand />} />
                <Route path="/productListByRank" element={<ProductListByRank />} />

                {/* 라우터 페이지 이곳에 계속 추가 */}
            </Routes>
        </>
    );
}

export default App;