export default async function handler(req, res) {
    // Sirf POST allow karo
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const body = req.body;

    // Yeh fields Fluent Forms se aayenge – jo bhi tu form mein daalega woh yahan milega
    const name = body.name || body.full_name || 'Anonymous';
    const email = body.email || 'no-reply@example.com';
    const phone = body.phone || body.mobile || '';
    const subject = body.subject || 'New Form Submission';
    const message = body.message || body.description || body.comments || 'No message';

    // ←←← YAHAN APNA FRESHDESK DETAIL DAAL DE ←←←
    const FRESHDESK_DOMAIN = 'eunoiamobility.freshdesk.com';  // ← CHANGE KAR
    const API_KEY = 'Bi5qaHnAUUD1YnzSQUOp';                    // ← Freshdesk API Key
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
    const ticketData = {
        name: name,
        email: email,
        phone: phone,
        subject: subject,
        description: `Message:\n${message}\n\nPhone: ${phone}\nSubmitted from WordPress Form`,         
        status: 2,           // 2 = Open
        priority: 1,         // 1=Low, 2=Medium, 3=High, 4=Urgent                                                                                     
        source: 7,           // 7 = Web Form
        type: "Inquiry",     // optional – jo type Freshdesk mein bana rakha hai
        // custom_fields bhi daal sakta hai agar chahiye
        // custom_fields: { cf_city: body.city || '' }
    };

    try {
        const response = await fetch(`https://${FRESHDESK_DOMAIN}/api/v2/tickets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from(API_KEY + ':X').toString('base64')
            },
            body: JSON.stringify(ticketData)
        });

        if (response.status === 201) {
            res.status(200).json({ success: true, message: 'Ticket created' });
        } else {
            const errorText = await response.text();
            res.status(500).json({ error: 'Freshdesk rejected', status: response.status, details: errorText });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
