import { type ReactNode } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface ScrollRevealProps {
    children: ReactNode;
    animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'fade';
    delay?: number;
}

const ScrollReveal = ({ children, animation = 'fade-up', delay = 0 }: ScrollRevealProps) => {
    const { elementRef, isVisible } = useScrollAnimation();

    const animationClasses = {
        'fade-up': 'translate-y-12 opacity-0',
        'fade-down': '-translate-y-12 opacity-0',
        'fade-left': 'translate-x-12 opacity-0',
        'fade-right': '-translate-x-12 opacity-0',
        'zoom-in': 'scale-95 opacity-0',
        'fade': 'opacity-0',
    };

    const visibleClasses = 'translate-y-0 translate-x-0 scale-100 opacity-100';

    return (
        <div
            ref={elementRef}
            className={`transition-all duration-700 ease-out ${isVisible ? visibleClasses : animationClasses[animation]
                }`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

export default ScrollReveal;
