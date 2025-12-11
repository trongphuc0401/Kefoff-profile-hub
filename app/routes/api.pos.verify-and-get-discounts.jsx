import { authenticate } from "../shopify.server";

/**
 * API endpoint for POS UI Extension
 * Verifies customer email and returns applicable discount codes
 */
export async function action({ request }) {
  try {
    // Authenticate using session token from POS UI extension
    const { admin, session } = await authenticate.admin(request);

    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return Response.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Search for customer by email
    const customerResponse = await admin.graphql(
      `#graphql
        query getCustomerByEmail($email: String!) {
          customers(first: 1, query: $email) {
            edges {
              node {
                id
                email
                metafields(first: 10) {
                  edges {
                    node {
                      namespace
                      key
                      value
                    }
                  }
                }
              }
            }
          }
        }
      `,
      {
        variables: {
          email: `email:${email}`,
        },
      }
    );

    const customerData = await customerResponse.json();
    const customers = customerData.data?.customers?.edges || [];

    if (customers.length === 0) {
      return Response.json({
        discountCodes: [],
        message: 'Customer not found'
      });
    }

    const customer = customers[0].node;
    const discountCodes = [];

    // Extract discount codes from customer metafields
    // Looking for metafields with namespace 'custom' and keys like 'discount_code_*'
    const metafields = customer.metafields?.edges || [];

    for (const { node: metafield } of metafields) {
      if (metafield.namespace === 'custom' && metafield.key.startsWith('discount_code')) {
        try {
          const value = JSON.parse(metafield.value);
          if (value.code) {
            discountCodes.push(value.code);
          }
        } catch (e) {
          // If not JSON, treat as plain text discount code
          if (metafield.value) {
            discountCodes.push(metafield.value);
          }
        }
      }
    }

    // Also check for discount codes with specific prefixes (S0001, G0001, etc.)
    // You can customize this logic based on your discount code structure
    const allDiscountCodesResponse = await admin.graphql(
      `#graphql
        query getDiscountCodes {
          codeDiscountNodes(first: 250) {
            edges {
              node {
                id
                codeDiscount {
                  ... on DiscountCodeBasic {
                    title
                    codes(first: 10) {
                      edges {
                        node {
                          code
                        }
                      }
                    }
                  }
                  ... on DiscountCodeBxgy {
                    title
                    codes(first: 10) {
                      edges {
                        node {
                          code
                        }
                      }
                    }
                  }
                  ... on DiscountCodeFreeShipping {
                    title
                    codes(first: 10) {
                      edges {
                        node {
                          code
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `
    );

    const discountData = await allDiscountCodesResponse.json();
    const allDiscounts = discountData.data?.codeDiscountNodes?.edges || [];

    // Filter discount codes that match customer email or specific patterns
    for (const { node } of allDiscounts) {
      const codeDiscount = node.codeDiscount;
      if (codeDiscount?.codes?.edges) {
        for (const { node: codeNode } of codeDiscount.codes.edges) {
          const code = codeNode.code;

          // Check if code matches patterns like S0001, G0001, etc.
          // or if the title contains the customer email
          if (
            code.match(/^[SG]\d{4}$/) || // Matches S0001, G0001 format
            codeDiscount.title?.toLowerCase().includes(email.toLowerCase())
          ) {
            if (!discountCodes.includes(code)) {
              discountCodes.push(code);
            }
          }
        }
      }
    }

    return Response.json({
      discountCodes,
      customerEmail: customer.email,
      message: `Found ${discountCodes.length} discount code(s)`
    });

  } catch (error) {
    console.error('Error in POS discount verification:', error);
    return Response.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function loader({ request }) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}
