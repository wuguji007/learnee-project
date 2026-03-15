import React, { useState, useEffect } from 'react';
import { Mail, Phone, MessageCircle } from 'lucide-react';

export default function Footer() {

    return (
        <footer className="bg-[#065a4f] text-white py-12 border-t border-gray-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#e7fdfb] rounded-lg flex items-center justify-center text-[#021815] font-bold text-xl">L</div>
                        <span className="text-xl font-bold tracking-tight">LEARNEE</span>
                    </div>

                    <div className="text-sm text-[#cbe3e2]">
                        copyright © 2026 LEARNEE - All Rights Reserved.
                    </div>

                    <div className="flex items-center gap-6">
                        <a href="#" className="text-white hover:text-white/50 text-sm">常見問題</a>
                        <a href="#" className="text-white hover:text-white/50 text-sm">關於我們</a>
                        <a href="#" className="text-white hover:text-white/50 text-sm">隱私權政策</a>
                        <a href="#" className="text-white hover:text-white/50 text-sm">使用者條款</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                            <MessageCircle size={20} />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                            <Phone size={20} />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                            <Mail size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    ) 
}