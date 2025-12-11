import { render } from 'preact';
import { useState } from 'preact/hooks';

export default async () => {
    render(<DiscountModal />, document.body);
};

const DiscountModal = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.currentTarget.value);
    };

    const applyDiscountCodes = async () => {
        if (!email || !email.includes('@')) {
            shopify.toast.show('Please enter a valid email address', { isError: true });
            return;
        }

        setLoading(true);
        setMessage('Verifying email and finding discount codes...');

        try {
            // Call your backend API to verify email and get discount codes
            // Relative URLs are automatically resolved against app_url and include Authorization header
            const response = await fetch('/api/pos/verify-and-get-discounts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Failed to verify email or fetch discount codes');
            }

            const data = await response.json();

            if (!data.discountCodes || data.discountCodes.length === 0) {
                shopify.toast.show('No discount codes found for this email', { isError: false });
                setMessage('No discount codes available');
                setLoading(false);
                return;
            }

            // Apply all discount codes to cart
            setMessage(`Applying ${data.discountCodes.length} discount code(s)...`);

            for (const code of data.discountCodes) {
                try {
                    await shopify.cart.addDiscount(code);
                } catch (error) {
                    console.error(`Failed to apply discount code ${code}:`, error);
                }
            }

            // Show success message
            shopify.toast.show(`Successfully applied ${data.discountCodes.length} discount code(s)!`, {
                isError: false
            });

            // Close modal after success
            setTimeout(() => {
                shopify.modal.close();
            }, 1500);

        } catch (error) {
            console.error('Error applying discount codes:', error);
            shopify.toast.show('Failed to apply discount codes. Please try again.', {
                isError: true
            });
            setMessage('Error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        shopify.modal.close();
    };

    return (
        <s-modal>
            <s-page title="Apply Customer Discounts">
                <s-section>
                    <s-text>
                        Enter customer email to automatically apply their discount codes
                    </s-text>

                    <s-emailfield
                        id="customer-email"
                        label="Customer Email"
                        value={email}
                        input={handleEmailChange}
                        placeholder="customer@example.com"
                    />

                    {message && (
                        <s-text style={{ marginTop: '12px', color: '#666' }}>
                            {message}
                        </s-text>
                    )}
                </s-section>

                <s-section>
                    <s-stack>
                        <s-button
                            title="Apply Discounts"
                            onClick={applyDiscountCodes}
                            disabled={loading || !email}
                            primary
                        />
                        <s-button
                            title="Cancel"
                            onClick={handleCancel}
                            disabled={loading}
                        />
                    </s-stack>
                </s-section>
            </s-page>
        </s-modal>
    );
};
