import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa'

export default function Footer() {
    return (
        <footer className="bg-gray-100 dark:bg-zinc-950 py-10 px-4 md:px-20 lg:px-40 text-gray-700 dark:text-gray-300">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <div className="mb-6 md:mb-0 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Bếp ẩm thực TastyScan</h2>
                    <p className="mt-2 text-sm">
                        Sự tiện lợi trong mỗi lần quét, hương vị trong mỗi món ăn.
                    </p>
                </div>

                <div className="mb-6 md:mb-0">
                    <ul className="mt-4 space-y-2">
                        <li>
                            <a href="/term-of-service" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                                Điều khoản dịch vụ
                            </a>
                        </li>
                        <li>
                            <a href="/privacy-policy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                                Chính sách bảo mật
                            </a>
                        </li>
                        <li>
                            <a href="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                                Về chúng tôi
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="flex space-x-4">
                    <a href="https://www.facebook.com/profile.php?id=100032039688900" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300">
                        <FaFacebook size={24} />
                    </a>
                    <a href="https://www.tiktok.com/@tinas_0603" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                        <FaTiktok size={24} />
                    </a>
                    <a href="https://www.instagram.com/tinas0603_/" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-300">
                        <FaInstagram size={24} />
                    </a>
                </div>
            </div>
            <div className="border-t border-gray-300 dark:border-gray-700 mt-10 pt-6 text-center text-sm">
                &copy; 2024 Bếp ẩm thực TastyScan. Tất cả các quyền đã được bảo lưu.
            </div>
        </footer>
    )
}
