declare module '@microlink/react' {
    import * as React from 'react';

    interface MicrolinkCardProps extends React.HTMLAttributes<HTMLDivElement> {
        url: string;
        size?: 'small' | 'large';
        media?: boolean;
        description?: boolean;
        title?: boolean;
    }

    const MicrolinkCard: React.FC<MicrolinkCardProps>;
    export default MicrolinkCard;
}