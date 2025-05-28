import React from 'react';
import { Search, MapPin, Briefcase, TrendingUp, Users } from 'lucide-react';

type Props = {
    heading: string;
    description: string;
}

const defaultProps: Props = {
    heading: "Latest Job Listings",
    description: "Find the latest job listings here"
}

export default function JobHeader(props: Props) {
    const { heading, description } = {
        ...defaultProps,
        ...props,
    };

    return (
        <div className="relative mt-8 overflow-hidden">

            <div className="container mx-auto px-[10%] sm:px-[5%] lg:px-[10%] py-2 sm:py-4 lg:py-8 relative z-10">
                {/* Main header content */}
                <div className="text-center max-w-4xl mx-auto mb-2 sm:mb-4">
                    <div className="inline-flex items-center bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-full px-[10%] py-2 mb-6 shadow-sm">
                        <TrendingUp className="w-4 h-4 text-brand mr-2" />
                        <span className="text-sm font-medium text-gray-700">Seize every opportunity</span>
                    </div>
                    
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                        {heading}
                    </h1>
                    
                    <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                        {description}
                    </p>
                </div>


            </div>
        </div>
    );
}