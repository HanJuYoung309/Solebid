import { Fragment, useState } from "react";
import Modal from "../../../components/Modal";

const InfoEditFormat = ({ onClose }: { onClose: () => void }) => {
    const [email, setEmail] = useState("minsu.kim@email.com");
    const [phone, setPhone] = useState("010-1234-5678");
    const [address, setAddress] = useState("서울특별시 강남구 테헤란로 123 ABC빌딩 456호");

    const handleSave = () => {
        console.log("Updated info: ", { email, phone, address });
        alert("개인정보가 성공적으로 업데이트되었습니다.");
        onClose();
    };

    return (
        <Fragment>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                개인정보 수정
            </h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        이메일
                    </label>
                    <input
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label
                        className="block text-sm font-medium text-gray-700 mb-2">
                        연락처
                    </label>
                    <input
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        주소
                    </label>
                    <textarea
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows={2} />
                </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
                <button
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 !rounded-button whitespace-nowrap"
                    onClick={onClose}>
                    취소
                </button>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 !rounded-button whitespace-nowrap"
                    onClick={handleSave}>
                    저장
                </button>
            </div>
        </Fragment>
    );
};

const PersonalInfo = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                개인정보
            </h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        이메일
                    </label>
                    <div className="text-gray-900">
                        minsu.kim@email.com
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        연락처
                    </label>
                    <div className="text-gray-900">
                        010-1234-5678
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        주소
                    </label>
                    <div className="text-gray-900 text-sm">
                        서울특별시 강남구 테헤란로 123
                        <br />
                        ABC빌딩 456호
                    </div>
                </div>
                <button
                    className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer !rounded-button whitespace-nowrap"
                    onClick={() => setIsModalOpen(true)}>
                    정보 수정
                </button>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}>
                <InfoEditFormat onClose={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default PersonalInfo;