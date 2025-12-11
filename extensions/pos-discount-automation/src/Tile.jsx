import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks';

export default async () => {
    render(<DiscountTile />, document.body);
};

const DiscountTile = () => {
    const [cartTotal, setCartTotal] = useState(0);
    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
        // Subscribe to cart changes
        const unsubscribe = shopify.cart.subscribe((cart) => {
            const total = parseFloat(cart.subtotal || 0);
            setCartTotal(total);
            // Enable tile when cart has items
            setIsEnabled(total > 0);
        });

        return () => unsubscribe();
    }, []);

    const handleTileClick = () => {
        if (isEnabled) {
            // Present the modal when tile is clicked
            shopify.action.presentModal();
        }
    };

    return (
        <s-tile
            heading="Apply Discount"
            subheading={isEnabled ? "Tap to enter email" : "Add items to cart"}
            enabled={isEnabled}
            onClick={handleTileClick}
        />
    );
};
